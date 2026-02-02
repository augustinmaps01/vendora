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
    Package,
    Eye,
    Store,
    Filter,
    AlertTriangle,
    CheckCircle,
    XCircle,
    TrendingUp
} from "lucide-react"
import Image from "next/image"

// Mock data - Replace with actual API call
const products = [
    {
        id: 1,
        name: "Premium Rice 5kg",
        sku: "GR-1001",
        category: "Grocery",
        vendor: "Food Market",
        price: 1250,
        stock: 18,
        status: "in_stock",
        isActive: true,
        isEcommerce: true,
        imageUrl: "/api/placeholder/60/60",
    },
    {
        id: 2,
        name: "Wireless Bluetooth Headphones",
        sku: "EL-2001",
        category: "Electronics",
        vendor: "Tech Store",
        price: 2999,
        stock: 5,
        status: "low_stock",
        isActive: true,
        isEcommerce: true,
        imageUrl: "/api/placeholder/60/60",
    },
    {
        id: 3,
        name: "Cotton T-Shirt - Black",
        sku: "AP-3001",
        category: "Apparel",
        vendor: "Fashion Hub",
        price: 599,
        stock: 0,
        status: "out_of_stock",
        isActive: false,
        isEcommerce: true,
        imageUrl: "/api/placeholder/60/60",
    },
    {
        id: 4,
        name: "Organic Coffee Beans 1kg",
        sku: "GR-1002",
        category: "Grocery",
        vendor: "Food Market",
        price: 850,
        stock: 42,
        status: "in_stock",
        isActive: true,
        isEcommerce: false,
        imageUrl: "/api/placeholder/60/60",
    },
    {
        id: 5,
        name: "Smart Watch Pro",
        sku: "EL-2002",
        category: "Electronics",
        vendor: "Electronics Plus",
        price: 5499,
        stock: 12,
        status: "in_stock",
        isActive: true,
        isEcommerce: true,
        imageUrl: "/api/placeholder/60/60",
    },
    {
        id: 6,
        name: "Programming Book - JavaScript",
        sku: "BK-4001",
        category: "Books",
        vendor: "Book Shop",
        price: 1200,
        stock: 3,
        status: "low_stock",
        isActive: true,
        isEcommerce: true,
        imageUrl: "/api/placeholder/60/60",
    },
]

const categories = ["All", "Grocery", "Electronics", "Apparel", "Books"]
const vendors = ["All", "Tech Store", "Food Market", "Fashion Hub", "Electronics Plus", "Book Shop"]

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("All")
    const [vendorFilter, setVendorFilter] = useState("All")
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory = categoryFilter === "All" || product.category === categoryFilter
        const matchesVendor = vendorFilter === "All" || product.vendor === vendorFilter
        const matchesStatus = statusFilter === "all" || product.status === statusFilter

        return matchesSearch && matchesCategory && matchesVendor && matchesStatus
    })

    const getStockBadge = (status: string) => {
        switch (status) {
            case "in_stock":
                return (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        In Stock
                    </Badge>
                )
            case "low_stock":
                return (
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Low Stock
                    </Badge>
                )
            case "out_of_stock":
                return (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        <XCircle className="w-3 h-3 mr-1" />
                        Out of Stock
                    </Badge>
                )
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

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Products Overview</h1>
                <p className="text-muted-foreground mt-2">
                    View and manage all products across the platform from all vendors
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{products.length}</div>
                        <p className="text-xs text-muted-foreground">Across all vendors</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {products.filter(p => p.status === "in_stock").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Available products</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {products.filter(p => p.status === "low_stock").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Needs attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {products.filter(p => p.status === "out_of_stock").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Unavailable</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Products</CardTitle>
                            <CardDescription>
                                Browse and manage products from all vendors on the platform
                            </CardDescription>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or SKU..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[150px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                                <SelectValue placeholder="Stock Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="in_stock">In Stock</SelectItem>
                                <SelectItem value="low_stock">Low Stock</SelectItem>
                                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>E-commerce</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                        No products found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                                    <Package className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {product.isActive ? (
                                                            <span className="text-green-600">Active</span>
                                                        ) : (
                                                            <span className="text-red-600">Inactive</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{product.sku}</code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{product.category}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Store className="h-4 w-4 text-muted-foreground" />
                                                {product.vendor}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                                        <TableCell>
                                            <span className={`font-medium ${product.stock === 0 ? "text-red-600" :
                                                    product.stock <= 5 ? "text-yellow-600" : "text-green-600"
                                                }`}>
                                                {product.stock} units
                                            </span>
                                        </TableCell>
                                        <TableCell>{getStockBadge(product.status)}</TableCell>
                                        <TableCell>
                                            {product.isEcommerce ? (
                                                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                                                    <TrendingUp className="w-3 h-3 mr-1" />
                                                    Listed
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">POS Only</Badge>
                                            )}
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
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Store className="mr-2 h-4 w-4" />
                                                        View Vendor
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {product.isActive ? (
                                                        <DropdownMenuItem className="text-orange-600">
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Deactivate
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem className="text-green-600">
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Activate
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
