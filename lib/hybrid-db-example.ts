/**
 * HYBRID DATABASE APPROACH (EXAMPLE)
 * Combines IndexedDB (Dexie) + SQLite (SQL.js)
 *
 * Use Case:
 * - Dexie: Fast operational data (products, transactions)
 * - SQL.js: Complex analytics (reports, dashboards)
 */

import { db } from './db'; // IndexedDB (Dexie)
import initSqlJs, { Database } from 'sql.js';

// ==================== SQLite Analytics Layer ====================

let sqliteDB: Database | null = null;

/**
 * Initialize SQLite (lazy loaded - only when needed)
 */
export async function initSQLiteAnalytics() {
  if (sqliteDB) return sqliteDB;

  console.log('Loading SQL.js (1.5MB)...');

  // Lazy load SQL.js (only when user opens reports)
  const SQL = await initSqlJs({
    locateFile: file => `/sql-wasm.wasm`
  });

  // Create in-memory database
  sqliteDB = new SQL.Database();

  // Create schema
  sqliteDB.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY,
      uuid TEXT UNIQUE,
      customer_id INTEGER,
      customer_name TEXT,
      ordered_at DATE,
      total REAL,
      payment_method TEXT,
      synced BOOLEAN
    );

    CREATE TABLE IF NOT EXISTS transaction_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_uuid TEXT,
      product_id INTEGER,
      product_name TEXT,
      quantity INTEGER,
      price REAL,
      FOREIGN KEY (transaction_uuid) REFERENCES transactions(uuid)
    );

    CREATE INDEX idx_ordered_at ON transactions(ordered_at);
    CREATE INDEX idx_customer ON transactions(customer_id);
  `);

  console.log('✅ SQLite analytics DB ready');
  return sqliteDB;
}

/**
 * Sync IndexedDB data to SQLite (for analytics)
 */
export async function syncToSQLite() {
  const sqlite = await initSQLiteAnalytics();

  console.log('🔄 Syncing IndexedDB → SQLite...');

  // Get all transactions from IndexedDB
  const transactions = await db.transactions.toArray();

  // Clear SQLite tables
  sqlite.run('DELETE FROM transaction_items');
  sqlite.run('DELETE FROM transactions');

  // Insert into SQLite
  const insertTxn = sqlite.prepare(`
    INSERT INTO transactions (uuid, customer_id, customer_name, ordered_at, total, payment_method, synced)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertItem = sqlite.prepare(`
    INSERT INTO transaction_items (transaction_uuid, product_id, product_name, quantity, price)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const txn of transactions) {
    // Insert transaction
    insertTxn.run([
      txn.uuid,
      txn.customer_id,
      txn.customer_name,
      txn.ordered_at,
      txn.total,
      txn.payment_method,
      txn.synced ? 1 : 0
    ]);

    // Insert items
    for (const item of txn.items) {
      insertItem.run([
        txn.uuid,
        item.product_id,
        item.product_name,
        item.quantity,
        item.price
      ]);
    }
  }

  insertTxn.free();
  insertItem.free();

  console.log(`✅ Synced ${transactions.length} transactions to SQLite`);
}

// ==================== Analytics Reports ====================

/**
 * Daily Sales Report (SQL)
 */
export async function getDailySalesReport(startDate: string, endDate: string) {
  const sqlite = await initSQLiteAnalytics();
  await syncToSQLite(); // Refresh data

  const result = sqlite.exec(`
    SELECT
      DATE(ordered_at) as date,
      COUNT(*) as order_count,
      SUM(total) as revenue,
      AVG(total) as avg_order,
      MIN(total) as min_order,
      MAX(total) as max_order
    FROM transactions
    WHERE ordered_at BETWEEN ? AND ?
    GROUP BY DATE(ordered_at)
    ORDER BY date DESC
  `, [startDate, endDate]);

  if (result.length === 0) return [];

  // Convert to array of objects
  const columns = result[0].columns;
  const values = result[0].values;

  return values.map(row => {
    const obj: any = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

/**
 * Top Customers Report (SQL with JOIN)
 */
export async function getTopCustomersReport(limit = 10) {
  const sqlite = await initSQLiteAnalytics();
  await syncToSQLite();

  const result = sqlite.exec(`
    SELECT
      customer_id,
      customer_name,
      COUNT(*) as order_count,
      SUM(total) as total_spent,
      AVG(total) as avg_order,
      MAX(ordered_at) as last_order
    FROM transactions
    WHERE synced = 1
    GROUP BY customer_id, customer_name
    HAVING total_spent > 0
    ORDER BY total_spent DESC
    LIMIT ?
  `, [limit]);

  if (result.length === 0) return [];

  const columns = result[0].columns;
  const values = result[0].values;

  return values.map(row => {
    const obj: any = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

/**
 * Product Performance Report (Complex JOIN)
 */
export async function getProductPerformanceReport() {
  const sqlite = await initSQLiteAnalytics();
  await syncToSQLite();

  const result = sqlite.exec(`
    SELECT
      i.product_id,
      i.product_name,
      COUNT(DISTINCT t.uuid) as times_sold,
      SUM(i.quantity) as total_quantity,
      SUM(i.quantity * i.price) as total_revenue,
      AVG(i.price) as avg_price,
      MAX(t.ordered_at) as last_sold
    FROM transaction_items i
    INNER JOIN transactions t ON i.transaction_uuid = t.uuid
    WHERE t.synced = 1
    GROUP BY i.product_id, i.product_name
    ORDER BY total_revenue DESC
    LIMIT 20
  `);

  if (result.length === 0) return [];

  const columns = result[0].columns;
  const values = result[0].values;

  return values.map(row => {
    const obj: any = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

/**
 * Monthly Trend Analysis (Window Functions)
 */
export async function getMonthlyTrends() {
  const sqlite = await initSQLiteAnalytics();
  await syncToSQLite();

  const result = sqlite.exec(`
    SELECT
      strftime('%Y-%m', ordered_at) as month,
      COUNT(*) as orders,
      SUM(total) as revenue,
      AVG(total) as avg_order,
      SUM(SUM(total)) OVER (ORDER BY strftime('%Y-%m', ordered_at)) as cumulative_revenue
    FROM transactions
    WHERE synced = 1
    GROUP BY month
    ORDER BY month DESC
  `);

  if (result.length === 0) return [];

  const columns = result[0].columns;
  const values = result[0].values;

  return values.map(row => {
    const obj: any = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

// ==================== Hybrid Usage Example ====================

/**
 * Example: Dashboard that uses BOTH databases
 */
export async function getDashboardData() {
  console.log('📊 Loading dashboard data...');

  // Fast queries from IndexedDB (Dexie)
  const [pendingCount, recentTransactions, lowStockProducts] = await Promise.all([
    // Simple count - IndexedDB
    db.transactions.where('synced').equals(false).count(),

    // Recent transactions - IndexedDB
    db.transactions.orderBy('created_at').reverse().limit(10).toArray(),

    // Low stock - IndexedDB
    db.products.where('stock').below(10).toArray()
  ]);

  // Complex analytics from SQLite (lazy loaded)
  const [salesReport, topCustomers] = await Promise.all([
    getDailySalesReport('2026-01-01', '2026-12-31'),
    getTopCustomersReport(5)
  ]);

  return {
    // From IndexedDB (fast, always available)
    pendingCount,
    recentTransactions,
    lowStockProducts,

    // From SQLite (complex queries)
    salesReport,
    topCustomers
  };
}

// ==================== Export for Use ====================

export const hybridDB = {
  // IndexedDB (operational)
  dexie: db,

  // SQLite (analytics)
  initSQLite: initSQLiteAnalytics,
  syncToSQLite,

  // Reports
  getDailySalesReport,
  getTopCustomersReport,
  getProductPerformanceReport,
  getMonthlyTrends,
  getDashboardData
};
