"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ClipboardList,
  Eye,
  Printer,
  Filter
} from "lucide-react"

// Default layout component
function DesktopOrdersLayout() {
  const [searchQuery, setSearchQuery] = useState("")

  const orders = [
    { id: "ORD-001", customer: "John Dela Cruz", date: "2026-01-10", total: 2450, status: "completed", items: 5 },
    { id: "ORD-002", customer: "Maria Santos", date: "2026-01-10", total: 1850, status: "pending", items: 3 },
    { id: "ORD-003", customer: "Pedro Reyes", date: "2026-01-09", total: 3200, status: "processing", items: 7 },
    { id: "ORD-004", customer: "Anna Garcia", date: "2026-01-09", total: 950, status: "completed", items: 2 },
    { id: "ORD-005", customer: "Walk-in Customer", date: "2026-01-08", total: 450, status: "cancelled", items: 1 },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <ClipboardList className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">View and manage customer orders</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">248</p>
            </div>
            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
              <ClipboardList className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600">Pending</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-0.5 sm:mt-1">12</p>
        </div>

        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600">Processing</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-0.5 sm:mt-1">8</p>
        </div>

        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600">Completed</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">228</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Orders Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{order.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{order.items} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₱{order.total.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.status === "completed" && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                    )}
                    {order.status === "pending" && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                    )}
                    {order.status === "processing" && (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Processing</Badge>
                    )}
                    {order.status === "cancelled" && (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-medium text-gray-900">{order.id}</div>
                <div className="text-sm text-gray-600 mt-0.5">{order.customer}</div>
              </div>
              <div>
                {order.status === "completed" && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">Completed</Badge>
                )}
                {order.status === "pending" && (
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">Pending</Badge>
                )}
                {order.status === "processing" && (
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs">Processing</Badge>
                )}
                {order.status === "cancelled" && (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">Cancelled</Badge>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-500">Date:</span>
                <span className="text-gray-900 ml-1">{order.date}</span>
              </div>
              <div>
                <span className="text-gray-500">Items:</span>
                <span className="text-gray-900 ml-1">{order.items}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Total:</span>
                <span className="text-gray-900 font-medium ml-1">₱{order.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OrdersPage() {
  return <DesktopOrdersLayout />
}
