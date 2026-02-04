"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { SalesTrend } from "@/types/dashboard"

type SalesTrendChartProps = {
  data?: SalesTrend | null
  className?: string
  contentClassName?: string
}

export function SalesTrendChart({ data, className, contentClassName }: SalesTrendChartProps) {
  // Transform API data to chart format
  const salesData = data ? data.labels.map((label, index) => {
    const posData = data.series.find(s => s.name === "pos")?.data[index] || 0
    const onlineData = data.series.find(s => s.name === "online")?.data[index] || 0

    // Convert date to day of week
    const date = new Date(label)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })

    return {
      day: dayName,
      pos: posData,
      online: onlineData,
      total: posData + onlineData,
    }
  }) : []

  return (
    <Card className={`col-span-2 flex flex-col ${className ?? ""}`.trim()}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Sales Trend</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">Compare POS and Online sales</p>
      </CardHeader>
      <CardContent className={`flex-1 ${contentClassName ?? ""}`.trim()}>
        <div className="min-h-[260px] h-[260px] sm:h-[300px] lg:h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="online"
                stroke="#a78bfa"
                strokeWidth={2}
                dot={{ fill: "#a78bfa", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="pos"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={{ fill: "#7c3aed", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#e0e0e0"
                strokeWidth={1}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
