"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import type { PaymentMethods } from "@/types/dashboard"

type PaymentMethodsChartProps = {
  data?: PaymentMethods | null
  className?: string
  contentClassName?: string
}
import { Wallet, CreditCard, Banknote } from "lucide-react"

export function PaymentMethodsChart({ data, className, contentClassName }: PaymentMethodsChartProps) {
  // Safely grab method percentages or default to 0
  const getMethodPct = (methodName: string) => {
    return data?.methods.find(m => m.method === methodName)?.percentage || 0;
  }

  // Hardcoded to ensure these three providers always show up on the chart
  const chartData = [
    {
      name: "Cash",
      value: getMethodPct("cash"),
      color: "#10b981", // Emerald
      icon: Banknote,
    },
    {
      name: "Card",
      value: getMethodPct("card"),
      color: "#6366f1", // Indigo
      icon: CreditCard,
    },
    {
      name: "E-wallet",
      value: getMethodPct("online"), // Assuming 'online' equates to E-wallet in our stats
      color: "#f59e0b", // Amber
      icon: Wallet,
    }
  ]

  return (
    <Card className={`rounded-xl border border-gray-100 dark:border-white/5 shadow-sm ${className ?? ""}`}>
      <CardHeader className="pb-4 pt-5 px-5 flex flex-row items-center justify-between border-b border-gray-100 dark:border-white/5">
        <div>
          <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Payment Methods</CardTitle>
          <p className="text-xs text-gray-500 mt-1 dark:text-[#b4b4d0]">Revenue split by channel</p>
        </div>
      </CardHeader>
      <CardContent className={`p-4 ${contentClassName ?? ""}`.trim()}>
        <div className="flex flex-col items-center gap-4 h-full justify-center">
          {/* Donut Chart */}
          <div className="w-[170px] h-[170px] relative shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                3
              </span>
              <span className="text-[10px] uppercase text-gray-400 font-medium tracking-wider mt-1">Providers</span>
            </div>
          </div>

          {/* Enhanced Legend */}
          <div className="w-full sm:w-10/12 flex flex-col gap-1.5 min-w-[150px]">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-gray-50 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md`} style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-[#e0e0f0]">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white">{item.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
