"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Package as PackageIcon, ShoppingCart, Box } from "lucide-react"

const activities = [
  {
    icon: ShoppingCart,
    title: "POS sale completed. INV-22018 created.",
    time: "5 min ago",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: Box,
    title: "Stock adjusted for Cooking Oil 1L.",
    time: "18 min ago",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: FileText,
    title: "Online order ORD-10494 received.",
    time: "28 min ago",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: PackageIcon,
    title: "New product added: PVC Pipe 1 inch.",
    time: "1 hr ago",
    color: "text-orange-600 bg-orange-50",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <p className="text-sm text-gray-500">Live updates</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${activity.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
