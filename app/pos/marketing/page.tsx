"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Megaphone,
  Mail,
  MessageSquare,
  Tag,
  Users,
  TrendingUp,
  Plus
} from "lucide-react"

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Marketing and Ads</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Promote your business and engage customers</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Marketing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">8</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Megaphone className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Reach</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">12.4K</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Click Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">3.8%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conversions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">142</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Tag className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Marketing Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Email Marketing */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Email Marketing</h3>
            <Mail className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Send newsletters and promotional emails to customers</p>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subscribers</span>
              <span className="font-semibold">2,456</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Open Rate</span>
              <span className="font-semibold text-green-600">24.5%</span>
            </div>
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700">Create Email</Button>
        </div>

        {/* SMS Marketing */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">SMS Marketing</h3>
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Send text messages and promotions to customers</p>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Recipients</span>
              <span className="font-semibold">1,842</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Delivery Rate</span>
              <span className="font-semibold text-green-600">96.2%</span>
            </div>
          </div>
          <Button className="w-full" variant="outline">Send SMS</Button>
        </div>

        {/* Promotions & Discounts */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Promotions</h3>
            <Tag className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Create discount codes and special offers</p>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Active Promos</span>
              <span className="font-semibold">5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Redemptions</span>
              <span className="font-semibold text-green-600">342</span>
            </div>
          </div>
          <Button className="w-full" variant="outline">Create Promo</Button>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Active Campaigns</h3>
        <div className="space-y-4">
          {[
            { name: "Summer Sale 2026", type: "Email", status: "active", reach: 2456, clicks: 312 },
            { name: "New Customer Welcome", type: "SMS", status: "active", reach: 145, clicks: 67 },
            { name: "Weekend Flash Sale", type: "Promotion", status: "active", reach: 1842, clicks: 521 },
            { name: "Loyalty Rewards", type: "Email", status: "scheduled", reach: 0, clicks: 0 },
          ].map((campaign, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {campaign.type === "Email" && <Mail className="h-5 w-5 text-purple-600" />}
                  {campaign.type === "SMS" && <MessageSquare className="h-5 w-5 text-blue-600" />}
                  {campaign.type === "Promotion" && <Tag className="h-5 w-5 text-orange-600" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{campaign.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {campaign.reach > 0 ? `${campaign.reach} reached • ${campaign.clicks} clicks` : "Not started"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {campaign.status === "active" && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                )}
                {campaign.status === "scheduled" && (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>
                )}
                <Button size="sm" variant="ghost">View</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
