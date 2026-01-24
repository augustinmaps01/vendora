"use client"

import React, { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import DesktopPOSLayout from "@/components/screens/pos-screen/DesktopPOSLayout";
import {
  type POSProduct,
  type CartItem,
  type Fulfillment,
  type Screen,
} from "@/components/screens/pos-screen";

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
  return <span>{"\u20B1 "}{Math.round(value).toLocaleString()}</span>;
}

export default function VendoraPOS() {
  const [screen, setScreen] = useState<Screen>("sale");

  const [query, setQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [category, setCategory] = useState<"all" | POSProduct["category"]>("all");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<"walkin" | "saved1" | "saved2">("walkin");
  const [notes, setNotes] = useState("");

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

  const [holdOpen, setHoldOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const products = useMemo<POSProduct[]>(
    () => [
      { id: "p1", name: "Premium Rice 5kg", sku: "GR-1001", barcode: "480001000001", price: 1250, stock: 18, category: "grocery", unit: "bag" },
      { id: "p2", name: "Cooking Oil 1L", sku: "GR-1020", barcode: "480001000002", price: 160, stock: 40, category: "grocery", unit: "bottle" },
      { id: "p3", name: "Laundry Detergent 1kg", sku: "GR-1201", barcode: "480001000003", price: 150, stock: 25, category: "grocery", unit: "pack" },
      { id: "p4", name: "Cement 40kg", sku: "HW-2001", barcode: "490002000001", price: 360, stock: 70, category: "hardware", unit: "bag" },
      { id: "p5", name: "PVC Pipe 1 inch", sku: "HW-1023", barcode: "490002000002", price: 95, stock: 6, category: "hardware", unit: "pc" },
      { id: "p6", name: "Nails Assorted", sku: "HW-3102", barcode: "490002000003", price: 55, stock: 120, category: "hardware", unit: "pack" },
      { id: "p7", name: "Screwdriver Set", sku: "HW-0902", barcode: "490002000004", price: 260, stock: 4, category: "hardware", unit: "set" },
      { id: "p8", name: "General Item", sku: "GN-0001", barcode: "470003000001", price: 99, stock: 999, category: "general", unit: "pc" },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const okCat = category === "all" ? true : p.category === category;
      const okQuery = !q ? true : `${p.name} ${p.sku} ${p.barcode}`.toLowerCase().includes(q);
      return okCat && okQuery;
    });
  }, [products, query, category]);

  const addToCart = (p: POSProduct, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((x) => x.id === p.id);
      if (found) {
        const nextQty = clampQty(found.qty + qty, p.stock);
        return prev.map((x) => (x.id === p.id ? { ...x, qty: nextQty } : x));
      }
      return [
        ...prev,
        { id: p.id, name: p.name, sku: p.sku, barcode: p.barcode, price: p.price, stock: p.stock, unit: p.unit, qty: clampQty(qty, p.stock) },
      ];
    });
  };

  const applyBarcode = () => {
    const code = barcodeInput.trim();
    if (!code) return;
    const found = products.find((p) => p.barcode === code || p.sku.toLowerCase() === code.toLowerCase());
    if (found) {
      addToCart(found, 1);
      setBarcodeInput("");
      return;
    }
    alert("Product not found (demo). Add lookup in your API.");
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

    if (splitPay) return c + k + o;

    if (primaryMethod === "cash") return c;
    if (primaryMethod === "card") return k;
    return o;
  }, [splitPay, primaryMethod, cashPay, cardPay, onlinePay]);

  const balance = useMemo(() => Math.max(0, amountDue - paid), [amountDue, paid]);
  const change = useMemo(() => Math.max(0, paid - amountDue), [amountDue, paid]);

  const canGoCheckout = useMemo(() => cart.length > 0 && totals.total > 0, [cart.length, totals.total]);
  const canComplete = useMemo(() => cart.length > 0 && totals.total > 0 && balance === 0, [cart.length, totals.total, balance]);

  const [saleId, setSaleId] = useState<string | null>(null);

  useEffect(() => {
    const base = String(Math.floor(Date.now() / 1000)).slice(-6);
    setSaleId(`SALE-${base}`);
  }, []);

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
  };

  const bodyHeight = "h-auto lg:h-[calc(100vh-84px)]";

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
              <Pill>{customer === "walkin" ? "Walk in" : customer === "saved1" ? "Mark S." : "Liza R."}</Pill>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
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
            <div className={`text-xs ${THEME.muted}`}>In real flow, save to backend with cashier ID and timestamp.</div>
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
                alert("Sale held (demo). Implement save hold API.");
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
            <DialogDescription className="text-white/60">Print, email, or save after payment.</DialogDescription>
          </DialogHeader>

          <div className={`rounded-2xl ${THEME.panel} p-4 space-y-3`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">Vendora Retail Demo</div>
                <div className={`text-xs ${THEME.muted}`}>Transaction {saleId ?? "—"}</div>
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
                      <div className={`text-xs ${THEME.muted}`}>{x.qty} {x.unit} Ã— <Money value={x.price} /></div>
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
              <div className="flex items-center justify-between"><span className={THEME.muted}>Paid</span><span><Money value={paid} /></span></div>
              <div className="flex items-center justify-between"><span className={THEME.muted}>Change</span><span><Money value={change} /></span></div>
            </div>

            {notes ? <div className={`text-xs ${THEME.muted}`}>Notes: {notes}</div> : null}
          </div>

          <DialogFooter>
            <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20 text-white" onClick={() => setReceiptOpen(false)}>
              Close
            </Button>
            <Button className="rounded-xl bg-purple-600 hover:bg-purple-700" onClick={() => alert("Print action (demo). Add print support.")}>
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
            <DialogDescription className="text-white/60">UI only settings for MVP</DialogDescription>
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
              <div className={`text-xs ${THEME.muted}`}>Store per device settings in backend later.</div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20 text-white" onClick={() => setSettingsOpen(false)}>
              Close
            </Button>
            <Button className="rounded-xl bg-purple-600 hover:bg-purple-700" onClick={() => { setSettingsOpen(false); alert("Saved (demo). Persist via API."); }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="px-6 pb-6">
        <div className={`text-xs ${THEME.muted}`}>POS system - unified layout</div>
      </footer>
    </div>
  );
}

