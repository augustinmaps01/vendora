"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const inventoryData = [
  { label: "In Stock", value: 78 },
  { label: "Low Stock", value: 16 },
  { label: "Out of Stock", value: 6 },
]

type InventoryHealthProps = {
  variant?: "default" | "embedded"
}

export function InventoryHealth({ variant = "default" }: InventoryHealthProps) {
  const isEmbedded = variant === "embedded"
  const headerClass = isEmbedded ? "px-0 pt-0" : undefined
  const contentClass = isEmbedded ? "px-0 pb-0" : undefined

  const content = (
    <>
      <CardHeader className={headerClass}>
        <CardTitle className="text-lg font-semibold">Inventory Health</CardTitle>
        <p className="text-sm text-gray-500">Stock status</p>
      </CardHeader>
      <CardContent className={`space-y-6 ${contentClass ?? ""}`}>
        {inventoryData.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 font-medium">{item.label}</span>
              <span className="font-semibold">{item.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${item.value}%` }}
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
