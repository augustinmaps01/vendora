"use client"

import React, { useEffect, useMemo, useState, useCallback, lazy, Suspense } from "react";
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
  Receipt,
  ArrowLeft,
  FileText,
  PauseCircle,
  Settings,
  Trash2,
  Loader2,
  History,
  CheckCircle2,
  Printer,
  Share2,
} from "lucide-react";
import {
  type POSProduct,
  type CartItem,
  type Fulfillment,
  type Screen,
  type ReceiptData,
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

// Lazy load heavy components
const DesktopPOSLayout = lazy(() => import("@/components/screens/pos-screen/DesktopPOSLayout"));

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

const Pill = React.memo(({ children }: { children: React.ReactNode }) => (
  <span className={`inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs ${THEME.muted}`}>
    {children}
  </span>
));
Pill.displayName = "Pill";

const Money = React.memo(({ value }: { value: number }) => (
  <span>{"₱ "}{Math.round(value).toLocaleString()}</span>
));
Money.displayName = "Money";

// Memoized product converter
const convertApiProductToPOS = (apiProduct: ApiProduct): POSProduct => ({
  id: String(apiProduct.id),
  name: apiProduct.name,
  sku: apiProduct.sku,
  barcode: apiProduct.barcode || "",
  price: apiProduct.price,
  stock: apiProduct.stock,
  category: "general",
  unit: apiProduct.unit || "pc",
});

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className={`min-h-screen ${THEME.bg} flex items-center justify-center`}>
    <div className="text-center">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin mx-auto" />
        <Receipt className="h-6 w-6 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-white text-lg mt-4 font-medium">Loading POS...</p>
      <p className="text-white/50 text-sm mt-1">Preparing your workspace</p>
    </div>
  </div>
);

// Extract data array helper
const extractDataArray = <T,>(response: T | T[] | { data?: T[] }): T[] => {
  if (Array.isArray(response)) return response;
  if (response && typeof response === "object" && "data" in response && Array.isArray((response as { data?: T[] }).data)) {
    return (response as { data: T[] }).data;
  }
  return [];
};

