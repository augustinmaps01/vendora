"use client"

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Receipt,
  ArrowLeft,
  FileText,
  PauseCircle,
  Settings,
  Trash2,
  Loader2,
  History,
  RefreshCw,
} from "lucide-react";
import DesktopPOSLayout from "@/components/screens/pos-screen/DesktopPOSLayout";
import {
  type POSProduct,
  type CartItem,
  type Fulfillment,
  type Screen,
} from "@/components/screens/pos-screen";
import {
  productService,
  customerService,
  orderService,
  paymentService,
  categoryService,
  storeService,
  type ApiProduct,
  type ApiCustomer,
  type ApiCategory,
  type ApiStore,
} from "@/services";
import { tokenManager } from "@/lib/axios-client";
import Swal from "sweetalert2";

const THEME = {
  bg: "bg-gradient-to-br from-[#1f1633] via-[#241a3a] to-[#2b1f4a]",
  card: "bg-white/5 border border-white/10 backdrop-blur",
  panel: "bg-white/5 border border-white/10",
  muted: "text-white/60",
  text: "text-white",
};

type TotalsInput = {
  subtotal: number;
  discountAmount: number;
  taxEnabled: boolean;
  taxRate: number;
  fulfillment: Fulfillment;
  deliveryKm: number;
};

export function calcDeliveryFee(fulfillment: Fulfillment, deliveryKm: number) {
  if (fulfillment !== "delivery") return 0;
  const base = 40;
  const perKm = 12;
  const km = Number.isFinite(Number(deliveryKm)) ? Number(deliveryKm) : 0;
  return Math.round(base + perKm * Math.max(0, km));
}

export function calcTotals(input: TotalsInput) {
  const safeSubtotal = Math.max(0, Number(input.subtotal) || 0);
  const safeDiscount = Math.max(0, Math.min(Number(input.discountAmount) || 0, safeSubtotal));
  const deliveryFee = calcDeliveryFee(input.fulfillment, input.deliveryKm);

  const taxableBase = Math.max(0, safeSubtotal - safeDiscount);
  const tax = input.taxEnabled ? Math.round(taxableBase * Math.max(0, input.taxRate)) : 0;
  const total = taxableBase + tax + deliveryFee;

  return {
    subtotal: safeSubtotal,
    discount: safeDiscount,
    tax,
    deliveryFee,
    total,
  };
}

