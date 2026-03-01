/**
 * Sync Service
 * Handles online/offline detection and background synchronization
 */

import { db, LocalTransaction, LocalProduct, LocalCategory, LocalCustomer, LocalStore } from './db';
import { orderService, paymentService, productService, categoryService, customerService, storeService } from '@/services';
import type { ApiProduct, ApiCategory, ApiCustomer, ApiStore } from '@/services';
import { networkMonitor } from './network-quality-monitor';

// ==================== Online/Offline Detection ====================

let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
let onlineListeners: Array<(online: boolean) => void> = [];

/**
 * Check if network quality is good enough for syncing.
 * Syncs on any connection that isn't fully offline.
 * Poor connections are slow but can still transfer data.
 */
function isNetworkGoodForSync(): boolean {
  const stats = networkMonitor.getCurrentStats();
  return stats.quality !== 'offline';
}

/**
 * Initialize online/offline listeners
 */
export function initializeOnlineDetection() {
  if (typeof window === 'undefined') return;

  // Update online status
  const updateOnlineStatus = () => {
    isOnline = navigator.onLine;
    notifyOnlineListeners(isOnline);

    // If coming back online, trigger sync
    if (isOnline) {
      console.log('✅ Connection restored - starting sync...');
      syncPendingTransactions().catch(console.error);
    } else {
      console.log('❌ Connection lost - working offline');
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // Initial check
  updateOnlineStatus();
}

/**
 * Subscribe to online/offline changes
 */
export function onOnlineStatusChange(callback: (online: boolean) => void) {
  onlineListeners.push(callback);

  // Call immediately with current status
  callback(isOnline);

  // Return unsubscribe function
  return () => {
    onlineListeners = onlineListeners.filter(cb => cb !== callback);
  };
}

/**
 * Notify all listeners of online status change
 */
function notifyOnlineListeners(online: boolean) {
  onlineListeners.forEach(callback => callback(online));
}

/**
 * Get current online status
 */
export function getOnlineStatus(): boolean {
  return isOnline;
}

// ==================== Data Caching (API → IndexedDB) ====================

/**
 * Cache products from API to IndexedDB
 */
export async function cacheProducts(products: ApiProduct[]): Promise<void> {
  const localProducts: LocalProduct[] = products.map(p => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    barcode: p.barcode || null,
    price: p.price,
    stock: p.stock,
    category_id: p.category?.id || null,
    category_name: p.category?.name,
    unit: p.unit || 'pc',
    image_url: (p as any).image_url,
    is_active: p.is_active !== false,
    last_synced: new Date()
  }));

  await db.products.bulkPut(localProducts);
  console.log(`✅ Cached ${products.length} products to IndexedDB`);
}

/**
 * Cache categories from API to IndexedDB
 */
export async function cacheCategories(categories: ApiCategory[]): Promise<void> {
  const localCategories: LocalCategory[] = categories.map(c => ({
    id: c.id,
    name: c.name,
    description: c.description,
    last_synced: new Date()
  }));

  await db.categories.bulkPut(localCategories);
  console.log(`✅ Cached ${categories.length} categories to IndexedDB`);
}

/**
 * Cache customers from API to IndexedDB
 */
export async function cacheCustomers(customers: ApiCustomer[]): Promise<void> {
  const localCustomers: LocalCustomer[] = customers.map(c => ({
    id: c.id,
    name: c.name,
    email: c.email || undefined,
    phone: c.phone || undefined,
    status: c.status as string,
    last_synced: new Date()
  }));

  await db.customers.bulkPut(localCustomers);
  console.log(`✅ Cached ${customers.length} customers to IndexedDB`);
}

/**
 * Cache stores from API to IndexedDB
 */
export async function cacheStores(stores: ApiStore[]): Promise<void> {
  const localStores: LocalStore[] = stores.map(s => ({
    id: s.id,
    name: s.name,
    is_active: s.is_active !== false,
    last_synced: new Date()
  }));

  await db.stores.bulkPut(localStores);
  console.log(`✅ Cached ${stores.length} stores to IndexedDB`);
}

// ==================== Transaction Sync ====================

/**
 * Save transaction locally (offline-first)
 */
export async function saveTransactionLocally(transaction: Omit<LocalTransaction, 'uuid' | 'created_at' | 'synced' | 'sync_attempts'>): Promise<string> {
  const uuid = crypto.randomUUID();

  const localTransaction: LocalTransaction = {
    ...transaction,
    uuid,
    created_at: new Date(),
    synced: false,
    sync_attempts: 0
  };

  await db.transactions.add(localTransaction);
  console.log(`💾 Transaction saved locally: ${uuid}`);

  // Try to sync immediately if online
  if (isOnline) {
    syncSingleTransaction(uuid).catch(err => {
      console.error(`Failed to sync transaction immediately:`, err);
      // Already in local DB, will retry later
    });
  }

  return uuid;
}