export default function VendoraPOS() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("sale");
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
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const [saleId, setSaleId] = useState<string | null>(null);

  // Generate sale ID once on mount
  useEffect(() => {
    const base = String(Math.floor(Date.now() / 1000)).slice(-6);
    setSaleId(`SALE-${base}`);
  }, []);

  // Check auth and load data
  useEffect(() => {
    const token = tokenManager.getAccessToken();
    if (!token) {
      router.push("/pos/auth/login");
      return;
    }
    loadInitialData();
  }, []);

  // Optimized parallel data loading
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load all data in PARALLEL for faster loading
      const [categoriesResult, storesResult, productsResult, customersResult] = await Promise.allSettled([
        categoryService.getAll(),
        storeService.getAll(),
        productService.getMy({ per_page: 500 }), // Reduced from 1000
        customerService.getAll({ per_page: 20 }), // Reduced from 50
      ]);

      // Process categories
      if (categoriesResult.status === "fulfilled") {
        const categoriesList = extractDataArray(categoriesResult.value);
        setCategories(categoriesList);
      }

      // Process stores
      let activeStores: ApiStore[] = [];
      if (storesResult.status === "fulfilled") {
        const storesList = extractDataArray(storesResult.value);
        activeStores = storesList.filter((s: ApiStore) => s.is_active);
        setStores(activeStores);
      }

      // Process products
      if (productsResult.status === "fulfilled") {
        const products = extractDataArray(productsResult.value);
        setApiProducts(products);
      }

      // Process customers
      if (customersResult.status === "fulfilled") {
        const customersList = extractDataArray(customersResult.value);
        setCustomers(customersList);
      }

    } catch (err: any) {
      setError(err?.message || "Failed to load data");
      if (err?.status === 401 || err?.status === 403) {
        router.push("/pos/auth/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Reload products when store changes
  useEffect(() => {
    if (selectedStore !== null && !isLoading) {
      loadStoreProducts();
    }
  }, [selectedStore]);

  const loadStoreProducts = useCallback(async () => {
    if (!selectedStore) return;
    try {
      const productsResponse = await storeService.getProducts(selectedStore, { per_page: 500 });
      const products = extractDataArray(productsResponse);
      setApiProducts(products);
    } catch (err) {
      // Silent fail, keep existing products
    }
  }, [selectedStore]);

  // Memoized products conversion
  const products = useMemo<POSProduct[]>(() => {
    return apiProducts.map(convertApiProductToPOS);
  }, [apiProducts]);

  // Memoized filtered products
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const apiProduct = apiProducts.find(ap => String(ap.id) === p.id);
      const categoryMatch = category === "all" || apiProduct?.category?.id === Number(category);
      const okQuery = !q || `${p.name} ${p.sku} ${p.barcode}`.toLowerCase().includes(q);
      return categoryMatch && okQuery;
    });
  }, [products, query, category, apiProducts]);

  // Cart operations with useCallback
  const addToCart = useCallback((p: POSProduct, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((x) => x.id === p.id);
      if (found) {
        const nextQty = clampQty(found.qty + qty, p.stock);
        return prev.map((x) => (x.id === p.id ? { ...x, qty: nextQty } : x));
      }
      return [...prev, {
        id: p.id,
        name: p.name,
        sku: p.sku,
        barcode: p.barcode,
        price: p.price,
        stock: p.stock,
        unit: p.unit,
        qty: clampQty(qty, p.stock)
      }];
    });
  }, []);

  const applyBarcode = useCallback(async () => {
    const code = barcodeInput.trim();
    if (!code) return;

    setIsProcessing(true);
    try {
      let product: ApiProduct | null = null;
      try {
        product = await productService.getByBarcode(code);
      } catch {
        try {
          product = await productService.getBySku(code);
        } catch { /* Not found */ }
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
    } finally {
      setIsProcessing(false);
    }
  }, [barcodeInput, addToCart]);

  const changeQty = useCallback((id: string, nextQty: number | string) => {
    setCart((prev) =>
      prev.map((x) => x.id !== id ? x : { ...x, qty: clampQty(Number(nextQty || 1), x.stock) })
    );
  }, []);

  const removeItem = useCallback((id: string) => setCart((prev) => prev.filter((x) => x.id !== id)), []);
  const clearCart = useCallback(() => setCart([]), []);

  // Memoized calculations
  const subtotal = useMemo(() => cart.reduce((sum, x) => sum + x.price * x.qty, 0), [cart]);

  const discountAmount = useMemo(() => {
    const v = Math.max(0, Number(discountValue) || 0);
    if (discountMode === "amount") return Math.min(v, subtotal);
    return Math.round(subtotal * (Math.min(100, v) / 100));
  }, [discountValue, discountMode, subtotal]);

  const totals = useMemo(() => calcTotals({
    subtotal,
    discountAmount,
    taxEnabled,
    taxRate,
    fulfillment,
    deliveryKm,
  }), [subtotal, discountAmount, taxEnabled, taxRate, fulfillment, deliveryKm]);

  const amountDue = useMemo(() => {
    if (paymentType === "partial") return Math.round(totals.total * 0.5);
    return totals.total;
  }, [paymentType, totals.total]);

  const paid = useMemo(() => {
    const c = Math.max(0, Number(cashPay) || 0);
    const k = Math.max(0, Number(cardPay) || 0);
    const o = Math.max(0, Number(onlinePay) || 0);
    if (splitPay) return c + k + o;
    if (primaryMethod === "cash") return c;
    if (primaryMethod === "card") return k;
    return o;
  }, [splitPay, primaryMethod, cashPay, cardPay, onlinePay]);

  const balance = useMemo(() => Math.max(0, amountDue - paid), [amountDue, paid]);
  const change = useMemo(() => Math.max(0, paid - amountDue), [amountDue, paid]);
  const canGoCheckout = useMemo(() => cart.length > 0 && totals.total > 0, [cart.length, totals.total]);
  const canComplete = useMemo(() => cart.length > 0 && totals.total > 0 && balance === 0, [cart.length, totals.total, balance]);

  // Complete order
  const completeOrder = useCallback(async () => {
    if (!canComplete) return;
    setIsProcessing(true);

    try {
      // Create customer if walk-in
      let customerId = selectedCustomerId;
      if (customer === "walkin" && !customerId) {
        const newCustomer = await customerService.create({ name: "Walk-in Customer", status: "active" });
        customerId = newCustomer.id;
      } else if (customer === "saved1" && customers[0]) {
        customerId = customers[0].id;
      } else if (customer === "saved2" && customers[1]) {
        customerId = customers[1].id;
      }

      if (!customerId) throw new Error("Customer selection required");

      // Create order - API uses snake_case format
      const orderPayload = {
        customer_id: Number(customerId),
        ordered_at: new Date().toISOString().split('T')[0],
        status: "pending",
        store_id: selectedStore || undefined,  // Add store_id if selected
        total: Math.round(totals.total),  // Add total amount
        items: cart.map(item => ({
          product_id: Number(item.id),
          quantity: item.qty,
          price: Math.round(item.price)  // Add price per item
        })),
      };
      console.log("Creating order with payload:", JSON.stringify(orderPayload, null, 2));

      let order;
      try {
        order = await orderService.create(orderPayload as unknown as import("@/types").Order);
        console.log("Order created successfully:", order);
      } catch (orderErr: any) {
        // Enhanced error logging for debugging
        console.error("=== ORDER CREATION ERROR - FULL DETAILS ===");
        console.error("Status:", orderErr?.response?.status);
        console.error("Status Text:", orderErr?.response?.statusText);
        console.error("Response Data:", JSON.stringify(orderErr?.response?.data, null, 2));
        console.error("Response Headers:", orderErr?.response?.headers);
        console.error("Request URL:", orderErr?.config?.url);
        console.error("Request Method:", orderErr?.config?.method);
        console.error("Request Payload:", JSON.stringify(orderPayload, null, 2));
        console.error("Error Message:", orderErr?.message);
        console.error("Cart Data:", JSON.stringify(cart, null, 2));
        console.error("Customer ID:", customerId, typeof customerId);
        console.error("==========================================");
        throw orderErr;
      }

      // Create payment(s) - paid_at needs datetime format "YYYY-MM-DD HH:mm"
      const paymentTime = new Date();
      const paidAt = `${paymentTime.toISOString().split('T')[0]} ${paymentTime.toTimeString().slice(0, 5)}`;
      console.log("Creating payment with paid_at:", paidAt);

      try {
        if (splitPay) {
          const payments = [];
          if (cashPay > 0) payments.push(paymentService.create({ order_id: order.id as unknown as number, amount: Math.round(cashPay), method: "cash", status: "completed", paid_at: paidAt }));
          if (cardPay > 0) payments.push(paymentService.create({ order_id: order.id as unknown as number, amount: Math.round(cardPay), method: "card", status: "completed", paid_at: paidAt }));
          if (onlinePay > 0) payments.push(paymentService.create({ order_id: order.id as unknown as number, amount: Math.round(onlinePay), method: "online", status: "completed", paid_at: paidAt }));
          await Promise.all(payments);
        } else {
          await paymentService.create({ order_id: order.id as unknown as number, amount: Math.round(paid), method: primaryMethod, status: "completed", paid_at: paidAt });
        }
        console.log("Payment(s) created successfully");
      } catch (paymentErr: any) {
        console.error("Payment creation failed:", {
          status: paymentErr?.response?.status,
          data: paymentErr?.response?.data,
          message: paymentErr?.message,
        });
        throw paymentErr;
      }

      // Update inventory (non-blocking)
      productService.bulkStockDecrement({
        items: cart.map(item => ({ productId: Number(item.id), quantity: item.qty, variantSku: null })),
        orderId: `ORD-${order.id}`,
      }).catch(() => { /* Silent fail */ });

      // Generate transaction number: TXN-YYYYMMDD-XXXX
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
      const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
      const txnNumber = `TXN-${dateStr}-${rand}`;

      // Build discount label
      let discountLabel = "Discount";
      if (discountValue > 0) {
        discountLabel = discountMode === "percent" ? `Discount (${discountValue}%)` : "Discount";
      }

      // Build tax label
      const taxLabel = taxEnabled ? `Tax (${Math.round(taxRate * 100)}% VAT)` : "Tax (VAT Exempt)";

      // Determine payment method label
      let paymentMethodLabel: string;
      if (splitPay) {
        const parts: string[] = [];
        if (cashPay > 0) parts.push("Cash");
        if (cardPay > 0) parts.push("Card");
        if (onlinePay > 0) parts.push("Online");
        paymentMethodLabel = `Split (${parts.join(", ")})`;
      } else {
        paymentMethodLabel = primaryMethod.charAt(0).toUpperCase() + primaryMethod.slice(1);
      }

      const customerName = customer === "walkin"
        ? "Walk-in Customer"
        : customers.find(c => c.id === customerId)?.name || "Customer";

      // Build receipt data
      const receipt: ReceiptData = {
        transactionNumber: txnNumber,
        date: now.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        customerName,
        items: [...cart],
        subtotal: totals.subtotal,
        discount: totals.discount,
        discountLabel,
        tax: totals.tax,
        taxLabel,
        deliveryFee: totals.deliveryFee,
        total: totals.total,
        paymentMethod: paymentMethodLabel,
        amountTendered: paid,
        change,
      };

      setReceiptData(receipt);
      setSuccessModalOpen(true);  // Open success modal instead of changing screen

      // Don't reset cart yet - wait for user to click "New Transaction"

    } catch (err: any) {
      // Extract full error details for debugging
      const responseData = err?.response?.data;
      const status = err?.response?.status;
      console.error("Complete order error:", {
        status,
        responseData: JSON.stringify(responseData, null, 2),
        message: err?.message,
        fullError: JSON.stringify(err, null, 2),
      });

      // Extract validation errors if present
      const validationErrors = responseData?.errors
        ? Object.values(responseData.errors).flat().join(", ")
        : err?.errors
          ? Object.values(err.errors).flat().join(", ")
          : "";

      // Get server message from response data
      const serverMsg = responseData?.message
        || err?.message
        || "Something went wrong";

      // For 500 errors, provide more context
      const displayMsg = status === 500
        ? `Server error: ${serverMsg}. Please contact support if this persists.`
        : validationErrors || serverMsg;

      Swal.fire({
        icon: "error",
        title: status === 500 ? "Server Error" : "Order Failed",
        text: displayMsg,
        confirmButtonColor: "#7c3aed",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [canComplete, customer, customers, selectedCustomerId, cart, splitPay, cashPay, cardPay, onlinePay, paid, primaryMethod, totals, change, loadInitialData]);

  const startNewTransaction = useCallback(() => {
    // Close success modal
    setSuccessModalOpen(false);
    setReceiptData(null);

    // Reset to sale screen
    setScreen("sale");

    // Reset cart and payment state
    setCart([]);
    setNotes("");
    setDiscountValue(0);
    setCashPay(0);
    setCardPay(0);
    setOnlinePay(0);

    // Reset customer and payment settings
    setSelectedCustomerId(null);
    setCustomer("walkin");
    setFulfillment("pickup");
    setPaymentType("full");
    setSplitPay(false);
    setPrimaryMethod("cash");
    setTaxEnabled(true);
    setTaxRate(0.12);
    setDiscountMode("amount");

    // Generate new sale ID
    const base = String(Math.floor(Date.now() / 1000)).slice(-6);
    setSaleId(`SALE-${base}`);

    // Refresh products in background
    loadInitialData();
  }, [loadInitialData]);

  const screenProps = useMemo(() => ({
    screen, cart, query, setQuery, barcodeInput, setBarcodeInput, category, setCategory,
    customer, setCustomer, notes, setNotes, filtered, addToCart, applyBarcode, changeQty,
    removeItem, totals, discountAmount, canGoCheckout, setScreen, discountMode, setDiscountMode,
    discountValue, setDiscountValue, taxEnabled, setTaxEnabled, taxRate, setTaxRate,
    fulfillment, setFulfillment, deliveryKm, setDeliveryKm, paymentType, setPaymentType,
    splitPay, setSplitPay, primaryMethod, setPrimaryMethod, cashPay, setCashPay,
    cardPay, setCardPay, onlinePay, setOnlinePay, amountDue, paid, balance, change,
    canComplete, setReceiptOpen, calcDeliveryFee, completeOrder, categories,
    receiptData, startNewTransaction,
  }), [screen, cart, query, barcodeInput, category, customer, notes, filtered, addToCart,
    applyBarcode, changeQty, removeItem, totals, discountAmount, canGoCheckout, discountMode,
    discountValue, taxEnabled, taxRate, fulfillment, deliveryKm, paymentType, splitPay,
    primaryMethod, cashPay, cardPay, onlinePay, amountDue, paid, balance, change,
    canComplete, completeOrder, categories, receiptData, startNewTransaction]);

  // Show loading
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Show error
  if (error) {
    return (
      <div className={`min-h-screen ${THEME.bg} flex items-center justify-center`}>
        <div className="text-center max-w-md">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <Button onClick={loadInitialData} className="rounded-xl bg-purple-600 hover:bg-purple-700">
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
              <div className={`text-xs ${THEME.muted} truncate`}>{screen === "sale" ? "Sale" : screen === "checkout" ? "Checkout" : "Receipt"} - Txn {saleId ?? "—"}</div>
            </div>
            <div className="hidden lg:flex gap-2 ml-2">
              <Pill>Cashier</Pill>
              {stores.length > 0 && (
                <Select value={selectedStore ? String(selectedStore) : "all"} onValueChange={(v) => setSelectedStore(v === "all" ? null : Number(v))}>
                  <SelectTrigger className="h-7 w-auto rounded-full bg-white/10 border-white/10 text-white text-xs px-3" suppressHydrationWarning>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    {stores.map(store => (
                      <SelectItem key={store.id} value={String(store.id)}>{store.name}</SelectItem>
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
                  setRecentOrders(extractDataArray(orders));
                } catch { /* Silent fail */ }
              }}
            >
              <History className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Orders</span>
            </Button>

            {screen !== "sale" && (
              <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20 text-white" onClick={() => setScreen(screen === "receipt" ? "sale" : "sale")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}

            <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20 text-white" onClick={() => setReceiptOpen(true)}>
              <FileText className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Receipt</span>
            </Button>

            <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20 text-white" onClick={() => setHoldOpen(true)} disabled={cart.length === 0}>
              <PauseCircle className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Hold</span>
            </Button>

            <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20 text-white" onClick={() => setSettingsOpen(true)}>
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

      <main className="h-auto lg:h-[calc(100vh-84px)] px-4 py-4 lg:px-6 lg:overflow-hidden">
        <Suspense fallback={null}>
          <DesktopPOSLayout {...screenProps} />
        </Suspense>
      </main>

      {/* Lazy loaded dialogs */}
      <Suspense fallback={null}>
        {holdOpen && <InlineHoldDialog open={holdOpen} onOpenChange={setHoldOpen} cart={cart} />}
        {receiptOpen && <InlineReceiptDialog open={receiptOpen} onOpenChange={setReceiptOpen} cart={cart} totals={totals} saleId={saleId} notes={notes} receiptData={receiptData} />}
        {settingsOpen && <InlineSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} taxEnabled={taxEnabled} setTaxEnabled={setTaxEnabled} taxRate={taxRate} setTaxRate={setTaxRate} />}
        {orderHistoryOpen && <InlineOrderHistoryDialog open={orderHistoryOpen} onOpenChange={setOrderHistoryOpen} recentOrders={recentOrders} />}
        {successModalOpen && <TransactionSuccessDialog open={successModalOpen} onOpenChange={setSuccessModalOpen} receiptData={receiptData} onNewTransaction={startNewTransaction} />}
      </Suspense>

      {/* Hidden thermal receipt for printing */}
      {receiptData && <ThermalReceipt receiptData={receiptData} />}

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

// Inline dialog components (fallback if lazy imports fail)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

function InlineHoldDialog({ open, onOpenChange, cart }: { open: boolean; onOpenChange: (v: boolean) => void; cart: CartItem[] }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl bg-[#201836] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Hold this sale</DialogTitle>
          <DialogDescription className="text-white/60">Save the cart temporarily and resume later.</DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-3 space-y-2">
          <div className="text-sm">Hold reference</div>
          <Input className="rounded-xl bg-white/10 border-white/10 text-white" placeholder="Example Counter 1" />
          <div className="text-xs text-white/60">Feature coming soon.</div>
        </div>
        <DialogFooter>
          <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20 text-white" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="rounded-xl bg-purple-600 hover:bg-purple-700" onClick={() => { onOpenChange(false); alert("Hold sale feature coming soon."); }} disabled={cart.length === 0}>Hold Sale</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InlineReceiptDialog({ open, onOpenChange, cart, totals, saleId, notes, receiptData }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl bg-[#201836] border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Receipt Preview</DialogTitle>
          <DialogDescription className="text-white/60">{receiptData ? "Order completed successfully" : "Preview receipt before checkout"}</DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold">Vendora Retail</div>
              <div className="text-xs text-white/60">{receiptData ? `Order ${receiptData.orderNumber}` : `Transaction ${saleId ?? "—"}`}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/60">Cashier</div>
              <div className="text-sm">Staff</div>
            </div>
          </div>
          <div className="h-px bg-white/10" />
          <div className="space-y-2">
            {cart.length === 0 ? (
              <div className="text-sm text-white/60">No items</div>
            ) : (
              cart.map((x: CartItem) => (
                <div key={x.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <div className="truncate">{x.name}</div>
                    <div className="text-xs text-white/60">{x.qty} {x.unit} × ₱ {x.price.toLocaleString()}</div>
                  </div>
                  <div className="font-medium">₱ {(x.qty * x.price).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
          <div className="h-px bg-white/10" />
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between"><span className="text-white/60">Subtotal</span><span>₱ {totals.subtotal.toLocaleString()}</span></div>
            <div className="flex items-center justify-between"><span className="text-white/60">Discount</span><span>₱ {totals.discount.toLocaleString()}</span></div>
            <div className="flex items-center justify-between"><span className="text-white/60">Tax</span><span>₱ {totals.tax.toLocaleString()}</span></div>
            <div className="flex items-center justify-between"><span className="text-white/60">Delivery</span><span>₱ {totals.deliveryFee.toLocaleString()}</span></div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between font-semibold"><span>Total</span><span>₱ {totals.total.toLocaleString()}</span></div>
            {receiptData && (
              <>
                <div className="flex items-center justify-between"><span className="text-white/60">Paid</span><span>₱ {receiptData.paid.toLocaleString()}</span></div>
                <div className="flex items-center justify-between"><span className="text-white/60">Change</span><span>₱ {receiptData.change.toLocaleString()}</span></div>
                <div className="text-xs text-white/60 mt-2">Payment: {receiptData.paymentMethod}</div>
              </>
            )}
          </div>
          {notes && <div className="text-xs text-white/60">Notes: {notes}</div>}
        </div>
        <DialogFooter>
          <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20 text-white" onClick={() => onOpenChange(false)}>Close</Button>
          <Button className="rounded-xl bg-purple-600 hover:bg-purple-700" onClick={() => window.print()}>Print</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InlineSettingsDialog({ open, onOpenChange, taxEnabled, setTaxEnabled, taxRate, setTaxRate }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl bg-[#201836] border-white/10 text-white max-w-xl">
        <DialogHeader>
          <DialogTitle>POS Settings</DialogTitle>
          <DialogDescription className="text-white/60">Configure POS preferences</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3 space-y-2">
            <div className="text-sm font-medium">Tax defaults</div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Tax enabled by default</span>
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
        </div>
        <DialogFooter>
          <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20 text-white" onClick={() => onOpenChange(false)}>Close</Button>
          <Button className="rounded-xl bg-purple-600 hover:bg-purple-700" onClick={() => onOpenChange(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InlineOrderHistoryDialog({ open, onOpenChange, recentOrders }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl bg-[#201836] border-white/10 text-white max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Recent Orders</DialogTitle>
          <DialogDescription className="text-white/60">View and manage recent transactions</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          {recentOrders.length === 0 ? (
            <div className="text-center py-8"><p className="text-white/60">No orders found</p></div>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{order.order_number || `ORD-${order.id}`}</div>
                      <div className="text-sm text-white/60">{order.customer || "Walk-in"}</div>
                      <div className="text-xs text-white/60">{order.ordered_at}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₱ {(order.total || 0).toLocaleString()}</div>
                      <div className="text-xs text-white/60">{order.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20 text-white" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Transaction Success Modal - Uses the original receipt design
function TransactionSuccessDialog({ open, onOpenChange, receiptData, onNewTransaction }: any) {
  const THEME = {
    muted: "text-white/60",
  };

  if (!receiptData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-transparent border-0 p-0">
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">Transaction Successful</DialogTitle>

        {/* Original Receipt Design */}
        <div className="rounded-3xl bg-gradient-to-b from-[#2d1f5e] to-[#3a2570] border border-white/10 overflow-hidden shadow-2xl">
          {/* Header - Checkmark + Title */}
          <div className="pt-10 pb-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 ring-4 ring-emerald-500/30">
              <CheckCircle2 className="h-12 w-12 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Transaction Successful!</h2>
            <p className={`text-sm ${THEME.muted} mt-1 tracking-wider uppercase`}>Vendora POS</p>
          </div>

          <div className="px-6 pb-8 space-y-0">
            {/* Transaction Details */}
            <div className="border-t border-white/10 py-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={THEME.muted}>Transaction #</span>
                <span className="text-white font-medium">{receiptData.transactionNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={THEME.muted}>Date</span>
                <span className="text-white">{receiptData.date}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={THEME.muted}>Customer</span>
                <span className="text-white">{receiptData.customerName}</span>
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-white/10 py-4">
              <h3 className="text-sm font-semibold text-white mb-3">Items</h3>
              <div className="space-y-2">
                {receiptData.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className={THEME.muted}>
                      {item.name} <span className="text-white/40">x{item.qty}</span>
                    </span>
                    <span className="text-white">₱ {(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-white/10 py-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={THEME.muted}>Subtotal</span>
                <span className="text-white">₱ {receiptData.subtotal.toFixed(2)}</span>
              </div>
              {receiptData.discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className={THEME.muted}>{receiptData.discountLabel}</span>
                  <span className="text-emerald-400">- ₱ {receiptData.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className={THEME.muted}>{receiptData.taxLabel}</span>
                <span className="text-white">₱ {receiptData.tax.toFixed(2)}</span>
              </div>
              {receiptData.deliveryFee > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className={THEME.muted}>Delivery Fee</span>
                  <span className="text-white">₱ {receiptData.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                <span className="text-white font-bold">Total</span>
                <span className="text-emerald-400 font-bold text-lg">₱ {receiptData.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-t border-white/10 py-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={THEME.muted}>Payment Method</span>
                <span className="text-white font-medium">{receiptData.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={THEME.muted}>Amount Tendered</span>
                <span className="text-white">₱ {receiptData.amountTendered.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={THEME.muted}>Change</span>
                <span className="text-emerald-400 font-medium">₱ {receiptData.change.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-white/10 pt-6 space-y-3">
              <Button
                className="w-full rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-semibold py-6 text-base"
                onClick={onNewTransaction}
              >
                New Transaction
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  className="rounded-2xl bg-white/10 hover:bg-white/20 text-white py-5"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-2xl bg-white/10 hover:bg-white/20 text-white py-5"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Transaction Receipt",
                        text: `Transaction ${receiptData.transactionNumber} - Total: ₱${receiptData.total.toFixed(2)}`,
                      }).catch(() => {});
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Thermal Receipt Component (Hidden, for printing only)
function ThermalReceipt({ receiptData }: { receiptData: ReceiptData }) {
  return (
    <div id="thermal-receipt" className="hidden print:block print:p-0 print:m-0">
      <div className="thermal-receipt" style={{ width: '80mm', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.5' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '10px', borderBottom: '1px dashed #000', paddingBottom: '10px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>VENDORA POS</div>
          <div style={{ fontSize: '11px' }}>Point of Sale System</div>
        </div>

        {/* Transaction Info */}
        <div style={{ marginBottom: '10px', fontSize: '11px' }}>
          <div>TXN: {receiptData.transactionNumber}</div>
          <div>Date: {receiptData.date}</div>
          <div>Customer: {receiptData.customerName}</div>
          <div>Cashier: Staff</div>
        </div>

        {/* Items */}
        <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '10px 0' }}>
          {receiptData.items.map((item, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 'bold' }}>{item.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.qty} x ₱{item.price.toLocaleString()}</span>
                <span>₱{(item.qty * item.price).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Subtotal:</span>
            <span>₱{receiptData.subtotal.toLocaleString()}</span>
          </div>
          {receiptData.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>{receiptData.discountLabel}:</span>
              <span>-₱{receiptData.discount.toLocaleString()}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>{receiptData.taxLabel}:</span>
            <span>₱{receiptData.tax.toLocaleString()}</span>
          </div>
          {receiptData.deliveryFee > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Delivery Fee:</span>
              <span>₱{receiptData.deliveryFee.toLocaleString()}</span>
            </div>
          )}
          <div style={{ borderTop: '1px solid #000', marginTop: '5px', paddingTop: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold' }}>
              <span>TOTAL:</span>
              <span>₱{receiptData.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #000' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Payment ({receiptData.paymentMethod}):</span>
            <span>₱{receiptData.amountTendered.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>Change:</span>
            <span>₱{receiptData.change.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #000', fontSize: '11px' }}>
          <div>Thank you for your purchase!</div>
          <div style={{ marginTop: '5px' }}>Please come again</div>
        </div>
      </div>
    </div>
  );
}
