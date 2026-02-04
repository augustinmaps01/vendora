"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import type { PaymentMethods } from "@/types/dashboard"

type PaymentMethodsChartProps = {
  data?: PaymentMethods | null
  className?: string
  contentClassName?: string
}

export function PaymentMethodsChart({ data, className, contentClassName }: PaymentMethodsChartProps) {
  // Transform API data to chart format
  const chartData = data ? data.methods.map(method => ({
    name: method.method.charAt(0).toUpperCase() + method.method.slice(1),
    value: method.percentage,
    color: method.method === "cash" ? "#a78bfa" :
      method.method === "card" ? "#7c3aed" : "#c4b5fd",
  })) : []

  return (
    <Card className={className}>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-semibold">Payment Methods</CardTitle>
        <p className="text-xs text-gray-500 dark:text-gray-400">Distribution</p>
      </CardHeader>
      <CardContent className={`px-4 pb-4 ${contentClassName ?? ""}`.trim()}>
        <div className="flex items-center gap-4">
          {/* Pie Chart */}
          <div className="w-[120px] h-[120px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex-1 grid grid-cols-1 gap-1.5 text-xs">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="font-semibold">{item.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
