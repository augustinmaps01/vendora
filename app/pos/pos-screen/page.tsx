"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Save,
  Receipt,
  Settings,
  Package,
  Truck,
  ShoppingBag,
  RotateCcw,
  X,
  User as UserIcon,
} from "lucide-react"

// Type Definitions
interface Product {
  id: number
  name: string
  sku: string
  barcode: string
  category: string
  price: number
  stock: number
  unit: string
  image?: string
  description?: string
}

interface CartItem extends Product {
  quantity: number
  notes?: string
}

interface Customer {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  totalPurchases?: number
}

// Sample Data
const sampleProducts: Product[] = [
  // Grocery Items
  { id: 1, name: "Premium Rice 5kg", sku: "GR-1001", barcode: "480001000001", category: "Grocery", price: 1250, stock: 18, unit: "bag", description: "High-quality premium rice" },
  { id: 2, name: "Cooking Oil 1L", sku: "GR-1002", barcode: "480001000002", category: "Grocery", price: 185, stock: 45, unit: "bottle" },
  { id: 3, name: "All-Purpose Flour 1kg", sku: "GR-1003", barcode: "480001000003", category: "Grocery", price: 95, stock: 30, unit: "pack" },
  { id: 4, name: "White Sugar 1kg", sku: "GR-1004", barcode: "480001000004", category: "Grocery", price: 75, stock: 50, unit: "pack" },
  { id: 5, name: "Iodized Salt 500g", sku: "GR-1005", barcode: "480001000005", category: "Grocery", price: 25, stock: 60, unit: "pack" },
  { id: 6, name: "Soy Sauce 750ml", sku: "GR-1006", barcode: "480001000006", category: "Grocery", price: 85, stock: 35, unit: "bottle" },
  { id: 7, name: "Instant Noodles Pack", sku: "GR-1007", barcode: "480001000007", category: "Grocery", price: 12, stock: 100, unit: "pack" },
  // Beverages
  { id: 8, name: "Mineral Water 1L", sku: "BV-2001", barcode: "480002000001", category: "Beverages", price: 20, stock: 80, unit: "bottle" },
  { id: 9, name: "Cola 1.5L", sku: "BV-2002", barcode: "480002000002", category: "Beverages", price: 65, stock: 55, unit: "bottle" },
  { id: 10, name: "Orange Juice 1L", sku: "BV-2003", barcode: "480002000003", category: "Beverages", price: 95, stock: 40, unit: "carton" },
  { id: 11, name: "Coffee 3-in-1 Box", sku: "BV-2004", barcode: "480002000004", category: "Beverages", price: 150, stock: 25, unit: "box" },
  { id: 12, name: "Tea Bags 25pcs", sku: "BV-2005", barcode: "480002000005", category: "Beverages", price: 120, stock: 30, unit: "box" },
  { id: 13, name: "Energy Drink 250ml", sku: "BV-2006", barcode: "480002000006", category: "Beverages", price: 45, stock: 70, unit: "can" },
  // Snacks
  { id: 14, name: "Potato Chips 150g", sku: "SN-3001", barcode: "480003000001", category: "Snacks", price: 85, stock: 48, unit: "pack" },
  { id: 15, name: "Chocolate Bar 50g", sku: "SN-3002", barcode: "480003000002", category: "Snacks", price: 35, stock: 90, unit: "bar" },
  { id: 16, name: "Cookies Assorted 200g", sku: "SN-3003", barcode: "480003000003", category: "Snacks", price: 95, stock: 42, unit: "pack" },
  { id: 17, name: "Peanuts Roasted 100g", sku: "SN-3004", barcode: "480003000004", category: "Snacks", price: 45, stock: 55, unit: "pack" },
  { id: 18, name: "Candy Mix 250g", sku: "SN-3005", barcode: "480003000005", category: "Snacks", price: 65, stock: 38, unit: "pack" },
  { id: 19, name: "Biscuits 300g", sku: "SN-3006", barcode: "480003000006", category: "Snacks", price: 75, stock: 50, unit: "pack" },
  { id: 20, name: "Crackers 200g", sku: "SN-3007", barcode: "480003000007", category: "Snacks", price: 55, stock: 60, unit: "pack" }
]

