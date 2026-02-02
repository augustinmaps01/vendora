"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api-client"
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
  const total = Number(raw?.total ?? raw?.grand_total ?? 0)
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
      setOrderDetails(response)
    } catch (error) {
      console.error("Failed to load order details:", error)
      setOrderDetails(null)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const printInvoice = async (orderId: number) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(response as any)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${orderId}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download invoice:", error)
      alert("Failed to download invoice. Please try again.")
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">View and manage customer orders</p>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load orders: {loadError}
        </div>
      )}

      {isLoading && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          Loading orders...
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{totalOrders}</p>
            </div>
            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
              <ClipboardList className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600">Pending</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-0.5 sm:mt-1">{pendingOrders}</p>
        </div>

        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600">Processing</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-0.5 sm:mt-1">{processingOrders}</p>
        </div>

        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600">Completed</p>
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
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{order.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{order.items} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₱{order.total.toFixed(2)}</div>
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
          <div key={order.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-medium text-gray-900">{order.id}</div>
                <div className="text-sm text-gray-600 mt-0.5">{order.customer}</div>
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
                <span className="text-gray-500">Date:</span>
                <span className="text-gray-900 ml-1">{order.date}</span>
              </div>
              <div>
                <span className="text-gray-500">Items:</span>
                <span className="text-gray-900 ml-1">{order.items}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Total:</span>
                <span className="text-gray-900 font-medium ml-1">₱{order.total.toFixed(2)}</span>
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

      {/* Order Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View complete order information
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading order details...</p>
            </div>
          ) : orderDetails ? (
            <div className="space-y-4">
              {/* Order Header */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-medium">{orderDetails.order_number || `ORD-${orderDetails.id}`}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{orderDetails.ordered_at || orderDetails.created_at}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{orderDetails.customer?.name || orderDetails.customer || "Walk-in"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={
                    orderDetails.status === "completed" ? "bg-green-100 text-green-800" :
                      orderDetails.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        orderDetails.status === "processing" ? "bg-purple-100 text-purple-800" :
                          "bg-red-100 text-red-800"
                  }>
                    {orderDetails.status}
                  </Badge>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Product</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Qty</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Price</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orderDetails.items?.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm">{item.product?.name || item.name || "Product"}</td>
                          <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-right">₱{Number(item.price || 0).toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm text-right font-medium">
                            ₱{(Number(item.quantity) * Number(item.price || 0)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4">
                <div className="space-y-2 max-w-sm ml-auto">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₱{Number(orderDetails.subtotal || orderDetails.total || 0).toFixed(2)}</span>
                  </div>
                  {orderDetails.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span>₱{Number(orderDetails.tax || 0).toFixed(2)}</span>
                    </div>
                  )}
                  {orderDetails.delivery_fee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>₱{Number(orderDetails.delivery_fee || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₱{Number(orderDetails.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              {orderDetails.payment_method && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium capitalize">{orderDetails.payment_method}</p>
                </div>
              )}

              {/* Notes */}
              {orderDetails.notes && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="text-sm">{orderDetails.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button onClick={() => printInvoice(orderDetails.id)} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
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
