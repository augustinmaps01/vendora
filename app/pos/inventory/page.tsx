"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  PackageOpen,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from "lucide-react"

// Default layout component
function DesktopInventoryLayout() {
  const [searchQuery, setSearchQuery] = useState("")

  const inventoryItems = [
    { id: 1, name: "Premium Rice 5kg", sku: "GR-1001", current: 18, min: 10, max: 50, status: "ok" },
    { id: 2, name: "Cooking Oil 1L", sku: "GR-1002", current: 45, min: 20, max: 100, status: "ok" },
    { id: 3, name: "White Sugar 1kg", sku: "GR-1004", current: 5, min: 15, max: 60, status: "low" },
    { id: 4, name: "Mineral Water 1L", sku: "BV-2001", current: 80, min: 50, max: 150, status: "ok" },
    { id: 5, name: "Cola 1.5L", sku: "BV-2002", current: 2, min: 20, max: 80, status: "critical" },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">Track stock levels and manage inventory</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
          <PackageOpen className="w-4 h-4 mr-2" />
          Stock Adjustment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Items</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">156</p>
            </div>
            <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
              <PackageOpen className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Low Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-0.5 sm:mt-1">8</p>
            </div>
            <div className="bg-yellow-100 p-2 sm:p-3 rounded-lg">
              <TrendingDown className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm col-span-2 sm:col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Out of Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600 mt-0.5 sm:mt-1">3</p>
            </div>
            <div className="bg-red-100 p-2 sm:p-3 rounded-lg">
              <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Inventory Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min/Max
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{item.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{item.current} units</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{item.min} / {item.max}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.status === "ok" && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
                    )}
                    {item.status === "low" && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low Stock</Badge>
                    )}
                    {item.status === "critical" && (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {inventoryItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku}</p>
              </div>
              <div>
                {item.status === "ok" && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">In Stock</Badge>
                )}
                {item.status === "low" && (
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">Low Stock</Badge>
                )}
                {item.status === "critical" && (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">Critical</Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Current Stock</p>
                <p className="text-lg font-bold text-gray-900">{item.current}</p>
                <p className="text-xs text-gray-500">units</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Min / Max</p>
                <p className="text-sm font-semibold text-gray-900">{item.min} / {item.max}</p>
                <p className="text-xs text-gray-500">units</p>
              </div>
            </div>

            {item.status === "low" || item.status === "critical" ? (
              <div className={`mt-3 p-2 rounded-lg flex items-center gap-2 ${
                item.status === "critical" ? "bg-red-50" : "bg-yellow-50"
              }`}>
                <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${
                  item.status === "critical" ? "text-red-600" : "text-yellow-600"
                }`} />
                <p className={`text-xs ${
                  item.status === "critical" ? "text-red-700" : "text-yellow-700"
                }`}>
                  {item.status === "critical"
                    ? `Only ${item.current} units left! Restock urgently.`
                    : `Stock running low. Consider restocking soon.`
                  }
                </p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function InventoryPage() {
  return <DesktopInventoryLayout />
}