/**
 * Sync single transaction to server
 */
export async function syncSingleTransaction(uuid: string): Promise<void> {
  const transaction = await db.transactions.get(uuid);

  if (!transaction) {
    throw new Error(`Transaction ${uuid} not found`);
  }

  if (transaction.synced) {
    console.log(`Transaction ${uuid} already synced`);
    return;
  }

  try {
    // Create order on server
    const orderPayload: Record<string, any> = {
      customer_id: transaction.customer_id,
      ordered_at: transaction.ordered_at,
      status: transaction.status,
      total: Math.round(transaction.total),
      items: transaction.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: Math.round(item.price)
      }))
    };

    // Only include store_id if set — sending null/undefined causes 422
    if (transaction.store_id) {
      orderPayload.store_id = transaction.store_id;
    }

    const order = await orderService.create(orderPayload as any);
    console.log(`✅ Order created on server: ${order.id}`);

    // Create payment(s) on server
    const paymentTime = new Date(transaction.created_at);
    const paidAt = `${paymentTime.toISOString().split('T')[0]} ${paymentTime.toTimeString().slice(0, 5)}`;

    if (transaction.payment_methods && transaction.payment_methods.length > 1) {
      // Split payment
      await Promise.all(
        transaction.payment_methods.map(pm =>
          paymentService.create({
            order_id: order.id as unknown as number,
            amount: Math.round(pm.amount),
            method: pm.method,
            status: 'completed',
            paid_at: paidAt
          })
        )
      );
    } else {
      // Single payment
      await paymentService.create({
        order_id: order.id as unknown as number,
        amount: Math.round(transaction.amount_tendered),
        method: transaction.payment_method,
        status: 'completed',
        paid_at: paidAt
      });
    }

    console.log(`✅ Payment created on server`);

    // Update inventory (non-blocking)
    productService.bulkStockDecrement({
      items: transaction.items.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
        variantSku: null
      })),
      orderId: `ORD-${order.id}`
    }).catch(() => {
      console.warn('Inventory update failed (non-critical)');
    });

    // Mark as synced
    await db.transactions.update(uuid, {
      synced: true,
      synced_at: new Date(),
      order_id: order.id as unknown as number,
      last_sync_error: undefined
    });

    console.log(`✅ Transaction ${uuid} synced successfully`);

  } catch (err: any) {
    // Increment sync attempts
    await db.transactions.update(uuid, {
      sync_attempts: transaction.sync_attempts + 1,
      last_sync_error: err?.message || 'Unknown error'
    });

    const responseData = err?.response?.data;
    console.error(`❌ Failed to sync transaction ${uuid} — raw error:`, err);
    console.error(`❌ Sync error details:`, {
      type: typeof err,
      isAxiosError: err?.isAxiosError,
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      message: responseData?.message || err?.message,
      errors: responseData?.errors || null,
      responseData: JSON.stringify(responseData, null, 2),
    });
    console.error(`❌ Transaction payload that failed:`, JSON.stringify({
      customer_id: transaction.customer_id,
      ordered_at: transaction.ordered_at,
      status: transaction.status,
      store_id: transaction.store_id,
      total: Math.round(transaction.total),
      items: transaction.items,
    }, null, 2));
    throw err;
  }
}

/**
 * Calculate exponential backoff delay
 */
function getBackoffDelay(retryCount: number): number {
  const baseDelay = 1000; // 1 second
  const maxDelay = 60000; // 60 seconds
  const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
  // Add jitter (0-25% of delay)
  return delay + Math.random() * delay * 0.25;
}

const MAX_RETRIES = 5;

/**
 * Sync all pending transactions (batch) with exponential backoff
 */
