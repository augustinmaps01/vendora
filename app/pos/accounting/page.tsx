"use client"

import { Button } from "@/components/ui/button"
import {
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Download
} from "lucide-react"

export default function AccountingPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Accounting</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-[#b4b4d0] mt-0.5 sm:mt-1">Manage finances, expenses, and accounting records</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export Financial Report
        </Button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white dark:bg-[#13132a] p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b4b4d0]">Total Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">₱1,245,670</p>
              <p className="text-[10px] sm:text-xs text-green-600 mt-1 sm:mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 rounded-lg hidden sm:block">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13132a] p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b4b4d0]">Total Expenses</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">₱345,200</p>
              <p className="text-[10px] sm:text-xs text-red-600 mt-1 sm:mt-2 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                +5.2% from last month
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-2 sm:p-3 rounded-lg hidden sm:block">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13132a] p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b4b4d0]">Net Profit</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">₱900,470</p>
              <p className="text-[10px] sm:text-xs text-green-600 mt-1 sm:mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.8% from last month
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 sm:p-3 rounded-lg hidden sm:block">
              <Calculator className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13132a] p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b4b4d0]">Profit Margin</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">72.3%</p>
              <p className="text-[10px] sm:text-xs text-green-600 mt-1 sm:mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.1% from last month
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 rounded-lg hidden sm:block">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white dark:bg-[#13132a] p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Invoices</h3>
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b4b4d0] mb-3 sm:mb-4">Create and manage customer invoices</p>
          <div className="space-y-2 mb-3 sm:mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-[#b4b4d0]">Pending</span>
              <span className="font-semibold text-yellow-600">8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-[#b4b4d0]">Paid</span>
              <span className="font-semibold text-green-600">142</span>
            </div>
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700">Create Invoice</Button>
        </div>

        <div className="bg-white dark:bg-[#13132a] p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Expenses</h3>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b4b4d0] mb-3 sm:mb-4">Track and categorize business expenses</p>
          <div className="space-y-2 mb-3 sm:mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-[#b4b4d0]">This Month</span>
              <span className="font-semibold dark:text-[#e0e0f0]">₱345,200</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-[#b4b4d0]">Uncategorized</span>
              <span className="font-semibold text-yellow-600">5</span>
            </div>
          </div>
          <Button className="w-full" variant="outline">Add Expense</Button>
        </div>

        <div className="bg-white dark:bg-[#13132a] p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Tax Records</h3>
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b4b4d0] mb-3 sm:mb-4">Manage tax compliance and records</p>
          <div className="space-y-2 mb-3 sm:mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-[#b4b4d0]">Tax Collected</span>
              <span className="font-semibold dark:text-[#e0e0f0]">₱149,480</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-[#b4b4d0]">Next Filing</span>
              <span className="font-semibold text-orange-600">15 days</span>
            </div>
          </div>
          <Button className="w-full" variant="outline">View Tax</Button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {[
            { type: "income", description: "Sales Revenue", date: "2026-01-10", amount: 12450, category: "Revenue" },
            { type: "expense", description: "Supplier Payment", date: "2026-01-09", amount: -8500, category: "Cost of Goods" },
            { type: "income", description: "Online Orders", date: "2026-01-09", amount: 5680, category: "Revenue" },
            { type: "expense", description: "Rent Payment", date: "2026-01-08", amount: -15000, category: "Operating Expenses" },
            { type: "expense", description: "Utilities Bill", date: "2026-01-08", amount: -3200, category: "Operating Expenses" },
          ].map((transaction, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-[#13132a] rounded-lg">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`flex-shrink-0 p-1.5 sm:p-2 rounded-lg ${transaction.type === "income" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                  }`}>
                  {transaction.type === "income" ? (
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.description}</div>
                  <div className="text-xs text-gray-600 dark:text-[#b4b4d0] mt-0.5 sm:mt-1">
                    {transaction.date} <span className="hidden sm:inline">• {transaction.category}</span>
                  </div>
                </div>
              </div>
              <div className={`text-sm font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"
                }`}>
                {transaction.amount > 0 ? "+" : ""}₱{Math.abs(transaction.amount).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
