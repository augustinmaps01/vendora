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

const salesData = [
  { day: "Mon", pos: 18000, online: 22000, total: 40000 },
  { day: "Tue", pos: 19000, online: 21000, total: 40000 },
  { day: "Wed", pos: 15000, online: 17000, total: 32000 },
  { day: "Thu", pos: 17000, online: 19000, total: 36000 },
  { day: "Fri", pos: 20000, online: 23000, total: 43000 },
  { day: "Sat", pos: 26000, online: 28000, total: 54000 },
  { day: "Sun", pos: 18000, online: 20000, total: 38000 },
]

type SalesTrendChartProps = {
  className?: string
  contentClassName?: string
}

export function SalesTrendChart({ className, contentClassName }: SalesTrendChartProps) {
  return (
    <Card className={`col-span-2 flex flex-col ${className ?? ""}`.trim()}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Sales Trend</CardTitle>
        <p className="text-sm text-gray-500">Compare POS and Online sales</p>
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
