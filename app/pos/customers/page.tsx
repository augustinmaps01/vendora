"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Users,
  Mail,
  Phone,
  Edit,
  Eye
} from "lucide-react"

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const customers = [
    { id: 1, name: "John Dela Cruz", email: "john.delacruz@email.com", phone: "+63 912 345 6789", orders: 15, total: 15420, status: "active" },
    { id: 2, name: "Maria Santos", email: "maria.santos@email.com", phone: "+63 923 456 7890", orders: 8, total: 8750, status: "active" },
    { id: 3, name: "Pedro Reyes", email: "pedro.reyes@email.com", phone: "+63 934 567 8901", orders: 22, total: 22300, status: "vip" },
    { id: 4, name: "Anna Garcia", email: "anna.garcia@email.com", phone: "+63 945 678 9012", orders: 12, total: 12150, status: "active" },
    { id: 5, name: "Carlos Mendoza", email: "carlos.m@email.com", phone: "+63 956 789 0123", orders: 3, total: 2100, status: "inactive" },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Customers</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">Manage your customer relationships</p>
          </div>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-0.5 sm:mt-1">342</p>
            </div>
            <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
              <Users className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">298</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">VIP</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-0.5 sm:mt-1">24</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Inactive</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">20</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Table - Desktop */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:bg-gray-900">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">{customer.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-3 w-3 mr-1" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-3 w-3 mr-1" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{customer.orders} orders</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">₱{customer.total.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.status === "active" && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                    )}
                    {customer.status === "vip" && (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">VIP</Badge>
                    )}
                    {customer.status === "inactive" && (
                      <Badge className="bg-gray-100 text-gray-800 dark:text-gray-200 hover:bg-gray-100">Inactive</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customers Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">{customer.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {customer.orders} orders • ₱{customer.total.toLocaleString()}
                  </div>
                </div>
              </div>
              <div>
                {customer.status === "active" && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">Active</Badge>
                )}
                {customer.status === "vip" && (
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs">VIP</Badge>
                )}
                {customer.status === "inactive" && (
                  <Badge className="bg-gray-100 text-gray-800 dark:text-gray-200 hover:bg-gray-100 text-xs">Inactive</Badge>
                )}
              </div>
            </div>
            <div className="space-y-1 text-sm mb-3">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                <span>{customer.phone}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
