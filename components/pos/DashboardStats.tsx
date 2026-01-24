"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCard {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  subtitle?: string
  icon: LucideIcon
}

interface DashboardStatsProps {
  stats: StatCard[]
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-xs font-medium ${
                          stat.changeType === "positive"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      {stat.subtitle && (
                        <span className="text-xs text-gray-500">
                          {stat.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
