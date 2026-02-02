"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package, RefreshCw } from "lucide-react"
import { dashboardService } from "@/services/dashboard.service"
import type { InventoryItem } from "@/types/dashboard"

type LowStockAlertsProps = {
  variant?: "default" | "embedded"
}

export function LowStockAlerts({ variant = "default" }: LowStockAlertsProps) {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isEmbedded = variant === "embedded"
  const headerClass = isEmbedded ? "px-0 pt-0" : undefined
  const contentClass = isEmbedded ? "px-0 pb-0" : undefined

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const data = await dashboardService.getLowStock()
        setItems(data)
      } catch (error) {
        console.error("Failed to fetch low stock alerts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLowStock()
  }, [])

  const content = (
    <>
      <CardHeader className={headerClass}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Low Stock Alerts
            </CardTitle>
            <p className="text-sm text-gray-500">
              {isLoading ? "Checking inventory..." : `${items.length} items need attention`}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className={contentClass}>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No low stock alerts. Inventory is healthy!
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border border-orange-100 bg-orange-50/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Stock: {item.stock} / Min: {item.min_stock}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Restock
                </Button>
              </div>
            ))}
          </div>
        )}
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
