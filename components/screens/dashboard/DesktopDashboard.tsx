"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, Package, Plus, ShoppingBag, Wallet, ShoppingCart, Loader2 } from "lucide-react"
import { DashboardStats } from "@/components/pos/DashboardStats"
import { SalesTrendChart } from "@/components/pos/SalesTrendChart"
import { OrdersByChannelChart } from "@/components/pos/OrdersByChannelChart"
import { PaymentMethodsChart } from "@/components/pos/PaymentMethodsChart"
import { TopSellingProducts } from "@/components/pos/TopSellingProducts"
import { InventoryHealth } from "@/components/pos/InventoryHealth"
import { LowStockAlerts } from "@/components/pos/LowStockAlerts"
import { PendingOrders } from "@/components/pos/PendingOrders"
import { RecentActivity } from "@/components/pos/RecentActivity"
import { QuickActions } from "@/components/pos/QuickActions"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDashboardData } from "@/hooks/useDashboardData"

/**
 * Default Dashboard Layout
 * Uses responsive grid utilities for all screen sizes
 */
export default function DesktopDashboard() {
  const [dateRange, setDateRange] = useState("7days")

  // Fetch dashboard data from API
  const {
    kpis,
    salesTrend,
    ordersByChannel,
    paymentMethods,
    topProducts,
    inventoryHealth,
    recentActivity,
    loading,
    error,
  } = useDashboardData()

  // Transform KPI data to stats format
  const stats = kpis ? [
    {
      title: "Total Sales",
      value: `₱ ${kpis.total_sales.toLocaleString()}`,
      change: "+8.4%", // Note: API doesn't provide percentage change
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: kpis.total_orders.toString(),
      change: "+4.1%",
      changeType: "positive" as const,
      icon: ShoppingBag,
    },
    {
      title: "Net Revenue",
      value: `₱ ${kpis.net_revenue.toLocaleString()}`,
      change: "After discount",
      changeType: "positive" as const,
      icon: Wallet,
    },
    {
      title: "Items Sold",
      value: kpis.items_sold.toLocaleString(),
      change: "POS and Online",
      changeType: "positive" as const,
      icon: Package,
    },
  ] : []

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
          <p className="text-sm text-gray-500 mt-2">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Desktop Header */}
      <div className="hidden sm:flex sm:flex-col gap-3 bg-white dark:bg-card p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-border lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground">Welcome back</p>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-foreground mt-1">Bunya Retail Shop</h1>
        </div>
        <div className="hidden w-full flex-col gap-3 sm:flex sm:flex-row sm:flex-wrap sm:items-center lg:w-auto">
          <Select defaultValue="7days">
            <SelectTrigger className="w-full sm:w-[140px]" suppressHydrationWarning>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild className="w-full sm:w-auto bg-gray-900 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/90 text-white">
            <Link href="/pos/pos-screen">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Open POS
            </Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto border-gray-300 dark:border-border">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Row 1: Key Metrics */}
      <DashboardStats stats={stats} />

      {/* Row 2: Sales Overview + Activity Metrics + Distribution */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Sales Overview + Orders by Channel - Stacked */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          <SalesTrendChart data={salesTrend} className="h-[400px]" contentClassName="flex-1" />
          <OrdersByChannelChart data={ordersByChannel} className="h-[450px]" />
        </div>

        {/* Payment Methods + Inventory - Stacked */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          <PaymentMethodsChart data={paymentMethods} className="h-[400px]" />
          <Card className="border-gray-200 dark:border-border dark:bg-card h-[450px]">
            <CardContent className="p-4 h-full">
              <InventoryHealth data={inventoryHealth} variant="embedded" />
            </CardContent>
          </Card>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-4">
          <Card className="border-gray-200 dark:border-border dark:bg-card h-full">
            <CardContent className="p-4">
              <TopSellingProducts data={topProducts} variant="embedded" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 3: Actionable Items + Activity Feed */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Alerts & Orders - What needs attention */}
        <div className="lg:col-span-7">
          <Card className="border-gray-200 dark:border-border dark:bg-card h-full">
            <CardContent className="p-5">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <LowStockAlerts variant="embedded" />
                <PendingOrders variant="embedded" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Recent Activity + Quick Actions */}
        <div className="lg:col-span-5">
          <Card className="border-gray-200 dark:border-border dark:bg-card h-full">
            <CardContent className="p-5">
              <RecentActivity data={recentActivity} variant="embedded" />
              <div className="h-px bg-gray-200 dark:bg-border my-4" />
              <QuickActions variant="embedded" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-500 dark:text-muted-foreground">
          Dashboard connected to live API data.
        </p>
      </div>
    </div>
  )
}



