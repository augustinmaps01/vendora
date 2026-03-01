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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Reports and Analytics</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-[#b4b4d0] mt-0.5 sm:mt-1">View business performance and insights</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export All Reports
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white dark:bg-[#13132a] p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b4b4d0]">Total Sales</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">₱1,245,670</p>
              <p className="text-[10px] sm:text-xs text-green-600 mt-1 sm:mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="bg-purple-100 p-2 sm:p-3 rounded-lg hidden sm:block">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13132a] p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b4b4d0]">Total Orders</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">1,248</p>
              <p className="text-[10px] sm:text-xs text-green-600 mt-1 sm:mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% from last month
              </p>
            </div>
            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg hidden sm:block">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13132a] p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b4b4d0]">New Customers</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">342</p>
              <p className="text-[10px] sm:text-xs text-green-600 mt-1 sm:mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.3% from last month
              </p>
            </div>
            <div className="bg-green-100 p-2 sm:p-3 rounded-lg hidden sm:block">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13132a] p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b4b4d0]">Avg. Order Value</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">₱998</p>
              <p className="text-[10px] sm:text-xs text-green-600 mt-1 sm:mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3.8% from last month
              </p>
            </div>
            <div className="bg-orange-100 p-2 sm:p-3 rounded-lg hidden sm:block">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {[
          { title: "Sales Report", desc: "View detailed sales analytics, trends, and performance metrics", icon: BarChart3, color: "text-purple-600", primary: true },
          { title: "Inventory Report", desc: "Monitor stock levels, turnover rates, and inventory health", icon: ShoppingCart, color: "text-blue-600", primary: false },
          { title: "Customer Report", desc: "Analyze customer behavior, retention, and lifetime value", icon: Users, color: "text-green-600", primary: false },
          { title: "Product Performance", desc: "Track best sellers, slow movers, and product trends", icon: TrendingUp, color: "text-orange-600", primary: false },
          { title: "Financial Report", desc: "Review revenue, expenses, profit margins, and cash flow", icon: DollarSign, color: "text-purple-600", primary: false },
          { title: "Custom Reports", desc: "Create and manage custom reports tailored to your needs", icon: BarChart3, color: "text-gray-600 dark:text-[#b4b4d0]", primary: false },
        ].map((report, idx) => {
          const Icon = report.icon
          return (
            <div key={idx} className="bg-white dark:bg-[#13132a] p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                <Icon className={`h-5 w-5 ${report.color}`} />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b4b4d0] mb-3 sm:mb-4">{report.desc}</p>
              <Button className={`w-full ${report.primary ? 'bg-purple-600 hover:bg-purple-700' : ''}`} variant={report.primary ? "default" : "outline"}>
                {report.title === "Custom Reports" ? "Create Report" : "View Report"}
              </Button>
            </div>
          )
        })}
      </div>

      {/* Top Selling Products */}
      <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Top Selling Products</h3>
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
                <div className="text-xs text-gray-600 dark:text-[#b4b4d0]">{product.sales} units</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
