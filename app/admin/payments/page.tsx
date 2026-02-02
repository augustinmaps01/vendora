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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Search,
    CreditCard,
    DollarSign,
    TrendingUp,
    CheckCircle,
    Clock,
    XCircle,
    Filter
} from "lucide-react"

// Mock data for payments
const payments = [
    {
        id: 1,
        transactionId: "TXN-2024-001",
        vendor: "Tech Store",
        type: "subscription",
        plan: "Premium",
        amount: 2999,
        status: "completed",
        date: "2024-01-15 10:30",
        method: "card",
    },
    {
        id: 2,
        transactionId: "TXN-2024-002",
        vendor: "Fashion Hub",
        type: "subscription",
        plan: "Basic",
        amount: 999,
        status: "completed",
        date: "2024-01-14 14:20",
        method: "card",
    },
    {
        id: 3,
        transactionId: "TXN-2024-003",
        vendor: "Food Market",
        type: "subscription",
        plan: "Premium",
        amount: 2999,
        status: "pending",
        date: "2024-01-15 16:00",
        method: "bank_transfer",
    },
    {
        id: 4,
        transactionId: "TXN-2024-004",
        vendor: "Electronics Plus",
        type: "subscription",
        plan: "Basic",
        amount: 999,
        status: "completed",
        date: "2024-01-13 09:15",
        method: "card",
    },
    {
        id: 5,
        transactionId: "TXN-2024-005",
        vendor: "Book Shop",
        type: "subscription",
        plan: "Free",
        amount: 0,
        status: "completed",
        date: "2024-01-12 11:45",
        method: "free",
    },
]

const paymentStats = {
    totalRevenue: 8995,
    completedPayments: 4,
    pendingPayments: 1,
    monthlyGrowth: 15.2,
}

export default function PaymentsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.vendor.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || payment.status === statusFilter
        const matchesType = typeFilter === "all" || payment.type === typeFilter

        return matchesSearch && matchesStatus && matchesType
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                    </Badge>
                )
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </Badge>
                )
            case "failed":
                return (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        <XCircle className="w-3 h-3 mr-1" />
                        Failed
                    </Badge>
                )
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getPlanBadge = (plan: string) => {
        switch (plan) {
            case "Premium":
                return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Premium</Badge>
            case "Basic":
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Basic</Badge>
            case "Free":
                return <Badge variant="outline">Free</Badge>
            default:
                return <Badge variant="secondary">{plan}</Badge>
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(value)
    }

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                <p className="text-muted-foreground mt-2">
                    Manage subscription payments and transaction history
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(paymentStats.totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{paymentStats.completedPayments}</div>
                        <p className="text-xs text-muted-foreground">Successful payments</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{paymentStats.pendingPayments}</div>
                        <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Growth</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">+{paymentStats.monthlyGrowth}%</div>
                        <p className="text-xs text-muted-foreground">vs last month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-purple-600" />
                                Transaction History
                            </CardTitle>
                            <CardDescription>
                                View and manage all subscription payments
                            </CardDescription>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by transaction ID or vendor..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPayments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No payments found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium">
                                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                {payment.transactionId}
                                            </code>
                                        </TableCell>
                                        <TableCell>{payment.vendor}</TableCell>
                                        <TableCell>{getPlanBadge(payment.plan)}</TableCell>
                                        <TableCell className="font-medium">
                                            {payment.amount > 0 ? formatCurrency(payment.amount) : "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {payment.method.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {payment.date}
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
