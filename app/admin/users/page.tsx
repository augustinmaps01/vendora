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
    Users,
    Eye,
    UserCheck,
    UserX,
    Shield,
    Store,
    ShoppingBag,
    Filter,
    Mail
} from "lucide-react"

// Mock data - Replace with actual API call
const users = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        userType: "vendor",
        status: "active",
        registrationDate: "2024-01-15",
        lastActive: "2 hours ago",
        businessName: "Tech Store",
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        userType: "buyer",
        status: "active",
        registrationDate: "2024-02-20",
        lastActive: "1 day ago",
        ordersCount: 15,
    },
    {
        id: 3,
        name: "Mike Johnson",
        email: "mike@example.com",
        userType: "admin",
        status: "active",
        registrationDate: "2024-01-01",
        lastActive: "Online now",
        role: "Super Admin",
    },
    {
        id: 4,
        name: "Sarah Williams",
        email: "sarah@example.com",
        userType: "buyer",
        status: "inactive",
        registrationDate: "2024-03-10",
        lastActive: "2 weeks ago",
        ordersCount: 3,
    },
    {
        id: 5,
        name: "David Brown",
        email: "david@example.com",
        userType: "vendor",
        status: "suspended",
        registrationDate: "2024-02-28",
        lastActive: "3 days ago",
        businessName: "Electronics Plus",
    },
    {
        id: 6,
        name: "Emily Davis",
        email: "emily@example.com",
        userType: "buyer",
        status: "active",
        registrationDate: "2024-04-05",
        lastActive: "5 hours ago",
        ordersCount: 28,
    },
]

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesType = typeFilter === "all" || user.userType === typeFilter
        const matchesStatus = statusFilter === "all" || user.status === statusFilter

        return matchesSearch && matchesType && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
            case "inactive":
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>
            case "suspended":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Suspended</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getUserTypeBadge = (type: string) => {
        switch (type) {
            case "admin":
                return (
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                    </Badge>
                )
            case "vendor":
                return (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        <Store className="w-3 h-3 mr-1" />
                        Vendor
                    </Badge>
                )
            case "buyer":
                return (
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        Buyer
                    </Badge>
                )
            default:
                return <Badge variant="outline">{type}</Badge>
        }
    }

    const getUserTypeIcon = (type: string) => {
        switch (type) {
            case "admin":
                return <Shield className="h-4 w-4 text-purple-600" />
            case "vendor":
                return <Store className="h-4 w-4 text-blue-600" />
            case "buyer":
                return <ShoppingBag className="h-4 w-4 text-orange-600" />
            default:
                return <Users className="h-4 w-4 text-gray-600" />
        }
    }

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
                <p className="text-muted-foreground mt-2">
                    View and manage all platform users including admins, vendors, and buyers
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">+12 from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vendors</CardTitle>
                        <Store className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => u.userType === "vendor").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Active store owners</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Buyers</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => u.userType === "buyer").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Registered customers</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Admins</CardTitle>
                        <Shield className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => u.userType === "admin").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Platform administrators</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Users</CardTitle>
                            <CardDescription>
                                View and manage user accounts across the platform
                            </CardDescription>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[150px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="User Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="admin">Admins</SelectItem>
                                <SelectItem value="vendor">Vendors</SelectItem>
                                <SelectItem value="buyer">Buyers</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Registered</TableHead>
                                <TableHead>Last Active</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold">
                                                    {user.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    {user.userType === "vendor" && 'businessName' in user && (
                                                        <p className="text-xs text-muted-foreground">{user.businessName}</p>
                                                    )}
                                                    {user.userType === "admin" && 'role' in user && (
                                                        <p className="text-xs text-muted-foreground">{user.role}</p>
                                                    )}
                                                    {user.userType === "buyer" && 'ordersCount' in user && (
                                                        <p className="text-xs text-muted-foreground">{user.ordersCount} orders</p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                {user.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getUserTypeBadge(user.userType)}</TableCell>
                                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {user.registrationDate}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <span className={user.lastActive === "Online now" ? "text-green-600 font-medium" : "text-muted-foreground"}>
                                                {user.lastActive}
                                            </span>
                                        </TableCell>
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
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Mail className="mr-2 h-4 w-4" />
                                                        Send Email
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {user.status === "active" ? (
                                                        <DropdownMenuItem className="text-orange-600">
                                                            <UserX className="mr-2 h-4 w-4" />
                                                            Suspend User
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem className="text-green-600">
                                                            <UserCheck className="mr-2 h-4 w-4" />
                                                            Activate User
                                                        </DropdownMenuItem>
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
