"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingCart, Plus } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/**
 * Default Dashboard Layout
 * Uses responsive grid utilities for all screen sizes
 */
export default function DesktopDashboard() {
  const stats = [
    {
      title: "Total Sales",
      value: "\u20B1 128,420",
      change: "+8.4%",
      changeType: "positive" as const,
    },
    {
      title: "Total Orders",
      value: "214",
      change: "+4.1%",
      changeType: "positive" as const,
    },
    {
      title: "Net Revenue",
      value: "\u20B1 96,880",
      change: "After discount",
      changeType: "positive" as const,
    },
    {
      title: "Average Order Value",
      value: "\u20B1 600",
      change: "Stable",
      changeType: "positive" as const,
    },
    {
      title: "Items Sold",
      value: "1,248",
      change: "POS and Online",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Desktop Header */}
      <div className="hidden sm:flex sm:flex-col gap-3 bg-white p-4 sm:p-6 rounded-lg border border-gray-200 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Welcome back</p>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">Bunya Retail Shop</h1>
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
          <Button asChild className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white">
            <Link href="/pos/pos-screen">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Open POS
            </Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto border-gray-300">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Desktop Stats */}
      <DashboardStats stats={stats} />

      {/* Desktop Analytics Section - 3 columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sales Trend Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <SalesTrendChart />
        </div>

        {/* Orders by Channel */}
        <OrdersByChannelChart />
      </div>

      {/* Payment Methods and Top Selling Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PaymentMethodsChart />
        <div className="lg:col-span-2">
          <TopSellingProducts />
        </div>
      </div>

      {/* Operational Insights Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <InventoryHealth />
        <LowStockAlerts />
        <PendingOrders />
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <QuickActions />
      </div>

      {/* Footer Note */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-500">
          Demo UI only. Connect to your API for live data.
        </p>
      </div>
    </div>
  )
}