export function clampQty(qty: number, stock: number) {
  const s = Math.max(0, Number(stock) || 0);
  const q = Math.max(1, Number(qty) || 1);
  return Math.min(q, Math.max(1, s));
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs ${THEME.muted}`}>
      {children}
    </span>
  );
}

function Money({ value }: { value: number }) {
  return <span>{"₱ "}{Math.round(value).toLocaleString()}</span>;
}

/**
 * Convert API product to POS product format
 */
function convertApiProductToPOS(apiProduct: ApiProduct): POSProduct {
  return {
    id: String(apiProduct.id),
    name: apiProduct.name,
    sku: apiProduct.sku,
    barcode: apiProduct.barcode || "",
    price: apiProduct.price,
    stock: apiProduct.stock,
    category: "general", // Map to POS categories
    unit: apiProduct.unit || "pc",
  };
}

export default function VendoraPOS() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("sale");

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data from API
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [stores, setStores] = useState<ApiStore[]>([]);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);

  // Product search and filtering
  const [query, setQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [category, setCategory] = useState<string>("all");

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<"walkin" | "saved1" | "saved2">("walkin");
  const [notes, setNotes] = useState("");

  // Pricing and payment
  const [discountMode, setDiscountMode] = useState<"amount" | "percent">("amount");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxRate, setTaxRate] = useState<number>(0.12);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const [deliveryKm, setDeliveryKm] = useState<number>(3);
  const [paymentType, setPaymentType] = useState<"full" | "partial">("full");
  const [splitPay, setSplitPay] = useState(false);
  const [primaryMethod, setPrimaryMethod] = useState<"cash" | "card" | "online">("cash");
  const [cashPay, setCashPay] = useState<number>(0);
  const [cardPay, setCardPay] = useState<number>(0);
  const [onlinePay, setOnlinePay] = useState<number>(0);

  // Modal states
  const [holdOpen, setHoldOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const [saleId, setSaleId] = useState<string | null>(null);

  /**
   * Check authentication on mount
   */
  useEffect(() => {
    const checkAuth = () => {
      const token = tokenManager.getAccessToken();
      if (!token) {
        router.push("/pos/auth/login");
        return false;
      }
      return true;
    };

    if (checkAuth()) {
      loadInitialData();
    }
  }, [router]);

  /**
   * Load products and customers from API
   */
  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load categories
      try {
        const categoriesResponse = await categoryService.getAll();
        console.log('📂 Categories Response:', categoriesResponse);
        const categoriesList = Array.isArray(categoriesResponse)
          ? categoriesResponse
          : (categoriesResponse as any).data || [];
        console.log('📂 Categories List:', categoriesList);
        setCategories(categoriesList);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }

      // Load stores
      try {
        const storesResponse = await storeService.getAll();
        console.log('🏪 Stores Response:', storesResponse);
        const storesList = Array.isArray(storesResponse)
          ? storesResponse
          : (storesResponse as any).data || [];
        console.log('🏪 Stores List:', storesList);
        setStores(storesList.filter((s: ApiStore) => s.is_active));
      } catch (err) {
        console.error("Failed to load stores:", err);
      }

      // Load products (filtered by store if selected)
      const productsResponse = await productService.getAll({
        per_page: 1000,  // Fetch all products
        ...(selectedStore && { store_id: selectedStore })
      });

      console.log('📦 Products Response:', productsResponse);
      const products = Array.isArray(productsResponse)
        ? productsResponse
        : (productsResponse as any).data || [];

      console.log('📦 Products Array:', products);
      console.log('📦 Products Count:', products.length);
      setApiProducts(products);

      // Load customers for saved customer selection
      try {
        const customersResponse = await customerService.getAll({ per_page: 50 });
        console.log('👥 Customers Response:', customersResponse);
        const customersList = Array.isArray(customersResponse)
          ? customersResponse
          : (customersResponse as any).data || [];
        console.log('👥 Customers List:', customersList);
        setCustomers(customersList);
      } catch (err) {
        console.error("Failed to load customers:", err);
        // Continue without customers
      }

    } catch (err: any) {
      console.error("Failed to load data:", err);
      setError(err?.message || "Failed to load products");

      // If auth error, redirect to login
      if (err?.status === 401 || err?.status === 403) {
        router.push("/pos/auth/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reload products when store changes
   */
  useEffect(() => {
    if (selectedStore !== null) {
      loadInitialData();
    }
  }, [selectedStore]);

  /**
   * Generate sale ID
   */
  useEffect(() => {
    const base = String(Math.floor(Date.now() / 1000)).slice(-6);
    setSaleId(`SALE-${base}`);
  }, []);

  /**
   * Convert API products to POS format
   */
  const products = useMemo<POSProduct[]>(() => {
    return apiProducts.map(convertApiProductToPOS);
  }, [apiProducts]);

  /**
   * Filter products based on search and category
   */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      // Get the product's API data to check category ID
      const apiProduct = apiProducts.find(ap => String(ap.id) === p.id);
      const categoryMatch = category === "all"
        ? true
        : apiProduct?.category?.id === Number(category);

      const okQuery = !q ? true : `${p.name} ${p.sku} ${p.barcode}`.toLowerCase().includes(q);
      return categoryMatch && okQuery;
    });
  }, [products, query, category, apiProducts]);

  /**
   * Add product to cart
   */
  const addToCart = (p: POSProduct, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((x) => x.id === p.id);
      if (found) {
        const nextQty = clampQty(found.qty + qty, p.stock);
        return prev.map((x) => (x.id === p.id ? { ...x, qty: nextQty } : x));
      }
      return [
        ...prev,
        {
          id: p.id,
          name: p.name,
          sku: p.sku,
          barcode: p.barcode,
          price: p.price,
          stock: p.stock,
          unit: p.unit,
          qty: clampQty(qty, p.stock)
        },
      ];
    });
  };

  /**
   * Apply barcode/SKU lookup
   */
  const applyBarcode = async () => {
    const code = barcodeInput.trim();
    if (!code) return;

    setIsProcessing(true);
    try {
      // Try barcode first
      let product: ApiProduct | null = null;

      try {
        product = await productService.getByBarcode(code);
      } catch {
        // Try SKU lookup
        try {
          product = await productService.getBySku(code);
        } catch {
          // Not found
        }
      }

      if (product) {
        const posProduct = convertApiProductToPOS(product);
        addToCart(posProduct, 1);
        setBarcodeInput("");

        Swal.fire({
          icon: "success",
          title: "Added to cart",
          text: product.name,
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Product not found",
          text: `No product found for: ${code}`,
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      }
    } catch (err: any) {
      console.error("Barcode lookup error:", err);
      Swal.fire({
        icon: "error",
        title: "Lookup failed",
        text: err?.message || "Failed to lookup product",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const changeQty = (id: string, nextQty: number | string) => {
    setCart((prev) =>
      prev.map((x) => {
        if (x.id !== id) return x;
        const q = clampQty(Number(nextQty || 1), x.stock);
        return { ...x, qty: q };
      })
    );
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((x) => x.id !== id));
  const clearCart = () => setCart([]);

  const subtotal = useMemo(() => cart.reduce((sum, x) => sum + x.price * x.qty, 0), [cart]);

  const discountAmount = useMemo(() => {
    const v = Math.max(0, Number(discountValue) || 0);
    if (discountMode === "amount") return Math.min(v, subtotal);
    const pct = Math.min(100, v);
    return Math.round(subtotal * (pct / 100));
  }, [discountValue, discountMode, subtotal]);

  const totals = useMemo(
    () =>
      calcTotals({
        subtotal,
        discountAmount,
        taxEnabled,
        taxRate,
        fulfillment,
        deliveryKm,
      }),
    [subtotal, discountAmount, taxEnabled, taxRate, fulfillment, deliveryKm]
  );

  const amountDue = useMemo(() => {
    if (paymentType === "partial") return Math.round(totals.total * 0.5);
    return totals.total;
  }, [paymentType, totals.total]);

  const paid = useMemo(() => {
    const c = Math.max(0, Number(cashPay) || 0);
    const k = Math.max(0, Number(cardPay) || 0);
    const o = Math.max(0, Number(onlinePay) || 0);

    console.log('💰 Payment Debug:', {
      cashPay, cardPay, onlinePay,
      parsedCash: c, parsedCard: k, parsedOnline: o,
      splitPay, primaryMethod
    });

    if (splitPay) return c + k + o;

    if (primaryMethod === "cash") return c;
    if (primaryMethod === "card") return k;
    return o;
  }, [splitPay, primaryMethod, cashPay, cardPay, onlinePay]);

  const balance = useMemo(() => Math.max(0, amountDue - paid), [amountDue, paid]);
  const change = useMemo(() => Math.max(0, paid - amountDue), [amountDue, paid]);

  console.log('🎯 Complete Button Status:', {
    cartLength: cart.length,
    total: totals.total,
    amountDue,
    paid,
    balance,
    change,
    canComplete: cart.length > 0 && totals.total > 0 && balance === 0
  });

  const canGoCheckout = useMemo(() => cart.length > 0 && totals.total > 0, [cart.length, totals.total]);
  const canComplete = useMemo(() => cart.length > 0 && totals.total > 0 && balance === 0, [cart.length, totals.total, balance]);

  /**
   * Complete order - Create customer, order, and payment via API
   */
  const completeOrder = async () => {
    if (!canComplete) return;

    setIsProcessing(true);

    try {
      console.log('🚀 Starting order completion process...');

      // Step 1: Create or get customer
      let customerId = selectedCustomerId;
      console.log('👤 Step 1: Customer selection', { customer, selectedCustomerId, customersLength: customers.length });

      if (customer === "walkin" && !customerId) {
        console.log('👤 Creating walk-in customer...');
        try {
          const newCustomer = await customerService.create({
            name: "Walk-in Customer",
            status: "active",
          });
          customerId = newCustomer.id;
          console.log('✅ Walk-in customer created:', customerId);
        } catch (customerError: any) {
          console.error('❌ Failed to create walk-in customer:', customerError);
          throw new Error(`Failed to create customer: ${customerError?.message || 'Unknown error'}`);
        }
      } else if (customer === "saved1" && customers[0]) {
        customerId = customers[0].id;
        console.log('👤 Using saved customer 1:', customerId);
      } else if (customer === "saved2" && customers[1]) {
        customerId = customers[1].id;
        console.log('👤 Using saved customer 2:', customerId);
      }

      if (!customerId) {
        throw new Error("Customer selection required");
      }

      // Step 2: Create order
      const orderData: any = {
        customer_id: customerId,
        ordered_at: new Date().toISOString().split('T')[0],
        status: "pending",
        items: cart.map(item => ({
          product_id: Number(item.id),
          quantity: item.qty,
        })),
      };

      console.log('📦 Step 2: Creating order with data:', orderData);

      let order;
      try {
        order = await orderService.create(orderData);
        console.log('✅ Order created successfully:', order);
      } catch (orderError: any) {
        console.error('❌ Failed to create order:', orderError);
        throw new Error(`Failed to create order: ${orderError?.message || 'Unknown error'}`);
      }

      // Step 3: Create payment(s)
      const paymentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      console.log('💰 Step 3: Creating payments', { paymentDate, splitPay, primaryMethod });

      try {
        if (splitPay) {
          // Create multiple payment records for split payment
          const payments = [];

          if (cashPay > 0) {
            const cashPaymentData = {
              order_id: order.id as unknown as number,
              amount: cashPay,
              method: "cash" as const,
              status: "completed" as const,
              paid_at: paymentDate,
            };
            console.log('💰 Creating cash payment:', cashPaymentData);
            payments.push(paymentService.create(cashPaymentData));
          }

          if (cardPay > 0) {
            const cardPaymentData = {
              order_id: order.id as unknown as number,
              amount: cardPay,
              method: "card" as const,
              status: "completed" as const,
              paid_at: paymentDate,
            };
            console.log('💰 Creating card payment:', cardPaymentData);
            payments.push(paymentService.create(cardPaymentData));
          }

          if (onlinePay > 0) {
            const onlinePaymentData = {
              order_id: order.id as unknown as number,
              amount: onlinePay,
              method: "online" as const,
              status: "completed" as const,
              paid_at: paymentDate,
            };
            console.log('💰 Creating online payment:', onlinePaymentData);
            payments.push(paymentService.create(onlinePaymentData));
          }

          await Promise.all(payments);
          console.log('✅ All split payments created successfully');
        } else {
          // Single payment
          const singlePaymentData = {
            order_id: order.id as unknown as number,
            amount: paid,
            method: primaryMethod,
            status: "completed" as const,
            paid_at: paymentDate,
          };
          console.log('💰 Creating single payment:', singlePaymentData);
          await paymentService.create(singlePaymentData);
          console.log('✅ Single payment created successfully');
        }
      } catch (paymentError: any) {
        console.error('❌ Failed to create payment:', paymentError);
        throw new Error(`Failed to process payment: ${paymentError?.message || 'Unknown error'}`);
      }

      // Step 4: Update inventory via bulk stock decrement
      console.log('📊 Step 4: Updating inventory...');
      try {
        await productService.bulkStockDecrement({
          items: cart.map(item => ({
            productId: Number(item.id),
            quantity: item.qty,
            variantSku: null,
          })),
          orderId: `ORD-${order.id}`,
        });
        console.log('✅ Inventory updated successfully');
      } catch (inventoryError: any) {
        console.error('❌ Failed to update inventory:', inventoryError);
        // Don't throw here, order is already created
        console.warn('⚠️ Order created but inventory update failed');
      }

      // Step 5: Show success and receipt
      console.log('🎉 Step 5: Finalizing order...');
      setReceiptData({
        orderId: order.id,
        orderNumber: `ORD-${order.id}`,
        customer: customer === "walkin" ? "Walk-in Customer" : customers.find(c => c.id === customerId)?.name || "Customer",
        items: cart,
        totals,
        paid,
        change,
        paymentMethod: splitPay
          ? `Split (Cash: ₱${cashPay}, Card: ₱${cardPay}, Online: ₱${onlinePay})`
          : primaryMethod,
      });

      setReceiptOpen(true);

      // Clear cart and reset form
      setCart([]);
      setNotes("");
      setDiscountValue(0);
      setCashPay(0);
      setCardPay(0);
      setOnlinePay(0);
      setScreen("sale");

      // Reload products to get updated stock
      await loadInitialData();

      Swal.fire({
        icon: "success",
        title: "Order completed!",
        text: `Order #${order.id} has been processed`,
        timer: 3000,
        showConfirmButton: false,
      });

      console.log('✅ Order completion process finished successfully');


    } catch (err: any) {
      console.error("Order completion error:", err);

      // Detailed error logging for debugging
      console.error("Error details:", {
        message: err?.message,
        name: err?.name,
        status: err?.status,
        response: err?.response?.data,
        responseStatus: err?.response?.status,
        responseHeaders: err?.response?.headers,
        errors: err?.errors,
        stack: err?.stack,
        // Try to serialize the error object with all properties
        serialized: Object.getOwnPropertyNames(err).reduce((acc: any, key) => {
          acc[key] = err[key];
          return acc;
        }, {})
      });

      // Determine user-friendly error message
      let errorMessage = "Something went wrong. Please try again.";

      if (err?.message) {
        errorMessage = err.message;
      }

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      if (err?.errors) {
        // Format validation errors
        const errorList = Object.values(err.errors).flat();
        if (errorList.length > 0) {
          errorMessage = errorList.join(", ");
        }
      }

      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: errorMessage,
        confirmButtonColor: "#7c3aed",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const screenProps = {
    screen,
    cart,
    query,
    setQuery,
    barcodeInput,
    setBarcodeInput,
    category,
    setCategory,
    customer,
    setCustomer,
    notes,
    setNotes,
    filtered,
    addToCart,
    applyBarcode,
    changeQty,
    removeItem,
    totals,
    discountAmount,
    canGoCheckout,
    setScreen,
    discountMode,
    setDiscountMode,
    discountValue,
    setDiscountValue,
    taxEnabled,
    setTaxEnabled,
    taxRate,
    setTaxRate,
    fulfillment,
    setFulfillment,
    deliveryKm,
    setDeliveryKm,
    paymentType,
    setPaymentType,
    splitPay,
    setSplitPay,
    primaryMethod,
    setPrimaryMethod,
    cashPay,
    setCashPay,
    cardPay,
    setCardPay,
    onlinePay,
    setOnlinePay,
    amountDue,
    paid,
    balance,
    change,
    canComplete,
    setReceiptOpen,
    calcDeliveryFee,
    completeOrder,
    categories,
  };

  const bodyHeight = "h-auto lg:h-[calc(100vh-84px)]";

  // Show loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen ${THEME.bg} flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading POS...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`min-h-screen ${THEME.bg} flex items-center justify-center`}>
        <div className="text-center max-w-md">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <Button
            onClick={loadInitialData}
            className="rounded-xl bg-purple-600 hover:bg-purple-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${THEME.bg} overflow-auto lg:overflow-hidden`}>
      <header className="border-b border-white/10 bg-[#1f1633]/70 backdrop-blur py-3 lg:h-[84px] lg:py-0">
        <div className="px-4 sm:px-6 flex flex-col gap-3 lg:h-full lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 min-w-0 w-full lg:w-auto">
            <div className="h-10 w-10 rounded-2xl bg-purple-500/15 flex items-center justify-center shrink-0">
              <Receipt className="h-5 w-5 text-purple-200" />
            </div>
            <div className="leading-tight min-w-0">
              <div className="font-semibold text-white truncate">Vendora POS</div>
              <div className={`text-xs ${THEME.muted} truncate`}>{screen === "sale" ? "Sale" : "Checkout"} - Txn {saleId ?? "—"}</div>
            </div>
            <div className="hidden lg:flex gap-2 ml-2">
              <Pill>Cashier Maria</Pill>
              {stores.length > 0 && (
                <Select value={selectedStore ? String(selectedStore) : "all"} onValueChange={(v) => setSelectedStore(v === "all" ? null : Number(v))}>
                  <SelectTrigger className="h-7 w-auto rounded-full bg-white/10 border-white/10 text-white text-xs px-3" suppressHydrationWarning>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    {stores.map(store => (
                      <SelectItem key={store.id} value={String(store.id)}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Pill>{customer === "walkin" ? "Walk in" : customer === "saved1" ? customers[0]?.name || "Customer 1" : customers[1]?.name || "Customer 2"}</Pill>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
            <Button
              variant="secondary"
              className="rounded-xl bg-white/10 hover:bg-white/20 text-white"
              onClick={async () => {
                setOrderHistoryOpen(true);
                try {
                  const orders = await orderService.getAll({});
                  const ordersList = Array.isArray(orders) ? orders : (orders as any).data || [];
                  setRecentOrders(ordersList);
                } catch (err) {
                  console.error("Failed to load orders:", err);
                }
              }}
            >
              <History className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Orders</span>
            </Button>

            {screen === "checkout" ? (
              <Button
                variant="secondary"
                className="rounded-xl bg-white/10 hover:bg-white/20 text-white"
                onClick={() => setScreen("sale")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : null}

            <Button
              variant="secondary"
              className="rounded-xl bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setReceiptOpen(true)}
            >
              <FileText className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Receipt</span>
            </Button>

            <Button
              variant="secondary"
              className="rounded-xl bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setHoldOpen(true)}
              disabled={cart.length === 0}
            >
              <PauseCircle className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Hold</span>
            </Button>

            <Button
              variant="secondary"
              className="rounded-xl bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Settings</span>
            </Button>

            <Button className="rounded-xl bg-purple-600 hover:bg-purple-700" onClick={clearCart}>
              <Trash2 className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Clear</span>
            </Button>
          </div>
        </div>
      </header>

      <main className={`${bodyHeight} px-4 py-4 lg:px-6 lg:overflow-hidden`}>
        <DesktopPOSLayout {...screenProps} />
      </main>

      {/* Hold Modal */}
      <Dialog open={holdOpen} onOpenChange={setHoldOpen}>
        <DialogContent className="rounded-2xl bg-[#201836] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Hold this sale</DialogTitle>
            <DialogDescription className="text-white/60">Save the cart temporarily and resume later.</DialogDescription>
          </DialogHeader>

          <div className={`rounded-2xl ${THEME.panel} p-3 space-y-2`}>
            <div className="text-sm">Hold reference</div>
            <Input className="rounded-xl bg-white/10 border-white/10 text-white" placeholder="Example Counter 1" />
            <div className={`text-xs ${THEME.muted}`}>Feature coming soon - integrate with backend.</div>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              className="rounded-xl bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setHoldOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                setHoldOpen(false);
                alert("Hold sale feature coming soon.");
              }}
              disabled={cart.length === 0}
            >
              Hold Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="rounded-2xl bg-[#201836] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Receipt Preview</DialogTitle>
            <DialogDescription className="text-white/60">
              {receiptData ? "Order completed successfully" : "Preview receipt before checkout"}
            </DialogDescription>
          </DialogHeader>

          <div className={`rounded-2xl ${THEME.panel} p-4 space-y-3`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">Vendora Retail</div>
                <div className={`text-xs ${THEME.muted}`}>
                  {receiptData ? `Order ${receiptData.orderNumber}` : `Transaction ${saleId ?? "—"}`}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs ${THEME.muted}`}>Cashier</div>
                <div className="text-sm">Maria</div>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="space-y-2">
              {cart.length === 0 ? (
                <div className={`text-sm ${THEME.muted}`}>No items</div>
              ) : (
                cart.map((x) => (
                  <div key={x.id} className="flex items-center justify-between text-sm">
                    <div className="min-w-0">
                      <div className="truncate">{x.name}</div>
                      <div className={`text-xs ${THEME.muted}`}>{x.qty} {x.unit} × <Money value={x.price} /></div>
                    </div>
                    <div className="font-medium"><Money value={x.qty * x.price} /></div>
                  </div>
                ))
              )}
            </div>

            <div className="h-px bg-white/10" />

            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between"><span className={THEME.muted}>Subtotal</span><span><Money value={totals.subtotal} /></span></div>
              <div className="flex items-center justify-between"><span className={THEME.muted}>Discount</span><span><Money value={totals.discount} /></span></div>
              <div className="flex items-center justify-between"><span className={THEME.muted}>Tax</span><span><Money value={totals.tax} /></span></div>
              <div className="flex items-center justify-between"><span className={THEME.muted}>Delivery</span><span><Money value={totals.deliveryFee} /></span></div>
              <div className="h-px bg-white/10" />
              <div className="flex items-center justify-between font-semibold"><span>Total</span><span><Money value={totals.total} /></span></div>
              {receiptData && (
                <>
                  <div className="flex items-center justify-between"><span className={THEME.muted}>Paid</span><span><Money value={receiptData.paid} /></span></div>
                  <div className="flex items-center justify-between"><span className={THEME.muted}>Change</span><span><Money value={receiptData.change} /></span></div>
                  <div className={`text-xs ${THEME.muted} mt-2`}>Payment: {receiptData.paymentMethod}</div>
                </>
              )}
            </div>

            {notes ? <div className={`text-xs ${THEME.muted}`}>Notes: {notes}</div> : null}
          </div>

          <DialogFooter>
            <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20 text-white" onClick={() => setReceiptOpen(false)}>
              Close
            </Button>
            <Button className="rounded-xl bg-purple-600 hover:bg-purple-700" onClick={() => window.print()}>
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="rounded-2xl bg-[#201836] border-white/10 text-white max-w-xl">
          <DialogHeader>
            <DialogTitle>POS Settings</DialogTitle>
            <DialogDescription className="text-white/60">Configure POS preferences</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className={`rounded-2xl ${THEME.panel} p-3 space-y-2`}>
              <div className="text-sm font-medium">Tax defaults</div>
              <div className="flex items-center justify-between">
                <span className={THEME.muted}>Tax enabled by default</span>
                <Switch checked={taxEnabled} onCheckedChange={(v) => setTaxEnabled(Boolean(v))} />
              </div>
              <div className="flex items-center gap-2">
                <Select value={String(taxRate)} onValueChange={(v) => setTaxRate(Number(v))}>
                  <SelectTrigger className="rounded-xl bg-white/10 border-white/10 text-white" suppressHydrationWarning>
                    <SelectValue placeholder="Tax rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="0.03">3%</SelectItem>
                    <SelectItem value="0.05">5%</SelectItem>
                    <SelectItem value="0.12">12%</SelectItem>
                  </SelectContent>
                </Select>
                <Pill>Rate</Pill>
              </div>
            </div>

            <div className={`rounded-2xl ${THEME.panel} p-3 space-y-2`}>
              <div className="text-sm font-medium">Device</div>
              <Input className="rounded-xl bg-white/10 border-white/10 text-white" placeholder="Device name e.g. Counter 1" />
              <div className={`text-xs ${THEME.muted}`}>Device settings will be saved to backend.</div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20 text-white" onClick={() => setSettingsOpen(false)}>
              Close
            </Button>
            <Button className="rounded-xl bg-purple-600 hover:bg-purple-700" onClick={() => { setSettingsOpen(false); }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order History Modal */}
      <Dialog open={orderHistoryOpen} onOpenChange={setOrderHistoryOpen}>
        <DialogContent className="rounded-2xl bg-[#201836] border-white/10 text-white max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Recent Orders</DialogTitle>
            <DialogDescription className="text-white/60">View and manage recent transactions</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className={THEME.muted}>No orders found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className={`rounded-xl ${THEME.panel} p-3`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{order.order_number || `ORD-${order.id}`}</div>
                        <div className={`text-sm ${THEME.muted}`}>{order.customer || "Walk-in"}</div>
                        <div className={`text-xs ${THEME.muted}`}>{order.ordered_at}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          <Money value={order.total || 0} />
                        </div>
                        <div className={`text-xs ${THEME.muted}`}>{order.status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20 text-white" onClick={() => setOrderHistoryOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Processing Overlay */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="rounded-2xl bg-[#201836] border-white/10 text-white max-w-xl">
          <DialogHeader>
            <DialogTitle>POS Settings</DialogTitle>
            <DialogDescription className="text-white/60">Configure POS preferences</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className={`rounded-2xl ${THEME.panel} p-3 space-y-2`}>
              <div className="text-sm font-medium">Tax defaults</div>
              <div className="flex items-center justify-between">
                <span className={THEME.muted}>Tax enabled by default</span>
                <Switch checked={taxEnabled} onCheckedChange={(v) => setTaxEnabled(Boolean(v))} />
              </div>
              <div className="flex items-center gap-2">
                <Select value={String(taxRate)} onValueChange={(v) => setTaxRate(Number(v))}>
                  <SelectTrigger className="rounded-xl bg-white/10 border-white/10 text-white" suppressHydrationWarning>
                    <SelectValue placeholder="Tax rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="0.03">3%</SelectItem>
                    <SelectItem value="0.05">5%</SelectItem>
                    <SelectItem value="0.12">12%</SelectItem>
                  </SelectContent>
                </Select>
                <Pill>Rate</Pill>
              </div>
            </div>

            <div className={`rounded-2xl ${THEME.panel} p-3 space-y-2`}>
              <div className="text-sm font-medium">Device</div>
              <Input className="rounded-xl bg-white/10 border-white/10 text-white" placeholder="Device name e.g. Counter 1" />
              <div className={`text-xs ${THEME.muted}`}>Device settings will be saved to backend.</div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20 text-white" onClick={() => setSettingsOpen(false)}>
              Close
            </Button>
            <Button className="rounded-xl bg-purple-600 hover:bg-purple-700" onClick={() => { setSettingsOpen(false); }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#201836] rounded-2xl p-6 text-center">
            <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Processing...</p>
          </div>
        </div>
      )}

      <footer className="px-6 pb-6">
        <div className={`text-xs ${THEME.muted}`}>POS system with API integration</div>
      </footer>
    </div>
  );
}
