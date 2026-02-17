"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  Store,
  Bell,
  Lock,
  CreditCard,
  Users,
  Printer,
  Globe
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-[#b4b4d0] mt-1">Manage your store settings and preferences</p>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                <Store className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Store Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" defaultValue="Bunya Retail Shop" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="vendor@bunyaretail.com" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="+63 912 345 6789" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="address">Business Address</Label>
                <Input id="address" defaultValue="123 Main St, Manila, Philippines" className="mt-1.5" />
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Order Notifications</div>
                  <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Receive alerts for new orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Low Stock Alerts</div>
                  <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Get notified when products are running low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Payment Notifications</div>
                  <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Receive payment confirmation alerts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Marketing Updates</div>
                  <p className="text-sm text-gray-600 dark:text-[#b4b4d0]">Get updates about promotions and campaigns</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                <Lock className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" className="mt-1.5" />
              </div>
              <Button variant="outline">Update Password</Button>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Settings */}
        <div className="space-y-6">
          {/* Payment Settings */}
          <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Payment Methods</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-[#e0e0f0]">Cash</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-[#e0e0f0]">Card</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-[#e0e0f0]">Online Payment</span>
                <Switch defaultChecked />
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" size="sm">
              Configure
            </Button>
          </div>

          {/* Staff Management */}
          <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Staff & Roles</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-[#b4b4d0] mb-4">Manage staff members and their permissions</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-[#b4b4d0]">Total Staff</span>
                <span className="font-semibold dark:text-white">5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-[#b4b4d0]">Active</span>
                <span className="font-semibold text-green-600">4</span>
              </div>
            </div>
            <Button className="w-full" variant="outline" size="sm">
              Manage Staff
            </Button>
          </div>

          {/* Printer Settings */}
          <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                <Printer className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Receipt Printer</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-[#b4b4d0] mb-4">Configure receipt printing settings</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-[#e0e0f0]">Auto Print</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-[#e0e0f0]">Show Logo</span>
                <Switch defaultChecked />
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" size="sm">
              Test Print
            </Button>
          </div>

          {/* Language & Region */}
          <div className="bg-white dark:bg-[#13132a] rounded-lg border border-gray-200 dark:border-[#2d1b69] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Language & Region</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="language" className="text-sm">Language</Label>
                <select id="language" className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-[#2d1b69] dark:bg-[#13132a] dark:text-white rounded-lg text-sm">
                  <option>English</option>
                  <option>Filipino</option>
                </select>
              </div>
              <div>
                <Label htmlFor="currency" className="text-sm">Currency</Label>
                <select id="currency" className="w-full mt-1.5 px-3 py-2 border border-gray-200 dark:border-[#2d1b69] dark:bg-[#13132a] dark:text-white rounded-lg text-sm">
                  <option>PHP (₱)</option>
                  <option>USD ($)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
