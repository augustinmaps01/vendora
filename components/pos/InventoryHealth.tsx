"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { InventoryHealth as InventoryHealthData } from "@/types/dashboard"

type InventoryHealthProps = {
  data?: InventoryHealthData | null
  variant?: "default" | "embedded"
}

export function InventoryHealth({ data, variant = "default" }: InventoryHealthProps) {
  const isEmbedded = variant === "embedded"
  const headerClass = isEmbedded ? "px-0 pt-0" : undefined
  const contentClass = isEmbedded ? "px-0 pb-0" : undefined

  // Transform API data to percentage format
  const inventoryData = data ? data.breakdown.map(item => {
    const percentage = (item.count / data.total_items) * 100
    const label = item.status === "in_stock" ? "In Stock" :
                  item.status === "low_stock" ? "Low Stock" : "Out of Stock"
    return {
      label,
      value: Math.round(percentage),
    }
  }) : []

  const content = (
    <>
      <CardHeader className={headerClass}>
        <CardTitle className="text-lg font-semibold">Inventory Health</CardTitle>
        <p className="text-sm text-gray-500 dark:text-[#b4b4d0]">Stock status</p>
      </CardHeader>
      <CardContent className={`space - y - 6 ${ contentClass ?? "" } `.trim()}>
        {inventoryData.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 dark:text-[#e0e0f0] font-medium">{item.label}</span>
              <span className="font-semibold dark:text-white">{item.value}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-[#1a1a35] rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${ item.value }% ` }}
              ></div>
            </div>
          </div>
        ))}
      </CardContent>
    </>
  )

  if (isEmbedded) {
    return <div>{content}</div>
  }

  return (
    <Card>
      {content}
    </Card>
  )
}