const sampleCustomers: Customer[] = [
  { id: 1, name: "Walk-in Customer", email: "", phone: "", address: "", totalPurchases: 0 },
  { id: 2, name: "John Dela Cruz", email: "john.delacruz@email.com", phone: "+63 912 345 6789", address: "123 Main St, Manila", totalPurchases: 15420 },
  { id: 3, name: "Maria Santos", email: "maria.santos@email.com", phone: "+63 923 456 7890", address: "456 Oak Ave, Quezon City", totalPurchases: 8750 },
  { id: 4, name: "Pedro Reyes", email: "pedro.reyes@email.com", phone: "+63 934 567 8901", address: "789 Pine Rd, Makati", totalPurchases: 22300 },
  { id: 5, name: "Anna Garcia", email: "anna.garcia@email.com", phone: "+63 945 678 9012", address: "321 Elm St, Pasig", totalPurchases: 12150 }
]

const categories = ["All", "Grocery", "Beverages", "Snacks"]

const taxRates = [
  { label: "No Tax", value: 0 },
  { label: "VAT 12%", value: 12 },
  { label: "Service Tax 5%", value: 5 },
  { label: "Luxury Tax 20%", value: 20 }
]

const paymentMethods = [
  { label: "Cash", value: "cash" },
  { label: "Card", value: "card" },
  { label: "Online Payment", value: "online" },
  { label: "Split Payment", value: "split" }
]

const deliveryDistances = [2, 5, 10, 15]

const deliveryFeeConfig = {
  baseFee: 40,
  perKmFee: 12
}

const calculateDeliveryFee = (distance: number): number => {
  return deliveryFeeConfig.baseFee + (distance * deliveryFeeConfig.perKmFee)
}

const generateTransactionId = (): string => {
  return `SALE-${Date.now()}`
}

const currentCashier = {
  name: "Cashier Maria",
  shift: "Shift Open"
}

type DiscountMode = "amount" | "percent"
type FulfillmentType = "pickup" | "delivery"
type PaymentMode = "full" | "partial"
type PaymentSplit = "single" | "split"
type ActiveTab = "sale" | "returns"