export async function syncPendingTransactions(
  onProgress?: (synced: number, total: number) => void
): Promise<{ synced: number; failed: number }> {
  const allTransactions = await db.transactions.toArray();
  const pending = allTransactions.filter(t =>
    t.synced === false && t.sync_attempts < MAX_RETRIES
  );

  if (pending.length === 0) {
    return { synced: 0, failed: 0 };
  }

  // Check network quality before syncing
  if (!isNetworkGoodForSync()) {
    const stats = networkMonitor.getCurrentStats();
    console.log(`Skipping sync - network quality is ${stats.quality}`);
    return { synced: 0, failed: 0 };
  }

  console.log(`Syncing ${pending.length} pending transactions...`);

  let synced = 0;
  let failed = 0;

  // Process sequentially with backoff for failures
  for (const txn of pending) {
    // Check if enough time has passed since last retry (backoff)
    if (txn.sync_attempts > 0) {
      const backoffDelay = getBackoffDelay(txn.sync_attempts - 1);
      const timeSinceLastAttempt = Date.now() - new Date(txn.created_at).getTime();
      if (timeSinceLastAttempt < backoffDelay) {
        continue; // Skip - not enough time since last attempt
      }
    }

    try {
      await syncSingleTransaction(txn.uuid);
      synced++;
    } catch {
      failed++;
    }

    if (onProgress) {
      onProgress(synced, pending.length);
    }

    // Small delay between transactions
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`Sync complete: ${synced} synced, ${failed} failed`);

  // Log sync result
  await db.syncLogs.add({
    type: 'manual',
    status: failed === 0 ? 'success' : 'partial',
    items_synced: synced,
    items_failed: failed,
    started_at: new Date(),
    completed_at: new Date()
  });

  return { synced, failed };
}

// ==================== Background Sync ====================

let syncInterval: NodeJS.Timeout | null = null;

/**
 * Start automatic background sync (every 5 minutes)
 */
export function startBackgroundSync() {
  if (syncInterval) {
    console.log('Background sync already running');
    return;
  }

  console.log('🔄 Starting background sync (every 5 minutes)');

  syncInterval = setInterval(() => {
    if (isOnline) {
      syncPendingTransactions().catch(err => {
        console.error('Background sync failed:', err);
      });
    }
  }, 5 * 60 * 1000); // 5 minutes
}

/**
 * Stop background sync
 */
export function stopBackgroundSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log('⏹️ Background sync stopped');
  }
}

// ==================== Full Data Sync ====================

/**
 * Full sync: Fetch fresh data from API and cache to IndexedDB
 */
export async function fullDataSync(): Promise<void> {
  if (!isOnline) {
    console.log('Offline - skipping full data sync');
    return;
  }

  console.log('🔄 Starting full data sync...');

  try {
    const startTime = Date.now();

    // Fetch all data in parallel
    const [productsResponse, categoriesResponse, customersResponse, storesResponse] = await Promise.allSettled([
      productService.getMy({ per_page: 1000 }),
      categoryService.getAll(),
      customerService.getAll({ per_page: 100 }),
      storeService.getAll()
    ]);

    // Extract data
    const extractData = <T,>(response: any): T[] => {
      if (!response || response.status === 'rejected') return [];
      const value = response.value;
      if (Array.isArray(value)) return value;
      if (value && typeof value === 'object' && 'data' in value && Array.isArray(value.data)) {
        return value.data;
      }
      return [];
    };

    const products = extractData<ApiProduct>(productsResponse);
    const categories = extractData<ApiCategory>(categoriesResponse);
    const customers = extractData<ApiCustomer>(customersResponse);
    const stores = extractData<ApiStore>(storesResponse);

    // Cache to IndexedDB
    await Promise.all([
      cacheProducts(products),
      cacheCategories(categories),
      cacheCustomers(customers),
      cacheStores(stores)
    ]);

    const elapsed = Date.now() - startTime;
    console.log(`✅ Full sync complete in ${elapsed}ms`);

    // Log sync
    await db.syncLogs.add({
      type: 'full',
      status: 'success',
      items_synced: products.length + categories.length + customers.length + stores.length,
      items_failed: 0,
      started_at: new Date(startTime),
      completed_at: new Date()
    });

  } catch (err: any) {
    console.error('Full data sync failed:', err);

    // Log failure
    await db.syncLogs.add({
      type: 'full',
      status: 'failed',
      items_synced: 0,
      items_failed: 1,
      started_at: new Date(),
      completed_at: new Date(),
      error: err?.message
    });

    throw err;
  }
}

// ==================== Exports ====================

export const syncService = {
  // Online/Offline
  initializeOnlineDetection,
  onOnlineStatusChange,
  getOnlineStatus,

  // Caching
  cacheProducts,
  cacheCategories,
  cacheCustomers,
  cacheStores,

  // Transaction Sync
  saveTransactionLocally,
  syncSingleTransaction,
  syncPendingTransactions,

  // Background Sync
  startBackgroundSync,
  stopBackgroundSync,

  // Full Sync
  fullDataSync
};
