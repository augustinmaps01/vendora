"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Globe,
  ShoppingCart,
  Package,
  TrendingUp,
  Eye,
  Settings,
  ExternalLink,
  Palette
} from "lucide-react"

export default function EcommercePage() {
  const [storeActive, setStoreActive] = useState(true)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">E-commerce Store</h1>
          <p className="text-gray-600 dark:text-[#b4b4d0] mt-1">Manage your online store and web presence</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview Store
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Store
          </Button>
        </div>
      </div>

      {/* Store Status */}
      <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Online Store Status</h3>
              <p className="text-sm text-gray-600 dark:text-[#b4b4d0] mt-1">
                Your store URL: <span className="font-medium text-purple-600">bunyaretail.vendora.shop</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-[#b4b4d0]">
              {storeActive ? "Store is Live" : "Store is Offline"}
            </span>
            <Switch
              checked={storeActive}
              onCheckedChange={setStoreActive}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </div>
      </div>

      {/* Store Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#13132a] p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Online Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">342</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18.2% this month
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13132a] p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Store Visitors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">8,246</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% this month
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13132a] p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">4.2%</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.8% this month
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13132a] p-6 rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Online Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">156</p>
              <p className="text-xs text-gray-600 dark:text-[#b4b4d0] mt-2">
                Active listings
              </p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Store Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storefront Design */}
        <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
              <Palette className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Storefront Design</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-[#e0e0f0] mb-2 block">Store Name</label>
              <Input defaultValue="Bunya Retail Shop" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-[#e0e0f0] mb-2 block">Store Tagline</label>
              <Input defaultValue="Your trusted neighborhood store" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-[#e0e0f0] mb-2 block">Theme Color</label>
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-purple-600 rounded-lg border-2 border-purple-800 cursor-pointer"></div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg border-2 border-gray-200 cursor-pointer"></div>
                <div className="w-12 h-12 bg-green-600 rounded-lg border-2 border-gray-200 cursor-pointer"></div>
                <div className="w-12 h-12 bg-orange-600 rounded-lg border-2 border-gray-200 cursor-pointer"></div>
                <div className="w-12 h-12 bg-pink-600 rounded-lg border-2 border-gray-200 cursor-pointer"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-t dark:border-[#2d1b69]">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Dark Mode</div>
                <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Enable dark theme for your store</p>
              </div>
              <Switch />
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Save Design</Button>
          </div>
        </div>

        {/* Store Features */}
        <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Store Features</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Product Search</div>
                <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Allow customers to search products</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Shopping Cart</div>
                <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Enable cart functionality</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Customer Reviews</div>
                <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Allow product reviews and ratings</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Wishlist</div>
                <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Let customers save favorite items</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Live Chat Support</div>
                <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Provide real-time customer support</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Send order confirmations via email</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>

      {/* Product Sync */}
      <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Product Synchronization</h2>
              <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Sync your POS products with online store</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Synced 5 mins ago</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-[#1a1a35] rounded-lg">
            <div className="text-sm text-gray-600 dark:text-[#b4b4d0] mb-1">Total Products</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">156</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1a1a35] rounded-lg">
            <div className="text-sm text-gray-600 dark:text-[#b4b4d0] mb-1">Published Online</div>
            <div className="text-2xl font-bold text-green-600">142</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1a1a35] rounded-lg">
            <div className="text-sm text-gray-600 dark:text-[#b4b4d0] mb-1">Draft/Hidden</div>
            <div className="text-2xl font-bold text-gray-600 dark:text-[#b4b4d0]">14</div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button className="bg-purple-600 hover:bg-purple-700">
            Sync Now
          </Button>
          <Button variant="outline">
            Manage Products
          </Button>
        </div>
      </div>

      {/* Store Performance */}
      <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Online Orders</h2>
        <div className="space-y-3">
          {[
            { id: "WEB-001", customer: "Sarah Johnson", date: "2026-01-10 15:30", amount: 1850, status: "processing" },
            { id: "WEB-002", customer: "Michael Chen", date: "2026-01-10 14:15", amount: 2450, status: "completed" },
            { id: "WEB-003", customer: "Emma Wilson", date: "2026-01-10 12:45", amount: 950, status: "completed" },
            { id: "WEB-004", customer: "David Brown", date: "2026-01-09 18:20", amount: 3200, status: "shipped" },
          ].map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1a35] rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-purple-100 p-2 rounded">
                  <ShoppingCart className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{order.id}</div>
                  <div className="text-xs text-gray-600 dark:text-[#b4b4d0] mt-1">
                    {order.customer} • {order.date}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm font-bold text-gray-900 dark:text-white">₱{order.amount.toFixed(2)}</div>
                {order.status === "completed" && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                )}
                {order.status === "processing" && (
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Processing</Badge>
                )}
                {order.status === "shipped" && (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Shipped</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
