"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "POS", value: 62, color: "#7c3aed" },
  { name: "Online", value: 38, color: "#a78bfa" },
]

type OrdersByChannelChartProps = {
  className?: string
  contentClassName?: string
}

export function OrdersByChannelChart({ className, contentClassName }: OrdersByChannelChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Orders by Channel</CardTitle>
        <p className="text-sm text-gray-500">POS vs Online</p>
      </CardHeader>
      <CardContent className={contentClassName}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 flex justify-around text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
            <span className="text-gray-600">POS</span>
            <span className="font-semibold">62%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
            <span className="text-gray-600">Online</span>
            <span className="font-semibold">38%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
