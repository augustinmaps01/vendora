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
import { Search, MoreVertical, Store, Eye, CheckCircle, XCircle, Clock, Filter, Plus } from "lucide-react"
import Link from "next/link"

// Mock data - Replace with actual API call
// Structure matches the API response from POST /api/admin/vendors
const vendors = [
  {
    id: 1,
    name: "John Doe",
    email: "john@techstore.com",
    user_type: "vendor",
    vendor_profile: {
      id: 1,
      business_name: "Tech Store",
      subscription_plan: "premium",
    },
    phone: "+1 234-567-8900",
    subscriptionStatus: "active",
    registrationDate: "2024-01-15",
    lastActive: "2 hours ago",
    totalRevenue: "$45,230",
    productsCount: 245,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@fashionhub.com",
    user_type: "vendor",
    vendor_profile: {
      id: 2,
      business_name: "Fashion Hub",
      subscription_plan: "basic",
    },
    phone: "+1 234-567-8901",
    subscriptionStatus: "active",
    registrationDate: "2024-02-20",
    lastActive: "1 day ago",
    totalRevenue: "$32,450",
    productsCount: 189,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@foodmarket.com",
    user_type: "vendor",
    vendor_profile: {
      id: 3,
      business_name: "Food Market",
      subscription_plan: "premium",
    },
    phone: "+1 234-567-8902",
    subscriptionStatus: "trial",
    registrationDate: "2024-03-10",
    lastActive: "3 hours ago",
    totalRevenue: "$12,890",
    productsCount: 78,
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@bookshop.com",
    user_type: "vendor",
    vendor_profile: {
      id: 4,
      business_name: "Book Shop",
      subscription_plan: "free",
    },
    phone: "+1 234-567-8903",
    subscriptionStatus: "expired",
    registrationDate: "2024-01-05",
    lastActive: "2 weeks ago",
    totalRevenue: "$8,450",
    productsCount: 156,
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@electronicsplus.com",
    user_type: "vendor",
    vendor_profile: {
      id: 5,
      business_name: "Electronics Plus",
      subscription_plan: "premium",
    },
    phone: "+1 234-567-8904",
    subscriptionStatus: "active",
    registrationDate: "2024-02-28",
    lastActive: "5 hours ago",
    totalRevenue: "$67,890",
    productsCount: 312,
  },
]

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.vendor_profile.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || vendor.subscriptionStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "trial":
        return <Badge className="bg-blue-500">Trial</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "premium":
        return <Badge className="bg-purple-600 hover:bg-purple-600">Premium</Badge>
      case "basic":
        return <Badge className="bg-blue-600 hover:bg-blue-600">Basic</Badge>
      case "free":
        return <Badge variant="outline">Free</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{plan}</Badge>
    }
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendors Management</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage all vendor accounts and their subscriptions
          </p>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/admin/vendors/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendors.filter(v => v.subscriptionStatus === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Paying customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Accounts</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendors.filter(v => v.subscriptionStatus === "trial").length}
            </div>
            <p className="text-xs text-muted-foreground">In trial period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendors.filter(v => v.subscriptionStatus === "expired").length}
            </div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Vendors</CardTitle>
              <CardDescription>
                View and manage vendor accounts, subscriptions, and business operations
              </CardDescription>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by business name, owner, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No vendors found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                          {vendor.vendor_profile.business_name.substring(0, 2).toUpperCase()}
                        </div>
                        {vendor.vendor_profile.business_name}
                      </div>
                    </TableCell>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{vendor.email}</div>
                        <div className="text-muted-foreground">{vendor.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getPlanBadge(vendor.vendor_profile.subscription_plan)}</TableCell>
                    <TableCell>{getStatusBadge(vendor.subscriptionStatus)}</TableCell>
                    <TableCell className="font-medium">{vendor.totalRevenue}</TableCell>
                    <TableCell>{vendor.productsCount}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {vendor.lastActive}
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
                          <DropdownMenuItem>Edit Subscription</DropdownMenuItem>
                          <DropdownMenuItem>Contact Vendor</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Suspend Account
                          </DropdownMenuItem>
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
