"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Download
} from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports and Analytics</h1>
          <p className="text-gray-600 dark:text-[#b4b4d0] mt-1">View business performance and insights</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export All Reports
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#13132a] p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₱1,245,670</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13132a] p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,248</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% from last month
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13132a] p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">New Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">342</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.3% from last month
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13132a] p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₱998</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3.8% from last month
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales Report */}
        <div className="bg-white dark:bg-[#13132a] p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Report</h3>
            <BarChart3 className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 dark:text-[#b4b4d0] mb-4">View detailed sales analytics, trends, and performance metrics</p>
          <Button className="w-full bg-purple-600 hover:bg-purple-700">View Report</Button>
        </div>

        {/* Inventory Report */}
        <div className="bg-white dark:bg-[#13132a] p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inventory Report</h3>
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 dark:text-[#b4b4d0] mb-4">Monitor stock levels, turnover rates, and inventory health</p>
          <Button className="w-full" variant="outline">View Report</Button>
        </div>

        {/* Customer Report */}
        <div className="bg-white dark:bg-[#13132a] p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Report</h3>
            <Users className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 dark:text-[#b4b4d0] mb-4">Analyze customer behavior, retention, and lifetime value</p>
          <Button className="w-full" variant="outline">View Report</Button>
        </div>

        {/* Product Performance */}
        <div className="bg-white dark:bg-[#13132a] p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Performance</h3>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-sm text-gray-600 dark:text-[#b4b4d0] mb-4">Track best sellers, slow movers, and product trends</p>
          <Button className="w-full" variant="outline">View Report</Button>
        </div>

        {/* Financial Report */}
        <div className="bg-white dark:bg-[#13132a] p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Report</h3>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 dark:text-[#b4b4d0] mb-4">Review revenue, expenses, profit margins, and cash flow</p>
          <Button className="w-full" variant="outline">View Report</Button>
        </div>

        {/* Custom Reports */}
        <div className="bg-white dark:bg-[#13132a] p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Custom Reports</h3>
            <BarChart3 className="h-5 w-5 text-gray-600 dark:text-[#b4b4d0]" />
          </div>
          <p className="text-sm text-gray-600 dark:text-[#b4b4d0] mb-4">Create and manage custom reports tailored to your needs</p>
          <Button className="w-full" variant="outline">Create Report</Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Selling Products</h3>
        <div className="space-y-3">
          {[
            { name: "Premium Rice 5kg", sales: 145, revenue: 181250 },
            { name: "Cooking Oil 1L", sales: 128, revenue: 23680 },
            { name: "Mineral Water 1L", sales: 412, revenue: 8240 },
            { name: "Cola 1.5L", sales: 96, revenue: 6240 },
          ].map((product, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1a1a35] rounded-lg">
              <div className="flex items-center gap-3">
                <Badge className="bg-purple-100 text-purple-800">{idx + 1}</Badge>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">₱{product.revenue.toLocaleString()}</div>
                <div className="text-xs text-gray-600 dark:text-[#b4b4d0]">{product.sales} units sold</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