export default function POSScreen() {
  // State Management
  const [activeTab, setActiveTab] = useState<ActiveTab>("sale")
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [cart, setCart] = useState<CartItem[]>([])
  const [notes, setNotes] = useState("")
  const [barcodeInput, setBarcodeInput] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [mounted, setMounted] = useState(false)

  // Fulfillment
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("pickup")
  const [deliveryDistance, setDeliveryDistance] = useState(5)

  // Discount
  const [discountMode, setDiscountMode] = useState<DiscountMode>("amount")
  const [discountValue, setDiscountValue] = useState(0)

  // Tax
  const [taxEnabled, setTaxEnabled] = useState(false)
  const [taxRate, setTaxRate] = useState(0)

  // Payment
  const [paymentType, setPaymentType] = useState<PaymentMode>("full")
  const [paymentSplit, setPaymentSplit] = useState<PaymentSplit>("single")
  const [cashPay, setCashPay] = useState(0)
  const [cardPay, setCardPay] = useState(0)
  const [onlinePay, setOnlinePay] = useState(0)

  // Modals
  const [holdOpen, setHoldOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Generate transaction ID on client side only
  useEffect(() => {
    setMounted(true)
    setTransactionId(generateTransactionId())
  }, [])

  // Add to cart
  const addToCart = useCallback((product: typeof sampleProducts[0]) => {
    if (product.stock === 0) return

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id)
      if (existing) {
        if (existing.quantity < product.stock) {
          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
        return prevCart
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }, [])

  // Barcode lookup
  useEffect(() => {
    if (!barcodeInput.trim()) return

    const match = sampleProducts.find((product) => product.barcode === barcodeInput.trim())
    if (match) {
      addToCart(match)
      setBarcodeInput("")
    }
  }, [barcodeInput, addToCart])

  // Filtered products
  const filteredProducts = useMemo(() => {
    let filtered = sampleProducts

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Search filter (name, SKU, barcode)
    if (query.trim()) {
      const q = query.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.barcode.includes(q)
      )
    }

    return filtered
  }, [selectedCategory, query])

  // Change quantity
  const changeQty = (id: number, newQty: number) => {
    if (newQty < 1) return
    setCart(cart.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: Math.min(newQty, item.stock) }
      }
      return item
    }))
  }

  // Remove item
  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const discount = useMemo(() => {
    if (discountMode === "amount") {
      return Math.min(discountValue, subtotal)
    } else {
      const percent = Math.max(0, Math.min(100, discountValue))
      return (subtotal * percent) / 100
    }
  }, [discountMode, discountValue, subtotal])

  const deliveryFee = fulfillment === "delivery" ? calculateDeliveryFee(deliveryDistance) : 0

  const taxableBase = subtotal - discount
  const tax = taxEnabled ? (taxableBase * taxRate) / 100 : 0

  const total = subtotal - discount + tax + deliveryFee

  const amountDue = paymentType === "full" ? total : total * 0.5
  const paidAmount = paymentSplit === "single"
    ? Math.max(cashPay, cardPay, onlinePay)
    : cashPay + cardPay + onlinePay
  const balance = amountDue - paidAmount
  const change = paidAmount > amountDue ? paidAmount - amountDue : 0

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen p-4 bg-white md:p-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendora POS</h1>
              <p className="text-gray-600 text-xs mt-0.5">Retail sales and checkout</p>
            </div>
            <div className="flex gap-2">
              <Badge className="text-gray-700 bg-gray-100 border-gray-200 hover:bg-gray-100">
                {currentCashier.name}
              </Badge>
              <Badge className="text-gray-700 bg-gray-100 border-gray-200 hover:bg-gray-100">
                {currentCashier.shift}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => setReceiptOpen(true)}
            >
              <Receipt className="w-4 h-4 mr-2" />
              Receipt
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => setHoldOpen(true)}
            >
              <Save className="w-4 h-4 mr-2" />
              Hold
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 bg-white border-gray-200 hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Returns
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              size="sm"
              className="text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              onClick={() => {
                setCart([])
                setNotes("")
                setDiscountValue(0)
                setCashPay(0)
                setCardPay(0)
                setOnlinePay(0)
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* New Sale Section */}
      <div className="mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="text-gray-900 [&_p]:!text-gray-600">
            <h2 className="text-lg font-semibold text-gray-900">New Sale</h2>
            <p className="text-white/60 text-xs mt-0.5">Transaction {transactionId} • UI demo</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
              <UserIcon className="w-4 h-4 text-gray-400" />
              <select className="text-sm text-gray-900 bg-transparent border-none outline-none">
                {sampleCustomers.map((customer) => (
                  <option key={customer.id || 0} value={customer.id || ""}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                <Package className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Scan barcode or type SKU"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="w-64 h-auto p-0 text-sm text-gray-900 bg-transparent border-none outline-none placeholder:text-gray-400 focus-visible:ring-0"
                />
              </div>
              <Button size="sm" className="text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sale/Returns Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          onClick={() => setActiveTab("sale")}
          className={
            activeTab === "sale"
              ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          }
          variant={activeTab === "sale" ? "default" : "outline"}
        >
          Sale
        </Button>
        <Button
          size="sm"
          onClick={() => setActiveTab("returns")}
          className={
            activeTab === "returns"
              ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          }
          variant={activeTab === "returns" ? "default" : "outline"}
        >
          Returns
        </Button>
      </div>

      {/* Main Content */}
      <div className="space-y-0">
        {activeTab === "sale" ? (
          /* Three Column Layout - Sale View */
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            {/* Products Panel */}
            <div className="space-y-4 xl:col-span-4">
              <div className="p-6 border shadow-sm bg-[#2b1f4a] border-white/10 rounded-2xl">
                <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold text-white">
                  <Package className="w-5 h-5" />
                  Products
                </h2>

                {/* Search */}
                <div className="mb-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-white/40" />
                    <Input
                      placeholder="Search products, SKU, barcode..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-10 text-white bg-white/10 border-white/10 placeholder:text-white/40"
                    />
                  </div>
                  <Input
                    placeholder="Scan or enter barcode"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    className="text-white bg-white/10 border-white/10 placeholder:text-white/40"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="mb-3">
                  <select className="w-full px-3 py-2 text-sm text-white border rounded-lg outline-none bg-white/5 border-white/10">
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Filter Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-xs bg-white/5 text-white/70 border-white/20">
                    Stock enforced
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-white/5 text-white/70 border-white/20">
                    Barcode ready
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-white/5 text-white/70 border-white/20">
                    Pricing per item
                  </Badge>
                </div>

                {/* Product Grid */}
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 transition-colors border bg-white/5 border-white/10 rounded-xl hover:bg-white/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-white">{product.name}</h3>
                          <p className="mt-1 text-xs text-white/60">SKU: {product.sku}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`ml-2 text-xs ${
                            product.stock > 0
                              ? "bg-white/10 text-white/70 border-white/20"
                              : "bg-red-500/20 text-red-200 border-red-400/40"
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock} ${product.unit}` : "Out of stock"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-bold text-white">₱{product.price}</span>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:bg-white/20 disabled:text-white/50"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shopping Cart */}
            <div className="space-y-4 xl:col-span-4">
              <div className="p-6 border shadow-sm bg-[#2b1f4a] border-white/10 rounded-2xl">
                <div className="mb-4">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                    <ShoppingBag className="w-5 h-5" />
                    Cart
                  </h2>
                  <p className="mt-1 text-xs text-white/60">Adjust quantity, remove items, add notes</p>
                </div>

                {/* Cart Items */}
                <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto pr-2">
                  {cart.length === 0 ? (
                    <div className="py-3 text-center border border-dashed text-white/60 border-white/10 rounded-xl bg-white/5">
                      <p>Cart is empty. Add products or scan barcode.</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 border bg-white/5 border-white/10 rounded-xl"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-white">{item.name}</h4>
                            <p className="mt-1 text-xs text-white/60">
                              ₱{item.price} × {item.quantity} = ₱{item.price * item.quantity}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                            className="ml-2 text-red-300 hover:text-red-200 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => changeQty(item.id, item.quantity - 1)}
                            className="text-white bg-white/10 border-white/20 hover:bg-white/20"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => changeQty(item.id, Number(e.target.value))}
                            className="w-20 text-center text-white bg-white/10 border-white/20"
                            min={1}
                            max={item.stock}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => changeQty(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="text-white bg-white/10 border-white/20 hover:bg-white/20"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Badge variant="outline" className="ml-auto text-xs bg-white/10 text-white/70 border-white/20">
                            Max: {item.stock}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Sale Notes */}
                <div className="mt-4">
                  <Label className="block mb-2 text-sm text-white">Sale notes</Label>
                  <Textarea
                    placeholder="Optional notes for this transaction"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="text-white resize-none bg-white/10 border-white/10 placeholder:text-white/40"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Checkout Panel */}
            <div className="space-y-4 xl:col-span-4">
              <div className="p-6 border shadow-sm bg-[#2b1f4a] border-white/10 rounded-2xl">
                <div className="mb-4">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                    <Receipt className="w-5 h-5" />
                    Checkout
                  </h2>
                  <p className="mt-1 text-xs text-white/60">Pickup or delivery • Tax and discounts • Full or partial payment</p>
                </div>

                {/* Fulfillment */}
                <div className="mb-6">
                  <Label className="block mb-3 text-sm text-white">Fulfillment</Label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Button
                      variant={fulfillment === "pickup" ? "default" : "outline"}
                      onClick={() => setFulfillment("pickup")}
                      className={
                        fulfillment === "pickup"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20"
                      }
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Pickup
                    </Button>
                    <Button
                      variant={fulfillment === "delivery" ? "default" : "outline"}
                      onClick={() => setFulfillment("delivery")}
                      className={
                        fulfillment === "delivery"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20"
                      }
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Delivery
                    </Button>
                  </div>
                  {fulfillment === "delivery" && (
                    <div className="space-y-2">
                      <Label className="text-xs text-white/60">Distance (km)</Label>
                      <div className="flex gap-2">
                        {deliveryDistances.map((km) => (
                          <Button
                            key={km}
                            size="sm"
                            variant={deliveryDistance === km ? "default" : "outline"}
                            onClick={() => setDeliveryDistance(km)}
                            className={
                              deliveryDistance === km
                                ? "bg-purple-600 hover:bg-purple-700 text-xs"
                                : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20 text-xs"
                            }
                          >
                            {km}km
                          </Button>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-white/60">
                        Fee: ₱{deliveryFee}
                      </p>
                    </div>
                  )}
                </div>

                {/* Discount */}
                <div className="mb-6">
                  <Label className="block mb-3 text-sm text-white">Discount</Label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Button
                      variant={discountMode === "amount" ? "default" : "outline"}
                      onClick={() => setDiscountMode("amount")}
                      size="sm"
                      className={
                        discountMode === "amount"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20"
                      }
                    >
                      Amount (₱)
                    </Button>
                    <Button
                      variant={discountMode === "percent" ? "default" : "outline"}
                      onClick={() => setDiscountMode("percent")}
                      size="sm"
                      className={
                        discountMode === "percent"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20"
                      }
                    >
                      Percent (%)
                    </Button>
                  </div>
                  <Input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    placeholder={discountMode === "amount" ? "Enter amount" : "Enter percent"}
                    className="text-white bg-white/10 border-white/10 placeholder:text-white/40"
                    min={0}
                    max={discountMode === "percent" ? 100 : subtotal}
                  />
                  <p className="mt-2 text-xs text-white/60">Discount: -₱{discount.toFixed(2)}</p>
                </div>

                {/* Tax */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm text-white">Tax</Label>
                    <Switch
                      checked={taxEnabled}
                      onCheckedChange={setTaxEnabled}
                      className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-white/20"
                    />
                  </div>
                  {taxEnabled && (
                    <div className="space-y-2">
                      <p className="mb-2 text-xs text-white/60">Enable VAT or tax on taxable amount</p>
                      <div className="flex gap-2">
                        <select
                          value={taxRate}
                          onChange={(e) => setTaxRate(Number(e.target.value))}
                          className="flex-1 px-3 py-2 text-sm text-white border rounded-lg outline-none bg-white/10 border-white/10"
                        >
                          {taxRates.map((rate) => (
                            <option key={rate.value} value={rate.value}>
                              {rate.label}
                            </option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-white bg-white/10 border-white/20 hover:bg-white/20"
                        >
                          Rate
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="pt-4 mb-6 space-y-2 border-t border-white/10">
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Subtotal:</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Discount:</span>
                      <span className="text-green-400">-₱{discount.toFixed(2)}</span>
                    </div>
                  )}
                  {taxEnabled && (
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Tax ({taxRate}%):</span>
                      <span>+₱{tax.toFixed(2)}</span>
                    </div>
                  )}
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Delivery Fee:</span>
                      <span>+₱{deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 text-xl font-bold text-white border-t border-white/10">
                    <span>Total:</span>
                    <span>₱{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Type */}
                <div className="mb-6">
                  <Label className="block mb-3 text-sm text-white">Payment Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={paymentType === "full" ? "default" : "outline"}
                      onClick={() => setPaymentType("full")}
                      size="sm"
                      className={
                        paymentType === "full"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20"
                      }
                    >
                      Full Payment
                    </Button>
                    <Button
                      variant={paymentType === "partial" ? "default" : "outline"}
                      onClick={() => setPaymentType("partial")}
                      size="sm"
                      className={
                        paymentType === "partial"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20"
                      }
                    >
                      Partial (50%)
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-white/60">
                    Amount Due: ₱{amountDue.toFixed(2)}
                  </p>
                </div>

                {/* Payment Split */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm text-white">Payment</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/60">Split</span>
                      <Switch
                        checked={paymentSplit === "split"}
                        onCheckedChange={(checked) => setPaymentSplit(checked ? "split" : "single")}
                        className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-white/20"
                      />
                    </div>
                  </div>
                  <p className="mb-3 text-xs text-white/60">Full or partial payment with optional split</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Button
                      variant={paymentType === "full" ? "default" : "outline"}
                      onClick={() => setPaymentType("full")}
                      size="sm"
                      className={
                        paymentType === "full"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20"
                      }
                    >
                      Full
                    </Button>
                    <Button
                      variant={paymentType === "partial" ? "default" : "outline"}
                      onClick={() => setPaymentType("partial")}
                      size="sm"
                      className={
                        paymentType === "partial"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20"
                      }
                    >
                      Partial
                    </Button>
                  </div>

                  {/* Method Dropdown */}
                  <div className="space-y-3">
                    <div>
                      <Label className="block mb-2 text-sm text-white">Method</Label>
                      <select className="w-full px-3 py-2 text-sm text-white border rounded-lg outline-none bg-white/10 border-white/10">
                        {paymentMethods.map((method) => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <Input
                        type="number"
                        value={cashPay}
                        onChange={(e) => setCashPay(Number(e.target.value))}
                        placeholder="0"
                        className="text-right text-white bg-white/10 border-white/10"
                        min={0}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    className="w-full text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    size="lg"
                    disabled={cart.length === 0 || balance > 0}
                    onClick={() => setReceiptOpen(true)}
                  >
                    <Receipt className="w-5 h-5 mr-2" />
                    Complete Sale
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-white bg-white/10 border-white/20 hover:bg-white/20"
                    onClick={() => {
                      setCart([])
                      setNotes("")
                      setDiscountValue(0)
                      setCashPay(0)
                      setCardPay(0)
                      setOnlinePay(0)
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Returns View */
          <div className="min-h-[600px]">
            <div className="p-8 border shadow-sm bg-[#2b1f4a] border-white/10 rounded-2xl">
              <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold text-white">Returns and Refunds</h2>
                <p className="text-sm text-white/60">UI placeholder for MVP next steps</p>
              </div>

              <div className="p-6 mb-6 border bg-white/5 rounded-xl border-white/10">
                <p className="mb-4 text-sm text-white/70">
                  Add search by receipt number, select items, set reason, then process refund.
                </p>

                <div className="flex items-center justify-center py-12">
                  <div className="inline-flex items-center justify-center p-4 border rounded-lg bg-white/10 border-white/20">
                    <X className="w-8 h-8 text-white/40" />
                  </div>
                </div>
              </div>

              <div className="p-4 border bg-purple-500/10 rounded-xl border-purple-400/30">
                <p className="text-xs text-purple-200">
                  This is a front end only. Connect product lookup, inventory validation, payments, and receipt printing to your backend.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hold Sale Modal */}
      <Dialog open={holdOpen} onOpenChange={setHoldOpen}>
        <DialogContent className="bg-[#2b1f4a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Hold Sale</DialogTitle>
            <DialogDescription className="text-white/60">
              This sale has been temporarily saved with reference: <strong className="text-purple-400">{transactionId}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 border rounded-lg bg-white/5 border-white/10">
              <p className="mb-2 text-sm text-white/60">Cart Items: {cart.length}</p>
              <p className="mb-2 text-sm text-white/60">Total: ₱{total.toFixed(2)}</p>
              <p className="mt-3 text-xs text-white/40">
                Note: This is a UI demo. In production, this would save to your backend.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setHoldOpen(false)}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-md text-white bg-[#2b1f4a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Receipt</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="pb-4 text-center border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Vendora POS</h3>
              <p className="mt-1 text-xs text-white/60">Transaction Receipt</p>
              <p className="mt-2 text-xs text-white/40">{transactionId}</p>
              <p className="text-xs text-white/40">{new Date().toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-white/80">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-white">₱{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 space-y-1 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Subtotal:</span>
                <span className="text-white">₱{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Discount:</span>
                  <span className="text-green-400">-₱{discount.toFixed(2)}</span>
                </div>
              )}
              {taxEnabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Tax:</span>
                  <span className="text-white">+₱{tax.toFixed(2)}</span>
                </div>
              )}
              {deliveryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Delivery:</span>
                  <span className="text-white">+₱{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-lg font-bold border-t border-white/10">
                <span className="text-white">Total:</span>
                <span className="text-white">₱{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm">
                <span className="text-white/60">Paid:</span>
                <span className="text-white">₱{paidAmount.toFixed(2)}</span>
              </div>
              {change > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Change:</span>
                  <span className="text-green-400">₱{change.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 text-center border-t border-white/10">
              <p className="text-xs text-white/60">Thank you for your purchase!</p>
              <p className="mt-2 text-xs text-white/40">🤖 Generated with Claude Code</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => alert("Print action (demo). Add print API or window.print with layout.")}
              className="flex-1 text-white bg-white/10 border-white/20 hover:bg-white/20"
            >
              Print
            </Button>
            <Button
              onClick={() => {
                setReceiptOpen(false)
                setCart([])
                setNotes("")
                setDiscountValue(0)
                setCashPay(0)
                setCardPay(0)
                setOnlinePay(0)
              }}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              New Sale
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="text-white bg-[#2b1f4a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">POS Settings</DialogTitle>
            <DialogDescription className="text-white/60">
              Configure your point of sale preferences
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 border rounded-lg border-white/10 bg-white/5">
              <p className="mb-2 text-sm text-white/80">Settings Panel</p>
              <p className="text-xs text-white/60">
                This is a UI placeholder. In production, connect to your backend to manage:
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-xs list-disc text-white/40">
                <li>Store information</li>
                <li>Tax rates and rules</li>
                <li>Payment gateway configuration</li>
                <li>Receipt templates</li>
                <li>User permissions</li>
              </ul>
            </div>
          </div>
          <Button onClick={() => setSettingsOpen(false)} className="bg-purple-600 hover:bg-purple-700">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
