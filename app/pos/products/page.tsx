"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Package,
  Edit,
  Trash2,
  Filter
} from "lucide-react"

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample products data
  const products = [
    { id: 1, name: "Premium Rice 5kg", sku: "GR-1001", category: "Grocery", price: 1250, stock: 18 },
    { id: 2, name: "Cooking Oil 1L", sku: "GR-1002", category: "Grocery", price: 185, stock: 45 },
    { id: 3, name: "All-Purpose Flour 1kg", sku: "GR-1003", category: "Grocery", price: 95, stock: 30 },
    { id: 4, name: "White Sugar 1kg", sku: "GR-1004", category: "Grocery", price: 75, stock: 50 },
    { id: 5, name: "Mineral Water 1L", sku: "BV-2001", category: "Beverages", price: 20, stock: 80 },
    { id: 6, name: "Cola 1.5L", sku: "BV-2002", category: "Beverages", price: 65, stock: 55 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory and pricing</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products by name, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="secondary">{product.category}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₱{product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={product.stock > 20 ? "default" : "destructive"}>
                      {product.stock} units
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
