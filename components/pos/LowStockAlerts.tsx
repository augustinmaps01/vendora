"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package } from "lucide-react"

const lowStockItems = [
  {
    name: "PVC Pipe 1 inch",
    location: "On hand 8, reorder at 20",
  },
  {
    name: "Egg Tray",
    location: "On hand 6, reorder at 12",
  },
  {
    name: "Instant Noodles Box",
    location: "On hand 3, reorder at 12",
  },
  {
    name: "Screwdriver Set",
    location: "On hand 4, reorder at 10",
  },
]

type LowStockAlertsProps = {
  variant?: "default" | "embedded"
}

export function LowStockAlerts({ variant = "default" }: LowStockAlertsProps) {
  const isEmbedded = variant === "embedded"
  const headerClass = isEmbedded ? "px-0 pt-0" : undefined
  const contentClass = isEmbedded ? "px-0 pb-0" : undefined

  const content = (
    <>
      <CardHeader className={headerClass}>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Low Stock Alerts
        </CardTitle>
        <p className="text-sm text-gray-500">Needs attention</p>
      </CardHeader>
      <CardContent className={contentClass}>
        <div className="space-y-3">
          {lowStockItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-orange-100 bg-orange-50/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.location}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                Adjust
              </Button>
            </div>
          ))}
        </div>
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
