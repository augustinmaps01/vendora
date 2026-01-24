"use client"

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Search,
  Barcode,
  ShoppingCart,
  Package,
  Trash2,
  Minus,
  Plus,
  User,
  Percent,
  Truck,
  Store,
  CreditCard,
  Banknote,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { type POSScreenProps } from "./types";

const THEME = {
  bg: "bg-gradient-to-br from-[#1f1633] via-[#241a3a] to-[#2b1f4a]",
  card: "bg-white/5 border border-white/10 backdrop-blur",
  panel: "bg-white/5 border border-white/10",
  muted: "text-white/60",
  text: "text-white",
};

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

function StatRow({ label, value, strong }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between text-sm ${strong ? "font-semibold" : ""}`}>
      <span className={THEME.muted}>{label}</span>
      <span className={strong ? "text-white" : "text-white"}>{value}</span>
    </div>
  );
}

/**
 * Default POS Layout
 * Uses responsive grid utilities for all screen sizes
 */
export default function DesktopPOSLayout(props: POSScreenProps) {
  const {
    screen = "sale",
    cart = [],
    query = "",
    setQuery = () => { },
    barcodeInput = "",
    setBarcodeInput = () => { },
    category = "all",
    setCategory = () => { },
    customer = "walkin",
    setCustomer = () => { },
    notes = "",
    setNotes = () => { },
    filtered = [],
    addToCart = () => { },
    applyBarcode = () => { },
    changeQty = () => { },
    removeItem = () => { },
    totals = { subtotal: 0, discount: 0, tax: 0, deliveryFee: 0, total: 0 },
    discountAmount = 0,
    canGoCheckout = false,
    setScreen = () => { },
    discountMode = "amount",
    setDiscountMode = () => { },
    discountValue = 0,
    setDiscountValue = () => { },
    taxEnabled = true,
    setTaxEnabled = () => { },
    taxRate = 0.12,
    setTaxRate = () => { },
    fulfillment = "pickup",
    setFulfillment = () => { },
    deliveryKm = 3,
    setDeliveryKm = () => { },
    paymentType = "full",
    setPaymentType = () => { },
    splitPay = false,
    setSplitPay = () => { },
    primaryMethod = "cash",
    setPrimaryMethod = () => { },
    cashPay = 0,
    setCashPay = () => { },
    cardPay = 0,
    setCardPay = () => { },
    onlinePay = 0,
    setOnlinePay = () => { },
    amountDue = 0,
    paid = 0,
    balance = 0,
    change = 0,
    canComplete = false,
    setReceiptOpen = () => { },
    calcDeliveryFee = () => 0,
  } = props || {};
  return (
    <div className="h-full">
      {screen === "sale" ? (
        <div className="h-full grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* Left column - Products */}
          <div className="h-full xl:col-span-8 grid grid-rows-[auto_1fr] gap-4 overflow-hidden">
            <Card className={`rounded-2xl ${THEME.card}`}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                    <div className={`rounded-2xl ${THEME.panel} p-2 flex flex-col gap-2 sm:flex-row sm:items-center`}>
                      <User className={`h-4 w-4 ${THEME.muted}`} />
                      <Select value={customer} onValueChange={(v) => setCustomer(v as any)}>
                        <SelectTrigger className="w-full sm:w-[210px] rounded-xl bg-white/10 border-white/10 text-white" suppressHydrationWarning>
                          <SelectValue placeholder="Customer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="walkin">Walk in customer</SelectItem>
                          <SelectItem value="saved1">Mark S.</SelectItem>
                          <SelectItem value="saved2">Liza R.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className={`rounded-2xl ${THEME.panel} p-2 flex flex-col gap-2 sm:flex-row sm:items-center`}>
                      <Barcode className={`h-4 w-4 ${THEME.muted}`} />
                      <Input
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        className="w-full sm:w-[220px] rounded-xl bg-white/10 border-white/10 text-white placeholder:text-white/40"
                        placeholder="Scan barcode or type SKU"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") applyBarcode();
                        }}
                      />
                      <Button className="w-full sm:w-auto rounded-xl bg-purple-600 hover:bg-purple-700" onClick={applyBarcode}>
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Pill>Subtotal <Money value={totals.subtotal} /></Pill>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`rounded-2xl ${THEME.card} overflow-hidden`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Package className="h-4 w-4 text-purple-200" /> Products
                </CardTitle>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className={`h-4 w-4 ${THEME.muted} absolute left-3 top-1/2 -translate-y-1/2`} />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-9 rounded-xl bg-white/10 border-white/10 text-white placeholder:text-white/40"
                      placeholder="Search"
                    />
                  </div>

                  <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                    <SelectTrigger className="w-full sm:w-[140px] rounded-xl bg-white/10 border-white/10 text-white" suppressHydrationWarning>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="grocery">Grocery</SelectItem>
                      <SelectItem value="hardware">Hardware</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill>Tap to add</Pill>
                  <Pill>Stock check</Pill>
                </div>
              </CardHeader>

              <CardContent className="h-full overflow-hidden pt-0">
                <div className="h-full overflow-auto pr-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2">
                    {filtered.map((p) => (
                      <div
                        key={p.id}
                        className={`rounded-2xl ${THEME.panel} px-3 py-2 flex flex-col gap-1`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate text-white">{p.name}</div>
                          </div>

                          <div className="shrink-0 text-sm font-semibold text-white">
                            <Money value={p.price} />
                          </div>

                          <Button
                            size="sm"
                            disabled={p.stock <= 0}
                            onClick={() => addToCart(p, 1)}
                            className="rounded-xl bg-purple-600 hover:bg-purple-700 shrink-0"
                          >
                            Add
                          </Button>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <div className={`${THEME.muted}`}>
                            {p.sku} â€¢ {p.unit}
                          </div>
                          <div className={`${THEME.muted}`}>
                            Stock {p.stock}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Cart */}
          <div className="h-full xl:col-span-4 overflow-hidden">
            <Card className={`rounded-2xl ${THEME.card} h-full overflow-hidden flex flex-col`}>
              <CardHeader className="pb-3 shrink-0">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-purple-200" /> Cart
                </CardTitle>
                <div className={`text-xs ${THEME.muted}`}>Adjust quantity then go checkout</div>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden">
                <div className="h-full flex flex-col gap-3 overflow-hidden">
                  <div className="flex-1 overflow-auto pr-1">
                    {cart.length === 0 ? (
                      <div className="rounded-2xl border border-white/15 border-dashed p-6 text-center text-sm text-white/60">
                        Cart is empty
                      </div>
                    ) : (
                      <div className="space-y-2 pb-2">
                        {cart.map((x) => (
                          <div key={x.id} className={`rounded-2xl ${THEME.panel} p-2`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="font-medium truncate text-white text-xs">
                                  {x.name} <span className={`text-[7px] ${THEME.muted} font-normal`}>({x.sku})</span>
                                </div>
                                <div className={`text-[7px] ${THEME.muted}`}>{x.unit}</div>
                              </div>
                              <div className="text-sm font-semibold text-white"><Money value={x.price * x.qty} /></div>
                            </div>

                            <div className="mt-1 flex items-center gap-2">
                              <div className="flex items-center rounded-md bg-white/10 border border-white/10 h-5 overflow-hidden">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-full w-5 p-0 rounded-none hover:bg-white/10 text-purple-200"
                                  onClick={() => changeQty(x.id, x.qty - 1)}
                                >
                                  <Minus className="h-2 w-2" />
                                </Button>
                                <Input
                                  value={x.qty}
                                  onChange={(e) => changeQty(x.id, e.target.value)}
                                  className="h-full w-7 text-center bg-transparent border-0 text-white text-[9px] p-0 focus-visible:ring-0 rounded-none"
                                  inputMode="numeric"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-full w-5 p-0 rounded-none hover:bg-white/10 text-purple-200"
                                  onClick={() => changeQty(x.id, x.qty + 1)}
                                >
                                  <Plus className="h-2 w-2" />
                                </Button>
                              </div>

                              <div className={`ml-auto text-[10px] ${THEME.muted}`}>Unit <Money value={x.price} /></div>

                              <Button
                                variant="outline"
                                size="sm"
                                className="h-5 w-5 p-0 rounded-md border-red-500/30 text-gray-600 hover:bg-red-500/10 hover:text-red-200"
                                onClick={() => removeItem(x.id)}
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>

                            {x.qty >= x.stock ? <div className={`mt-2 text-xs ${THEME.muted}`}>Max stock reached</div> : null}
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                  <div className={`rounded-2xl ${THEME.panel} p-2 space-y-2 shrink-0`}>
                    <div className="text-sm font-medium text-white">Notes</div>
                    <Input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="rounded-xl bg-white/10 border-white/10 text-white placeholder:text-white/40"
                      placeholder="Optional"
                    />
                    <div className="h-px bg-white/10" />
                    <StatRow label="Subtotal" value={<Money value={totals.subtotal} />} />
                    <StatRow label="Discount" value={<Money value={discountAmount} />} />
                    <StatRow label="Tax" value={<Money value={totals.tax} />} />
                    <StatRow label="Delivery" value={<Money value={totals.deliveryFee} />} />
                    <div className="h-px bg-white/10" />
                    <StatRow label="Total" value={<Money value={totals.total} />} strong />
                    {cart.length > 0 ? (
                      <Button
                        className="w-full rounded-xl bg-purple-600 hover:bg-purple-700"
                        disabled={!canGoCheckout}
                        onClick={() => setScreen("checkout")}
                      >
                        Checkout
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // Checkout Screen
        <div className="h-full grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* Left: options */}
          <div className="h-full xl:col-span-7 overflow-hidden">
            <Card className={`rounded-2xl ${THEME.card} h-full overflow-hidden`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white">Checkout Details</CardTitle>
                <div className={`text-xs ${THEME.muted}`}>Keep this screen clean and focused</div>
              </CardHeader>

              <CardContent className="h-full overflow-hidden">
                <div className="h-full overflow-auto pr-1 space-y-4 pb-2">
                  <Card className={`rounded-2xl ${THEME.card}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white">Fulfillment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={fulfillment === "pickup" ? "default" : "secondary"}
                          className={
                            fulfillment === "pickup"
                              ? "rounded-xl bg-purple-600 hover:bg-purple-700"
                              : "rounded-xl bg-white/10 hover:bg-white/20 text-white"
                          }
                          onClick={() => setFulfillment("pickup")}
                        >
                          <Store className="h-4 w-4 mr-2" /> Pickup
                        </Button>
                        <Button
                          type="button"
                          variant={fulfillment === "delivery" ? "default" : "secondary"}
                          className={
                            fulfillment === "delivery"
                              ? "rounded-xl bg-purple-600 hover:bg-purple-700"
                              : "rounded-xl bg-white/10 hover:bg-white/20 text-white"
                          }
                          onClick={() => setFulfillment("delivery")}
                        >
                          <Truck className="h-4 w-4 mr-2" /> Delivery
                        </Button>
                      </div>

                      {fulfillment === "delivery" ? (
                        <div className={`rounded-2xl ${THEME.panel} p-3 space-y-2`}>
                          <div className={`text-xs ${THEME.muted}`}>Distance estimate</div>
                          <Select value={String(deliveryKm)} onValueChange={(v) => setDeliveryKm(Number(v))}>
                            <SelectTrigger className="rounded-xl bg-white/10 border-white/10 text-white" suppressHydrationWarning>
                              <SelectValue placeholder="Distance" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 km</SelectItem>
                              <SelectItem value="3">3 km</SelectItem>
                              <SelectItem value="5">5 km</SelectItem>
                              <SelectItem value="8">8 km</SelectItem>
                              <SelectItem value="12">12 km</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="text-sm text-white">Delivery fee <Money value={calcDeliveryFee("delivery", deliveryKm)} /></div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>

                  <Card className={`rounded-2xl ${THEME.card}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white">Discount and Tax</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={discountMode === "amount" ? "default" : "secondary"}
                          className={
                            discountMode === "amount"
                              ? "rounded-xl bg-purple-600 hover:bg-purple-700"
                              : "rounded-xl bg-white/10 hover:bg-white/20 text-white"
                          }
                          onClick={() => setDiscountMode("amount")}
                        >
                          <Wallet className="h-4 w-4 mr-2" /> Amount
                        </Button>
                        <Button
                          type="button"
                          variant={discountMode === "percent" ? "default" : "secondary"}
                          className={
                            discountMode === "percent"
                              ? "rounded-xl bg-purple-600 hover:bg-purple-700"
                              : "rounded-xl bg-white/10 hover:bg-white/20 text-white"
                          }
                          onClick={() => setDiscountMode("percent")}
                        >
                          <Percent className="h-4 w-4 mr-2" /> Percent
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          value={discountValue}
                          onChange={(e) => setDiscountValue(Number(e.target.value || 0))}
                          className="rounded-xl bg-white/10 border-white/10 text-white"
                          inputMode="numeric"
                          placeholder={discountMode === "amount" ? "0" : "0 to 100"}
                        />
                        <Pill>{discountMode === "amount" ? "â‚±" : "%"}</Pill>
                      </div>

                      <div className={`rounded-2xl ${THEME.panel} p-3 space-y-2`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-white">Tax</div>
                            <div className={`text-xs ${THEME.muted}`}>Enable VAT or tax</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={taxEnabled} onCheckedChange={(v) => setTaxEnabled(Boolean(v))} />
                            <Label className="text-white/70">On</Label>
                          </div>
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
                    </CardContent>
                  </Card>

                  <Card className={`rounded-2xl ${THEME.card}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white">Payment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-white">Split payment</div>
                          <div className={`text-xs ${THEME.muted}`}>Cash, card, online</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={splitPay} onCheckedChange={(v) => setSplitPay(Boolean(v))} />
                          <Label className="text-white/70">Split</Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={paymentType === "full" ? "default" : "secondary"}
                          className={
                            paymentType === "full"
                              ? "rounded-xl bg-purple-600 hover:bg-purple-700"
                              : "rounded-xl bg-white/10 hover:bg-white/20 text-white"
                          }
                          onClick={() => setPaymentType("full")}
                        >
                          Full
                        </Button>
                        <Button
                          type="button"
                          variant={paymentType === "partial" ? "default" : "secondary"}
                          className={
                            paymentType === "partial"
                              ? "rounded-xl bg-purple-600 hover:bg-purple-700"
                              : "rounded-xl bg-white/10 hover:bg-white/20 text-white"
                          }
                          onClick={() => setPaymentType("partial")}
                        >
                          Partial
                        </Button>
                      </div>

                      {!splitPay ? (
                        <div className={`rounded-2xl ${THEME.panel} p-3 space-y-2`}>
                          <div className="text-sm font-medium text-white">Method</div>
                          <Select value={primaryMethod} onValueChange={(v) => setPrimaryMethod(v as any)}>
                            <SelectTrigger className="rounded-xl bg-white/10 border-white/10 text-white" suppressHydrationWarning>
                              <SelectValue placeholder="Method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="card">Card</SelectItem>
                              <SelectItem value="online">Online</SelectItem>
                            </SelectContent>
                          </Select>

                          <div className="flex items-center gap-2">
                            <Input
                              value={primaryMethod === "cash" ? cashPay : primaryMethod === "card" ? cardPay : onlinePay}
                              onChange={(e) => {
                                const v = Number(e.target.value || 0);
                                if (primaryMethod === "cash") setCashPay(v);
                                if (primaryMethod === "card") setCardPay(v);
                                if (primaryMethod === "online") setOnlinePay(v);
                              }}
                              className="rounded-xl bg-white/10 border-white/10 text-white"
                              inputMode="numeric"
                              placeholder="Amount paid"
                            />
                            {primaryMethod === "cash" ? <Banknote className="h-4 w-4 text-white/60" /> : null}
                            {primaryMethod === "card" ? <CreditCard className="h-4 w-4 text-white/60" /> : null}
                            {primaryMethod === "online" ? <Wallet className="h-4 w-4 text-white/60" /> : null}
                          </div>
                        </div>
                      ) : (
                        <div className={`rounded-2xl ${THEME.panel} p-3 space-y-3`}>
                          <div className="text-sm font-medium text-white">Split amounts</div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <div className={`text-xs ${THEME.muted}`}>Cash</div>
                              <Input
                                value={cashPay}
                                onChange={(e) => setCashPay(Number(e.target.value || 0))}
                                className="rounded-xl bg-white/10 border-white/10 text-white"
                                inputMode="numeric"
                                placeholder="0"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className={`text-xs ${THEME.muted}`}>Card</div>
                              <Input
                                value={cardPay}
                                onChange={(e) => setCardPay(Number(e.target.value || 0))}
                                className="rounded-xl bg-white/10 border-white/10 text-white"
                                inputMode="numeric"
                                placeholder="0"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className={`text-xs ${THEME.muted}`}>Online</div>
                              <Input
                                value={onlinePay}
                                onChange={(e) => setOnlinePay(Number(e.target.value || 0))}
                                className="rounded-xl bg-white/10 border-white/10 text-white"
                                inputMode="numeric"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className={`rounded-2xl ${THEME.panel} p-3 space-y-2`}>
                        <StatRow label="Amount due" value={<Money value={amountDue} />} strong />
                        <StatRow label="Paid" value={<Money value={paid} />} />
                        <StatRow label="Balance" value={<Money value={balance} />} />
                        <StatRow label="Change" value={<Money value={change} />} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: summary + complete button always visible */}
          <div className="h-full xl:col-span-5 overflow-hidden">
            <Card className={`rounded-2xl ${THEME.card} h-full overflow-hidden`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white">Summary</CardTitle>
                <div className={`text-xs ${THEME.muted}`}>Review items and totals</div>
              </CardHeader>

              <CardContent className="h-full overflow-hidden">
                <div className="h-full flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-auto pr-1">
                    <div className={`rounded-2xl ${THEME.panel} p-3 space-y-2`}>
                      {cart.length === 0 ? (
                        <div className={`text-sm ${THEME.muted}`}>No items</div>
                      ) : (
                        cart.map((x) => (
                          <div key={x.id} className="flex items-center justify-between text-sm">
                            <div className="min-w-0">
                              <div className="truncate text-white">{x.name}</div>
                              <div className={`text-xs ${THEME.muted}`}>{x.qty} {x.unit} Ã— <Money value={x.price} /></div>
                            </div>
                            <div className="font-medium text-white"><Money value={x.qty * x.price} /></div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className={`mt-3 rounded-2xl ${THEME.panel} p-3 space-y-2`}>
                      <StatRow label="Subtotal" value={<Money value={totals.subtotal} />} />
                      <StatRow label="Discount" value={<Money value={totals.discount} />} />
                      <StatRow label="Tax" value={<Money value={totals.tax} />} />
                      <StatRow label="Delivery" value={<Money value={totals.deliveryFee} />} />
                      <div className="h-px bg-white/10" />
                      <StatRow label="Total" value={<Money value={totals.total} />} strong />
                      <StatRow label="Amount due" value={<Money value={amountDue} />} strong />
                    </div>

                    {notes ? (
                      <div className={`mt-3 rounded-2xl ${THEME.panel} p-3 text-sm text-white`}>
                        <div className={`text-xs ${THEME.muted}`}>Notes</div>
                        <div>{notes}</div>
                      </div>
                    ) : null}
                  </div>

                  <div className="shrink-0 pt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="secondary"
                        className="rounded-xl bg-white/10 hover:bg-white/20 text-white"
                        onClick={() => setReceiptOpen(true)}
                      >
                        Preview receipt
                      </Button>
                      <Button
                        className="rounded-xl bg-purple-600 hover:bg-purple-700"
                        disabled={!canComplete}
                        onClick={() => {
                          setReceiptOpen(true);
                          alert("Payment captured (demo). Replace with API call.");
                        }}
                      >
                        Complete
                      </Button>
                    </div>

                    <div className={`mt-2 text-xs ${THEME.muted}`}>
                      Complete is enabled when balance is zero.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
