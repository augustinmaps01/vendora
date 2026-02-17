"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Package, Truck } from "lucide-react"

const actions = [
  {
    icon: ShoppingCart,
    label: "Start a new POS sale",
    color: "text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/40",
  },
  {
    icon: Plus,
    label: "Add a new product",
    color: "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40",
  },
  {
    icon: Package,
    label: "Adjust stock levels",
    color: "text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/40",
  },
  {
    icon: Truck,
    label: "Fulfill online orders",
    color: "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/40",
  },
]

type QuickActionsProps = {
  variant?: "default" | "embedded"
}

export function QuickActions({ variant = "default" }: QuickActionsProps) {
  const isEmbedded = variant === "embedded"
  const headerClass = isEmbedded ? "px-0 pt-0" : undefined
  const contentClass = isEmbedded ? "px-0 pb-0" : undefined

  const content = (
    <>
      <CardHeader className={headerClass}>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        <p className="text-sm text-gray-500 dark:text-[#b4b4d0]">Common tasks</p>
      </CardHeader>
      <CardContent className={contentClass}>
        <div className="space-y-2">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="ghost"
                className={`w-full justify-start gap-3 h-12 ${action.color}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium dark:text-[#e0e0f0]">{action.label}</span>
              </Button>
            )
          })}
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
