"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Clock } from "lucide-react"

const pendingOrders = [
  {
    id: "ORD-10492",
    customer: "Mark S.",
    items: "Delivery • Preparing • Partial",
    amount: "₱ 1,850",
  },
  {
    id: "ORD-10493",
    customer: "Lisa R.",
    items: "Pickup • Ready • Paid",
    amount: "₱ 820",
  },
  {
    id: "ORD-10494",
    customer: "Ana C.",
    items: "Delivery • Pending • Awaiting",
    amount: "₱ 2,560",
  },
]

type PendingOrdersProps = {
  variant?: "default" | "embedded"
}

export function PendingOrders({ variant = "default" }: PendingOrdersProps) {
  const isEmbedded = variant === "embedded"
  const headerClass = isEmbedded ? "px-0 pt-0" : undefined
  const contentClass = isEmbedded ? "px-0 pb-0" : undefined

  const content = (
    <>
      <CardHeader className={headerClass}>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Pending Orders
        </CardTitle>
        <p className="text-sm text-gray-500">Fulfillment queue</p>
      </CardHeader>
      <CardContent className={contentClass}>
        <div className="space-y-3">
          {pendingOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 border border-blue-100 bg-blue-50/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{order.id}</p>
                  <p className="text-xs text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.items}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-sm mb-1">
                  {order.amount}
                </p>
                <Button size="sm" variant="default" className="text-xs bg-blue-600 hover:bg-blue-700">
                  View
                </Button>
              </div>
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
