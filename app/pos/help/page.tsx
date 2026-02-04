"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Video,
  ExternalLink
} from "lucide-react"

export default function HelpPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Help and Support</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Get assistance and find answers to your questions</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search for help articles, guides, or FAQs..."
            className="pl-12 py-6 text-base"
          />
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Book className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Documentation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Browse comprehensive guides and tutorials</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Video className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Video Tutorials</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Watch step-by-step video guides</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Live Chat</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Chat with our support team</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <HelpCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">FAQs</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Find answers to common questions</p>
        </div>
      </div>

      {/* Contact Support */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Mail className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Email Support</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Get help via email within 24 hours</p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">support@vendora.com</p>
          <Button className="w-full bg-purple-600 hover:bg-purple-700">Send Email</Button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Phone Support</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Talk to our support team</p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">+63 2 8123 4567</p>
          <Button className="w-full" variant="outline">Call Now</Button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Live Chat</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Chat with an agent now</p>
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Online</Badge>
            <span className="text-xs text-gray-600 dark:text-gray-400">Usually responds in minutes</span>
          </div>
          <Button className="w-full" variant="outline">Start Chat</Button>
        </div>
      </div>

      {/* Popular Help Articles */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Popular Help Articles</h2>
        <div className="space-y-4">
          {[
            { title: "Getting Started with Vendora POS", category: "Getting Started", views: 1245 },
            { title: "How to Add Products to Your Inventory", category: "Products", views: 892 },
            { title: "Processing Sales and Payments", category: "Sales", views: 756 },
            { title: "Managing Customer Information", category: "Customers", views: 634 },
            { title: "Generating Sales Reports", category: "Reports", views: 521 },
            { title: "Setting Up Tax Rates", category: "Settings", views: 489 },
          ].map((article, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-white dark:bg-gray-800 p-2 rounded">
                  <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{article.title}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {article.category} • {article.views} views
                  </div>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">System Status</h2>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">All Systems Operational</Badge>
        </div>
        <div className="space-y-3">
          {[
            { service: "POS System", status: "operational" },
            { service: "Payment Processing", status: "operational" },
            { service: "Inventory Management", status: "operational" },
            { service: "Reports & Analytics", status: "operational" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-900 dark:text-gray-100">{item.service}</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">Operational</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
