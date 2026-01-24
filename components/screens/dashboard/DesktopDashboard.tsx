"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, Package, Plus, ShoppingBag, Wallet, ShoppingCart } from "lucide-react"
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
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: "214",
      change: "+4.1%",
      changeType: "positive" as const,
      icon: ShoppingBag,
    },
    {
      title: "Net Revenue",
      value: "\u20B1 96,880",
      change: "After discount",
      changeType: "positive" as const,
      icon: Wallet,
    },
    {
      title: "Items Sold",
      value: "1,248",
      change: "POS and Online",
      changeType: "positive" as const,
      icon: Package,
    },
  ]

  return (
    <div className="space-y-4 pb-6">
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

      {/* Second Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:items-stretch">
        <div className="lg:col-span-2 lg:h-[420px]">
          <SalesTrendChart className="h-full" contentClassName="flex-1" />
        </div>
        <div className="space-y-4 lg:col-span-2 lg:h-[420px] lg:flex lg:flex-col lg:space-y-4">
          <div className="lg:flex-1">
            <OrdersByChannelChart className="h-full" />
          </div>
          <div className="lg:flex-1">
            <PaymentMethodsChart className="h-full" />
          </div>
        </div>
      </div>

      {/* Third Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
        <div className="lg:col-span-2 lg:h-[520px]">
          <Card className="border-gray-200 h-full">
            <CardContent className="p-5 space-y-4">
              <TopSellingProducts variant="embedded" />
              <div className="h-px bg-gray-200" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <InventoryHealth variant="embedded" />
                <LowStockAlerts variant="embedded" />
                <PendingOrders variant="embedded" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:h-[520px]">
          <Card className="border-gray-200 h-full">
            <CardContent className="p-5 space-y-4">
              <RecentActivity variant="embedded" />
              <div className="h-px bg-gray-200" />
              <QuickActions variant="embedded" />
            </CardContent>
          </Card>
        </div>
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



