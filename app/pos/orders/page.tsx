"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api-client"
import { orderService } from "@/services"
import { posOrderEndpoints } from "./api-endpoints"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  ClipboardList,
  Eye,
  Printer,
  Filter,
  X,
  Download,
} from "lucide-react"

type OrderRow = {
  id: string
  customer: string
  date: string
  total: number
  status: "completed" | "pending" | "processing" | "cancelled"
  items: number
}

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: string }).message || "Request failed")
  }
  return "Request failed"
}

const normalizeStatus = (status?: string): OrderRow["status"] => {
  if (!status) return "pending"
  if (status === "completed" || status === "pending" || status === "processing" || status === "cancelled") {
    return status
  }
  if (status === "delivered") return "completed"
  if (status === "confirmed" || status === "shipped") return "processing"
  if (status === "refunded") return "cancelled"
  return "pending"
}

const formatDate = (value?: string | number | Date) => {
  if (!value) return "—"
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toISOString().slice(0, 10)
}

const normalizeOrder = (raw: any): OrderRow => {
  const id = raw?.orderNumber || raw?.order_number || raw?.id || raw?.uuid || "—"
  const customer =
    raw?.customer?.name ||
    raw?.customer_name ||
    raw?.customer?.email ||
    raw?.customer ||
    "Walk-in Customer"
  const items = Array.isArray(raw?.items)
    ? raw.items.length
    : Number(raw?.items_count || raw?.item_count || 0)
  // Convert from centavos to pesos (divide by 100)
  const total = Number(raw?.total ?? raw?.grand_total ?? 0) / 100
  const status = normalizeStatus(raw?.status)
  const date = formatDate(raw?.createdAt ?? raw?.created_at ?? raw?.date)

  return {
    id: String(id),
    customer: String(customer),
    date,
    total,
    status,
    items,
  }
}

/**
 * Normalize order details response - convert centavos to pesos
 */
const normalizeOrderDetails = (raw: any): any => {
  if (!raw) return null

  return {
    ...raw,
    total: Number(raw?.total ?? 0) / 100,
    subtotal: Number(raw?.subtotal ?? 0) / 100,
    tax: Number(raw?.tax ?? 0) / 100,
    delivery_fee: Number(raw?.delivery_fee ?? 0) / 100,
    discount: Number(raw?.discount ?? 0) / 100,
    items: Array.isArray(raw?.items)
      ? raw.items.map((item: any) => ({
          ...item,
          price: Number(item?.price ?? 0) / 100,
          total: Number(item?.total ?? 0) / 100,
        }))
      : [],
  }
}

