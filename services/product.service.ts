/**
 * Product Service
 *
 * Handles all product-related API calls
 */

import api from "@/lib/api-client"
import { endpoints } from "@/lib/api-endpoints"
import { Product, ProductFilters, PaginatedResponse } from "@/types"

export const productService = {
  /**
   * Get all products with optional filters
   */
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    return api.get<PaginatedResponse<Product>>(endpoints.products.list(), {
      params: filters,
    })
  },

  /**
   * Get single product by ID
   */
  getById: async (id: string | number): Promise<Product> => {
    return api.get<Product>(endpoints.products.get(id))
  },

  /**
   * Create new product
   */
  create: async (data: Partial<Product>): Promise<Product> => {
    return api.post<Product>(endpoints.products.create(), data)
  },

  /**
   * Update existing product
   */
  update: async (id: string | number, data: Partial<Product>): Promise<Product> => {
    return api.put<Product>(endpoints.products.update(id), data)
  },

  /**
   * Delete product
   */
  delete: async (id: string | number): Promise<void> => {
    return api.delete(endpoints.products.delete(id))
  },

  /**
   * Search products
   */
  search: async (query: string): Promise<Product[]> => {
    return api.get<Product[]>(endpoints.products.search(), {
      params: { q: query },
    })
  },

  /**
   * Get featured products
   */
  getFeatured: async (): Promise<Product[]> => {
    return api.get<Product[]>(endpoints.products.featured())
  },

  /**
   * Get products by category
   */
  getByCategory: async (categoryId: string | number): Promise<Product[]> => {
    return api.get<Product[]>(endpoints.products.byCategory(categoryId))
  },

  /**
   * Get product variants
   */
  getVariants: async (productId: string | number) => {
    return api.get(endpoints.products.variants(productId))
  },
}
