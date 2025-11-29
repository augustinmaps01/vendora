"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  Clock
} from "lucide-react"
import { formatPHP } from "@/lib/currency"

export default function POSDashboard() {
  // Sample data - replace with actual data from your API
  const stats = [
    {
      title: "Today's Sales",
      value: formatPHP(15420),
      icon: DollarSign,
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Transactions",
      value: "45",
      icon: ShoppingCart,
      change: "+8.2%",
      changeType: "positive" as const,
    },
    {
      title: "Products Sold",
      value: "128",
      icon: Package,
      change: "+5.1%",
      changeType: "positive" as const,
    },
    {
      title: "Customers",
      value: "32",
      icon: Users,
      change: "+3.4%",
      changeType: "positive" as const,
    },
  ]

  const recentTransactions = [
    { id: "TXN-001", customer: "John Doe", amount: 1250, time: "10:30 AM" },
    { id: "TXN-002", customer: "Jane Smith", amount: 2340, time: "10:45 AM" },
    { id: "TXN-003", customer: "Bob Johnson", amount: 890, time: "11:15 AM" },
    { id: "TXN-004", customer: "Alice Brown", amount: 3420, time: "11:30 AM" },
    { id: "TXN-005", customer: "Charlie Wilson", amount: 1680, time: "12:00 PM" },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">Dashboard</h1>
          <p className="text-emerald-700 mt-1">
            Welcome back! Here's your sales overview
          </p>
        </div>
        <Button size="lg" className="sm:w-auto w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-md">
          <ShoppingCart className="mr-2 h-5 w-5" />
          New Sale
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700">
                  {stat.title}
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-900">{stat.value}</div>
                <p className="text-xs text-emerald-600 mt-1">
                  <span
                    className={
                      stat.changeType === "positive"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {stat.change}
                  </span>{" "}
                  from yesterday
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-900">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-emerald-100 rounded-lg hover:bg-emerald-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-900">{transaction.customer}</p>
                    <p className="text-sm text-emerald-600">
                      {transaction.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-900">
                    {formatPHP(transaction.amount)}
                  </p>
                  <p className="text-sm text-emerald-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {transaction.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700">
              <ShoppingCart className="h-6 w-6 mb-2" />
              New Sale
            </Button>
            <Button variant="outline" className="h-20 flex-col border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700">
              <Package className="h-6 w-6 mb-2" />
              Add Product
            </Button>
            <Button variant="outline" className="h-20 flex-col border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700">
              <Users className="h-6 w-6 mb-2" />
              Add Customer
            </Button>
            <Button variant="outline" className="h-20 flex-col border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700">
              <TrendingUp className="h-6 w-6 mb-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