// Default layout component
function DesktopOrdersLayout() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage] = useState(15)
  const [totalRecords, setTotalRecords] = useState(0)

  // Date filter
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  // Order summary from API
  const [orderSummary, setOrderSummary] = useState<any>(null)

  const loadOrders = async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const params: any = {
        page: currentPage,
        per_page: perPage,
      }
      if (statusFilter !== "all") {
        params.status = statusFilter
      }
      if (startDate) {
        params.start_date = startDate
      }
      if (endDate) {
        params.end_date = endDate
      }

      const response = await api.get(posOrderEndpoints.list(), { params })
      const items = Array.isArray((response as any)?.data)
        ? (response as any).data
        : Array.isArray((response as any)?.items)
          ? (response as any).items
          : Array.isArray(response as any)
            ? (response as any)
            : []
      setOrders(items.map((item: any) => normalizeOrder(item)))

      // Extract pagination meta
      if ((response as any)?.meta?.total) {
        setTotalRecords((response as any).meta.total)
      }
    } catch (error) {
      setLoadError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const loadOrderSummary = async () => {
    try {
      const response = await api.get('/api/orders/summary')
      setOrderSummary(response)
    } catch (error) {
      // Silently fail if endpoint doesn't exist yet
      // Stats will be calculated client-side instead
    }
  }

  const loadOrderDetails = async (orderId: number) => {
    setIsLoadingDetails(true)
    setSelectedOrderId(orderId)
    setIsDetailsModalOpen(true)
    try {
      const response = await api.get(posOrderEndpoints.get(orderId))
      setOrderDetails(normalizeOrderDetails(response))
    } catch (error) {
      console.error("Failed to load order details:", error)
      setOrderDetails(null)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const printInvoice = async (orderId: number) => {
    try {
      // Load order details and open modal
      await loadOrderDetails(orderId)
      // Wait for modal to render, then trigger print
      setTimeout(() => {
        window.print()
      }, 500)
    } catch (error: any) {
      console.error("Failed to load invoice:", error)
      alert("Failed to load invoice. Please try again.")
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.patch(posOrderEndpoints.patch(orderId), { status: newStatus })
      await loadOrderDetails(orderId)
      await loadOrders()
      await loadOrderSummary()
      alert(`Order status updated to ${newStatus}`)
    } catch (error) {
      console.error("Failed to update status:", error)
      alert("Failed to update order status. Please try again.")
    }
  }

  const cancelOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return
    try {
      await api.post(`/api/orders/${orderId}/cancel`)
      await loadOrderDetails(orderId)
      await loadOrders()
      await loadOrderSummary()
      alert("Order cancelled successfully")
    } catch (error) {
      console.error("Failed to cancel order:", error)
      alert("Failed to cancel order. Please try again.")
    }
  }

  const refundOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to refund this order?")) return
    try {
      await api.post(`/api/orders/${orderId}/refund`)
      await loadOrderDetails(orderId)
      await loadOrders()
      await loadOrderSummary()
      alert("Order refunded successfully")
    } catch (error) {
      console.error("Failed to refund order:", error)
      alert("Failed to refund order. Please try again.")
    }
  }

  useEffect(() => {
    loadOrders()
    loadOrderSummary()
  }, [statusFilter, currentPage, startDate, endDate])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders()
      loadOrderSummary()
    }, 30000)
    return () => clearInterval(interval)
  }, [currentPage, statusFilter, startDate, endDate])

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return orders
    return orders.filter((order) =>
      order.id.toLowerCase().includes(q) ||
      order.customer.toLowerCase().includes(q) ||
      order.date.toLowerCase().includes(q)
    )
  }, [orders, searchQuery])

  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const processingOrders = orders.filter((order) => order.status === "processing").length
  const completedOrders = orders.filter((order) => order.status === "completed").length

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <ClipboardList className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Orders</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">View and manage customer orders</p>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          Failed to load orders: {loadError}
        </div>
      )}

      {isLoading && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
          Loading orders...
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-0.5 sm:mt-1">{totalOrders}</p>
            </div>
            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
              <ClipboardList className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-0.5 sm:mt-1">{pendingOrders}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Processing</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-0.5 sm:mt-1">{processingOrders}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Completed</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">{completedOrders}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table - Desktop */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:bg-gray-900">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{order.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{order.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{order.items} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">₱{order.total.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.status === "completed" && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                    )}
                    {order.status === "pending" && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                    )}
                    {order.status === "processing" && (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Processing</Badge>
                    )}
                    {order.status === "cancelled" && (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => loadOrderDetails(Number(order.id.replace(/\D/g, '') || 0))}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => printInvoice(Number(order.id.replace(/\D/g, '') || 0))}>
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.id}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{order.customer}</div>
              </div>
              <div>
                {order.status === "completed" && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">Completed</Badge>
                )}
                {order.status === "pending" && (
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">Pending</Badge>
                )}
                {order.status === "processing" && (
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs">Processing</Badge>
                )}
                {order.status === "cancelled" && (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">Cancelled</Badge>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Date:</span>
                <span className="text-gray-900 dark:text-gray-100 ml-1">{order.date}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Items:</span>
                <span className="text-gray-900 dark:text-gray-100 ml-1">{order.items}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400">Total:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium ml-1">₱{order.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => loadOrderDetails(Number(order.id.replace(/\D/g, '') || 0))}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => printInvoice(Number(order.id.replace(/\D/g, '') || 0))}>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal - Professional Invoice Design */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-transparent border-0 p-0">
          <DialogTitle className="sr-only">Invoice</DialogTitle>

          {isLoadingDetails ? (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-2xl">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
              <p className="text-gray-600 dark:text-gray-400 mt-3">Loading invoice...</p>
            </div>
          ) : orderDetails ? (
            <>
              {/* Modal View - Professional Invoice */}
              <div className="rounded-3xl bg-gradient-to-br from-[#2d1f5e] via-[#3a2570] to-[#2d1f5e] border border-white/10 overflow-hidden shadow-2xl">
                {/* Invoice Header */}
                <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-white">INVOICE</h1>
                      <p className="text-purple-100 mt-1">Vendora POS System</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                        <p className="text-xs text-purple-100">Invoice No.</p>
                        <p className="text-lg font-bold text-white">{orderDetails.order_number || `INV-${orderDetails.id}`}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="px-8 py-6 space-y-6">
                  {/* Billed To & Invoice Info */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Billed To</p>
                        <p className="text-lg font-semibold text-white">{orderDetails.customer?.name || orderDetails.customer || "Walk-in Customer"}</p>
                        {orderDetails.customer?.email && (
                          <p className="text-sm text-white/60 mt-1">{orderDetails.customer.email}</p>
                        )}
                        {orderDetails.customer?.phone && (
                          <p className="text-sm text-white/60">{orderDetails.customer.phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3 text-right">
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Invoice Date</p>
                        <p className="text-white font-medium">{orderDetails.ordered_at || orderDetails.created_at}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Status</p>
                        <Badge className={
                          orderDetails.status === "completed" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                            orderDetails.status === "pending" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" :
                              orderDetails.status === "processing" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                                "bg-red-500/20 text-red-300 border-red-500/30"
                        }>
                          {orderDetails.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Item Description</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-white/70 uppercase tracking-wider">Qty</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-white/70 uppercase tracking-wider">Unit Price</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-white/70 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails.items?.map((item: any, idx: number) => (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-sm text-white">{item.product?.name || item.name || "Product"}</td>
                            <td className="px-4 py-3 text-sm text-white/80 text-center">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-white/80 text-right">₱{Number(item.price || 0).toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-white font-medium text-right">
                              ₱{(Number(item.quantity) * Number(item.price || 0)).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Section */}
                  <div className="flex justify-end">
                    <div className="w-80 space-y-3">
                      <div className="flex justify-between text-sm py-2 border-b border-white/10">
                        <span className="text-white/60">Subtotal</span>
                        <span className="text-white font-medium">₱{Number(orderDetails.subtotal || orderDetails.total || 0).toFixed(2)}</span>
                      </div>
                      {orderDetails.tax > 0 && (
                        <div className="flex justify-between text-sm py-2 border-b border-white/10">
                          <span className="text-white/60">Tax (12%)</span>
                          <span className="text-white font-medium">₱{Number(orderDetails.tax || 0).toFixed(2)}</span>
                        </div>
                      )}
                      {orderDetails.delivery_fee > 0 && (
                        <div className="flex justify-between text-sm py-2 border-b border-white/10">
                          <span className="text-white/60">Delivery Fee</span>
                          <span className="text-white font-medium">₱{Number(orderDetails.delivery_fee || 0).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center bg-purple-500/20 rounded-lg px-4 py-3 border border-purple-500/30">
                        <span className="text-white font-semibold text-lg">Total Amount</span>
                        <span className="text-emerald-400 font-bold text-2xl">₱{Number(orderDetails.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Notes */}
                  {(orderDetails.payment_method || orderDetails.notes) && (
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {orderDetails.payment_method && (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Payment Method</p>
                          <p className="text-white font-medium capitalize">{orderDetails.payment_method}</p>
                        </div>
                      )}
                      {orderDetails.notes && (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Notes</p>
                          <p className="text-white/80 text-sm">{orderDetails.notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer Message */}
                  <div className="text-center pt-6 border-t border-white/10">
                    <p className="text-white/40 text-sm">Thank you for your business!</p>
                    <p className="text-white/30 text-xs mt-1">This invoice was generated by Vendora POS System</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-8 py-6 bg-black/20 border-t border-white/10 flex gap-3">
                  <Button
                    onClick={() => window.print()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-6 text-base font-semibold"
                  >
                    <Printer className="h-5 w-5 mr-2" />
                    Print Invoice
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/20 py-6 px-8"
                  >
                    Close
                  </Button>
                </div>
              </div>

              {/* Printable Invoice (Hidden, for printing only) */}
              <div id="printable-invoice" className="hidden print:block">
                <div style={{ width: '210mm', minHeight: '297mm', padding: '20mm', fontFamily: 'Arial, sans-serif', background: 'white', color: 'black' }}>
                  {/* Print Header */}
                  <div style={{ borderBottom: '3px solid #7c3aed', paddingBottom: '20px', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#7c3aed', margin: 0 }}>INVOICE</h1>
                        <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>Vendora POS System</p>
                      </div>
                      <div style={{ textAlign: 'right', background: '#f3f4f6', padding: '15px', borderRadius: '8px' }}>
                        <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Invoice No.</p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>{orderDetails.order_number || `INV-${orderDetails.id}`}</p>
                      </div>
                    </div>
                  </div>

                  {/* Print Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '30px' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Billed To</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{orderDetails.customer?.name || orderDetails.customer || "Walk-in Customer"}</p>
                      {orderDetails.customer?.email && <p style={{ fontSize: '13px', color: '#666', margin: '5px 0' }}>{orderDetails.customer.email}</p>}
                      {orderDetails.customer?.phone && <p style={{ fontSize: '13px', color: '#666', margin: '5px 0' }}>{orderDetails.customer.phone}</p>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ marginBottom: '15px' }}>
                        <p style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '5px' }}>Invoice Date</p>
                        <p style={{ fontSize: '14px', fontWeight: '500' }}>{orderDetails.ordered_at || orderDetails.created_at}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '5px' }}>Status</p>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: orderDetails.status === "completed" ? '#d1fae5' : orderDetails.status === "pending" ? '#fef3c7' : '#dbeafe',
                          color: orderDetails.status === "completed" ? '#065f46' : orderDetails.status === "pending" ? '#92400e' : '#1e40af'
                        }}>
                          {orderDetails.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Print Items Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>Item Description</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>Qty</th>
                        <th style={{ padding: '12px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>Unit Price</th>
                        <th style={{ padding: '12px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.items?.map((item: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px', fontSize: '13px' }}>{item.product?.name || item.name || "Product"}</td>
                          <td style={{ padding: '12px', fontSize: '13px', textAlign: 'center' }}>{item.quantity}</td>
                          <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>₱{Number(item.price || 0).toFixed(2)}</td>
                          <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right', fontWeight: '500' }}>₱{(Number(item.quantity) * Number(item.price || 0)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Print Totals */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
                    <div style={{ width: '300px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ fontSize: '13px', color: '#666' }}>Subtotal</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>₱{Number(orderDetails.subtotal || orderDetails.total || 0).toFixed(2)}</span>
                      </div>
                      {orderDetails.tax > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{ fontSize: '13px', color: '#666' }}>Tax (12%)</span>
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>₱{Number(orderDetails.tax || 0).toFixed(2)}</span>
                        </div>
                      )}
                      {orderDetails.delivery_fee > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{ fontSize: '13px', color: '#666' }}>Delivery Fee</span>
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>₱{Number(orderDetails.delivery_fee || 0).toFixed(2)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#f9fafb', borderRadius: '8px', marginTop: '10px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '600' }}>Total Amount</span>
                        <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#7c3aed' }}>₱{Number(orderDetails.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Print Footer */}
                  {(orderDetails.payment_method || orderDetails.notes) && (
                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                      {orderDetails.payment_method && (
                        <div style={{ marginBottom: '15px' }}>
                          <p style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '5px' }}>Payment Method</p>
                          <p style={{ fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }}>{orderDetails.payment_method}</p>
                        </div>
                      )}
                      {orderDetails.notes && (
                        <div>
                          <p style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '5px' }}>Notes</p>
                          <p style={{ fontSize: '13px', color: '#333' }}>{orderDetails.notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                    <p style={{ fontSize: '13px', color: '#999' }}>Thank you for your business!</p>
                    <p style={{ fontSize: '11px', color: '#ccc', marginTop: '5px' }}>This invoice was generated by Vendora POS System</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-2xl">
              <p className="text-red-600">Failed to load order details</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function OrdersPage() {
  return <DesktopOrdersLayout />
}
