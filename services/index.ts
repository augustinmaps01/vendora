/**
 * Services - Barrel Export
 *
 * Central export point for all API services
 */

export * from "./auth.service"
export * from "./product.service"
export * from "./category.service"
export * from "./order.service"
export * from "./payment.service"
export * from "./customer.service"
export * from "./store.service"
export * from "./dashboard.service"
export * from "./admin-user.service"

// Re-export types for convenience
export type {
  ApiProduct,
  ProductPayload,
  ProductFilters,
  ProductCategory,
  PaginatedProductResponse,
  StockUpdatePayload,
  BulkStockItem,
  BulkStockDecrementPayload,
} from "./product.service"

export type {
  ApiCategory,
  CategoryListResponse,
} from "./category.service"

export type {
  ApiPayment,
  PaymentPayload,
  PaymentFilters,
  PaymentSummary,
  PaginatedPaymentResponse,
} from "./payment.service"

export type {
  ApiCustomer,
  CustomerPayload,
  CustomerFilters,
  CustomerSummary,
  PaginatedCustomerResponse,
} from "./customer.service"

export type {
  ApiStore,
  StorePayload,
  StoreListResponse,
} from "./store.service"

export type {
  AdminUser,
  AdminUserFilters,
  AdminUserCreatePayload,
  AdminUserUpdatePayload,
  PaginatedAdminUserResponse,
} from "./admin-user.service"

// Example usage in components:
// import { authService, productService, categoryService, orderService, paymentService, customerService, storeService } from "@/services"
// import type { ApiProduct, ProductPayload, ApiCategory, ApiPayment, ApiCustomer, ApiStore } from "@/services"
