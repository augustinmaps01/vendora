"use client"

import { Button } from "@/components/ui/button"
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

export default function POSDashboard() {
  // Sample stats data
  const stats = [
    {
      title: "Total Sales",
      value: "₱ 128,420",
      change: "+8.4% vs previous",
      changeType: "positive" as const,
    },
    {
      title: "Total Orders",
      value: "214",
      change: "+4.1% vs previous",
      changeType: "positive" as const,
    },
    {
      title: "Net Revenue",
      value: "₱ 96,880",
      change: "After discount",
      changeType: "positive" as const,
      subtitle: "After discount",
    },
    {
      title: "Average Order Value",
      value: "₱ 600",
      change: "Stable",
      changeType: "positive" as const,
      subtitle: "Stable",
    },
    {
      title: "Items Sold",
      value: "1,248",
      change: "POS and Online",
      changeType: "positive" as const,
      subtitle: "POS and Online",
    },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200">
        <div>
          <p className="text-sm text-gray-500">Welcome back</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Bunya Retail Shop</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="7days">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gray-900 hover:bg-gray-800 text-white">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Open POS
          </Button>
          <Button variant="outline" className="border-gray-300">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Analytics & Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart - Takes 2 columns */}
        <SalesTrendChart />

        {/* Orders by Channel */}
        <OrdersByChannelChart />
      </div>

      {/* Payment Methods and Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PaymentMethodsChart />
        <div className="lg:col-span-2">
          <TopSellingProducts />
        </div>
      </div>

      {/* Operational Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Health */}
        <InventoryHealth />

        {/* Low Stock Alerts */}
        <LowStockAlerts />

        {/* Pending Orders */}
        <PendingOrders />
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
