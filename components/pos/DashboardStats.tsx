"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

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
        // Determine color based on change type or index if we wanted to vary it, 
        // but for now we'll keep a consistent brand feel or map to specific colors if needed.
        // The original used purple text. We'll use purple bg for the icon box to match the theme.
        const iconColor = "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"

        return (
          <Card key={index} className="border-0 shadow-sm dark:bg-card dark:border-border">
            <CardContent className="py-4 px-6">
              <div className="flex flex-col gap-1">
                {/* Row 1: Icon + Title + Change (Right aligned) */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-[#b4b4d0]">{stat.title}</p>
                  </div>
                  {/* Change indicator moved to top right */}
                  <span
                    className={`text-sm font-bold flex items-center gap-1 ${stat.changeType === "positive"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                      }`}
                  >
                    {stat.changeType === "positive" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {stat.change}
                  </span>
                </div>

                {/* Row 2: Large value + Subtitle */}
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                  {stat.subtitle && (
                    <span className="text-xs text-gray-400 dark:text-muted-foreground">
                      {stat.subtitle}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div >
  )
}
