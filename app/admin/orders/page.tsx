"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/admin/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Search,
    MoreVertical,
    ShoppingCart,
    Eye,
    Store,
    Filter,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    Package,
    DollarSign
} from "lucide-react"

// Mock data - Replace with actual API call
const orders = [
    {
        id: 1,
        orderNumber: "ORD-2024-001",
        customer: "John Dela Cruz",
        vendor: "Tech Store",
        orderedAt: "2024-01-15 10:30",
        itemsCount: 3,
        total: 5999,
        status: "pending",
        paymentStatus: "paid",
    },
    {
        id: 2,
        orderNumber: "ORD-2024-002",
        customer: "Maria Santos",
        vendor: "Fashion Hub",
        orderedAt: "2024-01-15 11:45",
        itemsCount: 5,
        total: 2450,
        status: "processing",
        paymentStatus: "paid",
    },
    {
        id: 3,
        orderNumber: "ORD-2024-003",
        customer: "Pedro Garcia",
        vendor: "Food Market",
        orderedAt: "2024-01-15 14:20",
        itemsCount: 8,
        total: 1850,
        status: "shipped",
        paymentStatus: "paid",
    },
    {
        id: 4,
        orderNumber: "ORD-2024-004",
        customer: "Ana Reyes",
        vendor: "Electronics Plus",
        orderedAt: "2024-01-14 09:15",
        itemsCount: 1,
        total: 12999,
        status: "delivered",
        paymentStatus: "paid",
    },
    {
        id: 5,
        orderNumber: "ORD-2024-005",
        customer: "Jose Cruz",
        vendor: "Book Shop",
        orderedAt: "2024-01-14 16:00",
        itemsCount: 2,
        total: 1599,
        status: "cancelled",
        paymentStatus: "refunded",
    },
    {
        id: 6,
        orderNumber: "ORD-2024-006",
        customer: "Rosa Mendoza",
        vendor: "Tech Store",
        orderedAt: "2024-01-13 13:30",
        itemsCount: 4,
        total: 8750,
        status: "delivered",
        paymentStatus: "paid",
    },
]

const vendors = ["All", "Tech Store", "Food Market", "Fashion Hub", "Electronics Plus", "Book Shop"]

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [vendorFilter, setVendorFilter] = useState("All")
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesVendor = vendorFilter === "All" || order.vendor === vendorFilter
        const matchesStatus = statusFilter === "all" || order.status === statusFilter

        return matchesSearch && matchesVendor && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </Badge>
                )
            case "processing":
                return (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        <Package className="w-3 h-3 mr-1" />
                        Processing
                    </Badge>
                )
            case "shipped":
                return (
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                        <Truck className="w-3 h-3 mr-1" />
                        Shipped
                    </Badge>
                )
            case "delivered":
                return (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Delivered
                    </Badge>
                )
            case "cancelled":
                return (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        <XCircle className="w-3 h-3 mr-1" />
                        Cancelled
                    </Badge>
                )
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getPaymentBadge = (status: string) => {
        switch (status) {
            case "paid":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
            case "refunded":
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Refunded</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(price)
    }

    const totalRevenue = orders
        .filter(o => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + o.total, 0)

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Orders Overview</h1>
                <p className="text-muted-foreground mt-2">
                    View and manage all orders across the platform from all vendors
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-5 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders.length}</div>
                        <p className="text-xs text-muted-foreground">All time orders</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">From paid orders</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {orders.filter(o => o.status === "pending").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Awaiting action</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                        <Truck className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {orders.filter(o => o.status === "shipped").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Being delivered</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {orders.filter(o => o.status === "delivered").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Completed orders</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Orders</CardTitle>
                            <CardDescription>
                                Browse and manage orders from all vendors on the platform
                            </CardDescription>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by order number or customer..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={vendorFilter} onValueChange={setVendorFilter}>
                            <SelectTrigger className="w-[180px]">
                                <Store className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Vendor" />
                            </SelectTrigger>
                            <SelectContent>
                                {vendors.map((vendor) => (
                                    <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                        No orders found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                                {order.orderNumber}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold">
                                                    {order.customer.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span>{order.customer}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Store className="h-4 w-4 text-muted-foreground" />
                                                {order.vendor}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {order.orderedAt}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{order.itemsCount} items</Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{formatPrice(order.total)}</TableCell>
                                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                                        <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Store className="mr-2 h-4 w-4" />
                                                        View Vendor
                                                    </DropdownMenuItem>
                                                    {order.status === "pending" && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Cancel Order
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}
