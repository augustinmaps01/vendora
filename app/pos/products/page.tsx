"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import {
  Search,
  Plus,
  Package,
  Edit,
  Trash2,
  Filter,
  X,
  Save,
  AlertTriangle
} from "lucide-react"

// Product Interface
interface Product {
  id: number
  name: string
  sku: string
  barcode?: string
  category: string
  brand: string
  supplier: string
  price: number
  costPrice?: number
  stock: number
  unit: string
  minStock?: number
  maxStock?: number
  description?: string
  image: string
  isActive: boolean
}

type ProductForm = Omit<Product, "id">
type FormErrors = Partial<Record<keyof ProductForm, string>>

const imageExtensionPattern = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i

const isValidImageSource = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return false
  if (trimmed.startsWith("data:image/")) return true
  try {
    const url = new URL(trimmed)
    return imageExtensionPattern.test(url.pathname)
  } catch {
    return false
  }
}

// Initial form state
const initialFormState: ProductForm = {
  name: "",
  sku: "",
  barcode: "",
  category: "",
  brand: "",
  supplier: "",
  price: 0,
  costPrice: 0,
  stock: 0,
  unit: "pcs",
  minStock: 0,
  maxStock: 0,
  description: "",
  image: "",
  isActive: true
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductForm>(initialFormState)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [imageFileName, setImageFileName] = useState("")

  // Sample products data
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Premium Rice 5kg", sku: "GR-1001", barcode: "480001000001", category: "Grocery", brand: "Golden Harvest", supplier: "Metro Foods", price: 1250, costPrice: 950, stock: 18, unit: "bag", minStock: 5, maxStock: 50, description: "High-quality premium rice", image: "https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg?auto=compress&cs=tinysrgb&w=800", isActive: true },
    { id: 2, name: "Cooking Oil 1L", sku: "GR-1002", barcode: "480001000002", category: "Grocery", brand: "Sunrise", supplier: "Daily Wholesale", price: 185, costPrice: 140, stock: 45, unit: "bottle", minStock: 10, maxStock: 100, description: "Pure vegetable oil for everyday cooking", image: "https://images.pexels.com/photos/4198027/pexels-photo-4198027.jpeg?auto=compress&cs=tinysrgb&w=800", isActive: true },
    { id: 3, name: "All-Purpose Flour 1kg", sku: "GR-1003", barcode: "480001000003", category: "Grocery", brand: "Bakers Choice", supplier: "Pantry Supply Co.", price: 95, costPrice: 70, stock: 30, unit: "pack", minStock: 10, maxStock: 80, description: "Fine milled flour for baking and cooking", image: "https://images.pexels.com/photos/5765/flour-baking-cooking-kitchen.jpg?auto=compress&cs=tinysrgb&w=800", isActive: true },
    { id: 4, name: "White Sugar 1kg", sku: "GR-1004", barcode: "480001000004", category: "Grocery", brand: "Sweet Valley", supplier: "Metro Foods", price: 75, costPrice: 55, stock: 50, unit: "pack", minStock: 15, maxStock: 100, description: "Refined white sugar", image: "https://images.pexels.com/photos/616612/pexels-photo-616612.jpeg?auto=compress&cs=tinysrgb&w=800", isActive: true },
    { id: 5, name: "Mineral Water 1L", sku: "BV-2001", barcode: "480002000001", category: "Beverages", brand: "ClearSpring", supplier: "Hydra Logistics", price: 20, costPrice: 12, stock: 80, unit: "bottle", minStock: 30, maxStock: 200, description: "Natural mineral water", image: "https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=800", isActive: true },
    { id: 6, name: "Cola 1.5L", sku: "BV-2002", barcode: "480002000002", category: "Beverages", brand: "ColaMax", supplier: "Hydra Logistics", price: 65, costPrice: 45, stock: 55, unit: "bottle", minStock: 20, maxStock: 150, description: "Classic carbonated soft drink", image: "https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&cs=tinysrgb&w=800", isActive: true },
  ])

  const categories = ["Grocery", "Beverages", "Snacks", "Household", "Personal Care", "Other"]
  const units = ["pcs", "pack", "box", "bottle", "bag", "kg", "g", "L", "mL", "can", "carton"]

  // Handle form input changes
  const handleInputChange = (field: keyof ProductForm, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field === "image") {
      setImageFileName("")
    }
    setFormErrors(prev => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleImageUpload = (file?: File | null) => {
    if (!file) {
      setImageFileName("")
      return
    }

    if (!file.type.startsWith("image/")) {
      setFormErrors(prev => ({ ...prev, image: "Upload a valid image file." }))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      setFormData(prev => ({ ...prev, image: result }))
      setImageFileName(file.name)
      setFormErrors(prev => {
        if (!prev.image) return prev
        const next = { ...prev }
        delete next.image
        return next
      })
    }
    reader.readAsDataURL(file)
  }

  const validateForm = () => {
    const errors: FormErrors = {}

    if (!formData.name.trim()) {
      errors.name = "Product name is required."
    }

    if (!formData.sku.trim()) {
      errors.sku = "SKU is required."
    }

    if (!formData.category.trim()) {
      errors.category = "Category is required."
    }

    if (!formData.brand.trim()) {
      errors.brand = "Brand is required."
    }

    if (!formData.supplier.trim()) {
      errors.supplier = "Supplier is required."
    }

    if (!formData.unit.trim()) {
      errors.unit = "Unit is required."
    }

    if (!Number.isFinite(formData.price) || formData.price <= 0) {
      errors.price = "Selling price must be greater than 0."
    }

    if (!Number.isFinite(formData.stock) || formData.stock < 0) {
      errors.stock = "Stock cannot be negative."
    }

    if (formData.costPrice && formData.costPrice < 0) {
      errors.costPrice = "Cost price cannot be negative."
    }

    if (formData.minStock && formData.maxStock && formData.minStock > formData.maxStock) {
      errors.minStock = "Min stock cannot exceed max stock."
      errors.maxStock = "Max stock must be greater than min stock."
    }

    if (formData.maxStock && formData.stock > formData.maxStock) {
      errors.stock = "Stock cannot exceed max stock."
    }

    if (!formData.image.trim()) {
      errors.image = "Product image is required."
    } else if (!isValidImageSource(formData.image)) {
      errors.image = "Use a direct image URL (.jpg, .png, .webp, .gif, .svg) or upload a file."
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData(initialFormState)
    setFormErrors({})
    setImageFileName("")
    setIsAddModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode || "",
      category: product.category,
      brand: product.brand,
      supplier: product.supplier,
      price: product.price,
      costPrice: product.costPrice || 0,
      stock: product.stock,
      unit: product.unit,
      minStock: product.minStock || 0,
      maxStock: product.maxStock || 0,
      description: product.description || "",
      image: product.image || "",
      isActive: product.isActive
    })
    setFormErrors({})
    setImageFileName("")
    setIsEditModalOpen(true)
  }

  // Open Delete Modal
  const handleOpenDeleteModal = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteModalOpen(true)
  }

  // Add Product
  const handleAddProduct = () => {
    if (!validateForm()) return

    const newProduct: Product = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      ...formData
    }
    setProducts([...products, newProduct])
    setIsAddModalOpen(false)
    setFormData(initialFormState)
  }

  // Update Product
  const handleUpdateProduct = () => {
    if (!selectedProduct) return
    if (!validateForm()) return

    setProducts(products.map(p =>
      p.id === selectedProduct.id ? { ...p, ...formData } : p
    ))
    setIsEditModalOpen(false)
    setSelectedProduct(null)
    setFormData(initialFormState)
  }

  // Delete Product
  const handleDeleteProduct = () => {
    if (!selectedProduct) return
    setProducts(products.filter(p => p.id !== selectedProduct.id))
    setIsDeleteModalOpen(false)
    setSelectedProduct(null)
  }

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.barcode || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">Manage your product inventory and pricing</p>
        </div>
        <Button onClick={handleOpenAddModal} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 md:gap-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-xs sm:text-sm text-gray-600">Total Products</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{products.length}</div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-xs sm:text-sm text-gray-600">Low Stock</div>
          <div className="text-xl sm:text-2xl font-bold text-orange-600 mt-0.5 sm:mt-1">
            {products.filter(p => p.stock <= (p.minStock || 0)).length}
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-xs sm:text-sm text-gray-600">Active Products</div>
          <div className="text-xl sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">
            {products.filter(p => p.isActive).length}
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-xs sm:text-sm text-gray-600">Total Value</div>
          <div className="text-lg sm:text-2xl font-bold text-purple-600 mt-0.5 sm:mt-1">
            ₱{products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Products Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No products found. {searchQuery ? "Try a different search." : "Add your first product to get started."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                          {isValidImageSource(product.image) ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.sku}</div>
                      {product.barcode && (
                        <div className="text-xs text-gray-500">Barcode: {product.barcode}</div>
                      )}
                      {product.brand && (
                        <div className="text-xs text-gray-500">Brand: {product.brand}</div>
                      )}
                      {product.supplier && (
                        <div className="text-xs text-gray-500">Supplier: {product.supplier}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">{product.category}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₱{product.price.toLocaleString()}</div>
                      {product.costPrice && product.costPrice > 0 && (
                        <div className="text-xs text-gray-500">Cost: ₱{product.costPrice.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={
                        product.stock === 0 ? "destructive" :
                        product.stock <= (product.minStock || 0) ? "secondary" :
                        "default"
                      }>
                        {product.stock} {product.unit}
                      </Badge>
                      {product.minStock && product.stock <= product.minStock && (
                        <div className="text-xs text-orange-600 mt-1">Low stock!</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEditModal(product)}
                          className="hover:bg-purple-50 hover:text-purple-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDeleteModal(product)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products Cards - Mobile & Tablet */}
      <div className="lg:hidden space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-500">
              {searchQuery ? "No products found. Try a different search." : "No products available. Add your first product to get started."}
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex gap-3 mb-3">
                <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {isValidImageSource(product.image) ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">SKU: {product.sku}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                    <Badge variant={product.isActive ? "default" : "secondary"} className="text-xs">
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-gray-500">Price:</span>
                  <span className="text-gray-900 font-medium ml-1">₱{product.price.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Stock:</span>
                  <Badge variant={
                    product.stock === 0 ? "destructive" :
                    product.stock <= (product.minStock || 0) ? "secondary" :
                    "default"
                  } className="ml-1 text-xs">
                    {product.stock} {product.unit}
                  </Badge>
                </div>
                {product.brand && (
                  <div className="col-span-2 text-xs text-gray-500">
                    Brand: {product.brand}
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEditModal(product)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDeleteModal(product)}
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Add New Product
            </DialogTitle>
            <DialogDescription>
              Fill in the product details. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Basic Information</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Premium Rice 5kg"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    aria-invalid={!!formErrors.name}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-600">{formErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    placeholder="e.g., GR-1001"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    aria-invalid={!!formErrors.sku}
                  />
                  {formErrors.sku && (
                    <p className="text-xs text-red-600">{formErrors.sku}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    placeholder="e.g., 480001000001"
                    value={formData.barcode}
                    onChange={(e) => handleInputChange('barcode', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Golden Harvest"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    aria-invalid={!!formErrors.brand}
                  />
                  {formErrors.brand && (
                    <p className="text-xs text-red-600">{formErrors.brand}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Input
                    id="supplier"
                    placeholder="e.g., Metro Foods"
                    value={formData.supplier}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                    aria-invalid={!!formErrors.supplier}
                  />
                  {formErrors.supplier && (
                    <p className="text-xs text-red-600">{formErrors.supplier}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    aria-invalid={!!formErrors.category}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="text-xs text-red-600">{formErrors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit *</Label>
                  <select
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    aria-invalid={!!formErrors.unit}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  {formErrors.unit && (
                    <p className="text-xs text-red-600">{formErrors.unit}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Product description..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Pricing</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price (₱) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    aria-invalid={!!formErrors.price}
                  />
                  {formErrors.price && (
                    <p className="text-xs text-red-600">{formErrors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price (₱)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.costPrice || ""}
                    onChange={(e) => handleInputChange('costPrice', Number(e.target.value))}
                    aria-invalid={!!formErrors.costPrice}
                  />
                  {formErrors.costPrice && (
                    <p className="text-xs text-red-600">{formErrors.costPrice}</p>
                  )}
                  {formData.price > 0 && formData.costPrice && formData.costPrice > 0 && (
                    <p className="text-xs text-gray-500">
                      Margin: ₱{(formData.price - formData.costPrice).toFixed(2)} ({((formData.price - formData.costPrice) / formData.price * 100).toFixed(1)}%)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Inventory</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="stock">Current Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.stock || ""}
                    onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                    aria-invalid={!!formErrors.stock}
                  />
                  {formErrors.stock && (
                    <p className="text-xs text-red-600">{formErrors.stock}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minStock">Min Stock Level</Label>
                  <Input
                    id="minStock"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.minStock || ""}
                    onChange={(e) => handleInputChange('minStock', Number(e.target.value))}
                    aria-invalid={!!formErrors.minStock}
                  />
                  {formErrors.minStock && (
                    <p className="text-xs text-red-600">{formErrors.minStock}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxStock">Max Stock Level</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.maxStock || ""}
                    onChange={(e) => handleInputChange('maxStock', Number(e.target.value))}
                    aria-invalid={!!formErrors.maxStock}
                  />
                  {formErrors.maxStock && (
                    <p className="text-xs text-red-600">{formErrors.maxStock}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Additional Settings</h3>

              <div className="space-y-2">
                <Label htmlFor="image-upload">Upload Image</Label>
                <Input
                  id="image-upload"
                  key={`add-image-upload-${isAddModalOpen ? "open" : "closed"}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                />
                {imageFileName && (
                  <p className="text-xs text-gray-500">Selected: {imageFileName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL *</Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  aria-invalid={!!formErrors.image}
                />
                {formErrors.image && (
                  <p className="text-xs text-red-600">{formErrors.image}</p>
                )}
                <p className="text-xs text-gray-500">Upload an image file or use a direct image URL (.jpg, .png, .webp, .gif, .svg).</p>
                {formData.image && (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-16 w-16 rounded border bg-gray-50 overflow-hidden flex items-center justify-center">
                      {isValidImageSource(formData.image) ? (
                        <img
                          src={formData.image}
                          alt={formData.name || "Product image preview"}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-400">No preview</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Preview</div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="isActive">Product Status</Label>
                  <p className="text-sm text-gray-500">Set product as active or inactive</p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleAddProduct} className="bg-purple-600 hover:bg-purple-700">
              <Save className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-purple-600" />
              Edit Product
            </DialogTitle>
            <DialogDescription>
              Update the product details. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Basic Information</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="edit-name">Product Name *</Label>
                  <Input
                    id="edit-name"
                    placeholder="e.g., Premium Rice 5kg"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    aria-invalid={!!formErrors.name}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-600">{formErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-sku">SKU *</Label>
                  <Input
                    id="edit-sku"
                    placeholder="e.g., GR-1001"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    aria-invalid={!!formErrors.sku}
                  />
                  {formErrors.sku && (
                    <p className="text-xs text-red-600">{formErrors.sku}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-barcode">Barcode</Label>
                  <Input
                    id="edit-barcode"
                    placeholder="e.g., 480001000001"
                    value={formData.barcode}
                    onChange={(e) => handleInputChange('barcode', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Brand *</Label>
                  <Input
                    id="edit-brand"
                    placeholder="e.g., Golden Harvest"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    aria-invalid={!!formErrors.brand}
                  />
                  {formErrors.brand && (
                    <p className="text-xs text-red-600">{formErrors.brand}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-supplier">Supplier *</Label>
                  <Input
                    id="edit-supplier"
                    placeholder="e.g., Metro Foods"
                    value={formData.supplier}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                    aria-invalid={!!formErrors.supplier}
                  />
                  {formErrors.supplier && (
                    <p className="text-xs text-red-600">{formErrors.supplier}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <select
                    id="edit-category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    aria-invalid={!!formErrors.category}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="text-xs text-red-600">{formErrors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-unit">Unit *</Label>
                  <select
                    id="edit-unit"
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    aria-invalid={!!formErrors.unit}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  {formErrors.unit && (
                    <p className="text-xs text-red-600">{formErrors.unit}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Product description..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Pricing</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Selling Price (₱) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    aria-invalid={!!formErrors.price}
                  />
                  {formErrors.price && (
                    <p className="text-xs text-red-600">{formErrors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-costPrice">Cost Price (₱)</Label>
                  <Input
                    id="edit-costPrice"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.costPrice || ""}
                    onChange={(e) => handleInputChange('costPrice', Number(e.target.value))}
                    aria-invalid={!!formErrors.costPrice}
                  />
                  {formErrors.costPrice && (
                    <p className="text-xs text-red-600">{formErrors.costPrice}</p>
                  )}
                  {formData.price > 0 && formData.costPrice && formData.costPrice > 0 && (
                    <p className="text-xs text-gray-500">
                      Margin: ₱{(formData.price - formData.costPrice).toFixed(2)} ({((formData.price - formData.costPrice) / formData.price * 100).toFixed(1)}%)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Inventory</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Current Stock *</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.stock || ""}
                    onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                    aria-invalid={!!formErrors.stock}
                  />
                  {formErrors.stock && (
                    <p className="text-xs text-red-600">{formErrors.stock}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-minStock">Min Stock Level</Label>
                  <Input
                    id="edit-minStock"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.minStock || ""}
                    onChange={(e) => handleInputChange('minStock', Number(e.target.value))}
                    aria-invalid={!!formErrors.minStock}
                  />
                  {formErrors.minStock && (
                    <p className="text-xs text-red-600">{formErrors.minStock}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-maxStock">Max Stock Level</Label>
                  <Input
                    id="edit-maxStock"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.maxStock || ""}
                    onChange={(e) => handleInputChange('maxStock', Number(e.target.value))}
                    aria-invalid={!!formErrors.maxStock}
                  />
                  {formErrors.maxStock && (
                    <p className="text-xs text-red-600">{formErrors.maxStock}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Additional Settings</h3>

              <div className="space-y-2">
                <Label htmlFor="edit-image-upload">Upload Image</Label>
                <Input
                  id="edit-image-upload"
                  key={`edit-image-upload-${isEditModalOpen ? "open" : "closed"}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                />
                {imageFileName && (
                  <p className="text-xs text-gray-500">Selected: {imageFileName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL *</Label>
                <Input
                  id="edit-image"
                  type="url"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  aria-invalid={!!formErrors.image}
                />
                {formErrors.image && (
                  <p className="text-xs text-red-600">{formErrors.image}</p>
                )}
                <p className="text-xs text-gray-500">Upload an image file or use a direct image URL (.jpg, .png, .webp, .gif, .svg).</p>
                {formData.image && (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-16 w-16 rounded border bg-gray-50 overflow-hidden flex items-center justify-center">
                      {isValidImageSource(formData.image) ? (
                        <img
                          src={formData.image}
                          alt={formData.name || "Product image preview"}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-400">No preview</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Preview</div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="edit-isActive">Product Status</Label>
                  <p className="text-sm text-gray-500">Set product as active or inactive</p>
                </div>
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct} className="bg-purple-600 hover:bg-purple-700">
              <Save className="w-4 h-4 mr-2" />
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="w-[95vw] sm:w-full sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="py-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{selectedProduct.name}</div>
                    <div className="text-sm text-gray-500">SKU: {selectedProduct.sku}</div>
                    <div className="text-sm text-gray-500">Stock: {selectedProduct.stock} {selectedProduct.unit}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteProduct}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
