"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Banknote, CreditCard } from "lucide-react"
import type { PaymentMethods } from "@/types/dashboard"

type Props = {
  data?: PaymentMethods | null
  className?: string
}

export function CashVsCreditChart({ data, className }: Props) {
  const getMethod = (name: string) =>
    data?.methods.find(m => m.method === name)

  const cashMethod   = getMethod("cash")
  const creditMethod = getMethod("credit")

  const cashAmount   = cashMethod?.amount   ?? 0
  const creditAmount = creditMethod?.amount ?? 0
  const total        = cashAmount + creditAmount

  const cashPct   = total > 0 ? (cashAmount / total) * 100   : 0
  const creditPct = total > 0 ? (creditAmount / total) * 100 : 0

  // Always show both slices; use a thin placeholder slice when one is 0
  const chartData = [
    { name: "Cash",   value: cashAmount   || (total === 0 ? 1 : 0), color: "#10b981" },
    { name: "Credit", value: creditAmount || (total === 0 ? 1 : 0), color: "#f43f5e" },
  ]

  const legend = [
    {
      label:  "Cash",
      icon:   Banknote,
      pct:    cashPct,
      amount: cashAmount,
      count:  cashMethod?.payments_count ?? 0,
      color:  "#10b981",
    },
    {
      label:  "Credit",
      icon:   CreditCard,
      pct:    creditPct,
      amount: creditAmount,
      count:  creditMethod?.payments_count ?? 0,
      color:  "#f43f5e",
    },
  ]

  return (
    <Card className={`rounded-xl border border-gray-100 dark:border-white/5 shadow-sm ${className ?? ""}`}>
      <CardHeader className="pb-3 pt-5 px-5 border-b border-gray-100 dark:border-white/5">
        <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
          Cash vs. Credit
        </CardTitle>
        <p className="text-xs text-gray-500 dark:text-[#b4b4d0] mt-0.5">
          Payment collection split
        </p>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-4">

          {/* Donut chart */}
          <div className="w-[140px] h-[140px] relative shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={65}
                  paddingAngle={total > 0 ? 3 : 0}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={total === 0 ? 0.2 : 1} />
                  ))}
                </Pie>
                {total > 0 && (
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `₱ ${value.toLocaleString()}`,
                      name,
                    ]}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] uppercase text-gray-400 dark:text-[#b4b4d0] font-medium tracking-wider">
                Total
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                {total > 0 ? `₱${(total / 1000).toFixed(1)}k` : "—"}
              </span>
            </div>
          </div>

          {/* 2-column legend */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {legend.map(item => (
              <div key={item.label} className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <item.icon className="w-3.5 h-3.5 shrink-0" style={{ color: item.color }} />
                  <span className="text-xs font-medium text-gray-600 dark:text-[#b4b4d0]">
                    {item.label}
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {item.pct.toFixed(1)}%
                </span>
                <span className="text-[11px] text-gray-500 dark:text-[#b4b4d0]">
                  ₱ {item.amount.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-[#9898b8]">
                  {item.count} {item.count === 1 ? "txn" : "txns"}
                </span>
              </div>
            ))}
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
