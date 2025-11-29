# API Setup Guide - Laravel Backend Integration

Complete guide for setting up and using the API client with your Laravel backend.

## 📁 Files Created

```
├── .env.example                    # Environment variables template
├── .env.local                      # Local environment (DO NOT COMMIT!)
├── config/env.ts                   # Type-safe environment access
├── lib/
│   ├── api-client.ts              # Axios client configuration
│   └── api-endpoints.ts           # All API endpoints (NOT hardcoded!)
└── services/
    ├── auth.service.ts            # Authentication API calls
    ├── product.service.ts         # Product API calls
    ├── order.service.ts           # Order API calls
    └── index.ts                   # Barrel export
```

## 🚀 Quick Start

### 1. Configure Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Laravel backend URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_VERSION=v1
```

### 2. Laravel Backend Setup

Your Laravel API should return responses in this format:

```php
// Success Response
return response()->json([
    'success' => true,
    'data' => $data,
    'message' => 'Operation successful'
]);

// Error Response
return response()->json([
    'success' => false,
    'message' => 'Error message',
    'errors' => [
        'field' => ['Validation error']
    ]
], 422);
```

### 3. Enable CORS in Laravel

**config/cors.php:**
```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## 📚 Usage Examples

### Authentication

```typescript
import { authService } from "@/services"

// Login
const login = async () => {
  try {
    const response = await authService.login({
      email: "admin@vendora.com",
      password: "password",
      rememberMe: true
    })

    console.log("User:", response.user)
    console.log("Token:", response.token)

    // Tokens are automatically stored
    // Navigate to dashboard
    router.push("/admin")
  } catch (error) {
    console.error("Login failed:", error.message)
  }
}

// Register
const register = async () => {
  try {
    const response = await authService.register({
      email: "user@example.com",
      password: "password",
      confirmPassword: "password",
      firstName: "Juan",
      lastName: "Dela Cruz",
      phone: "+639123456789",
      accountType: "business",
      businessName: "My Store",
      agreeToTerms: true
    })

    console.log("Registered:", response.user)
  } catch (error) {
    console.error("Registration failed:", error.message)
  }
}

// Logout
const logout = async () => {
  await authService.logout()
  router.push("/login")
}

// Get current user
const getCurrentUser = async () => {
  const user = await authService.me()
  console.log("Current user:", user)
}
```

### Products

```typescript
import { productService } from "@/services"

// Get all products (with pagination and filters)
const getProducts = async () => {
  const response = await productService.getAll({
    category: "electronics",
    minPrice: 100,
    maxPrice: 5000,
    inStock: true,
    search: "laptop",
    sort: "price-asc"
  })

  console.log("Products:", response.data)
  console.log("Total:", response.pagination.total)
  console.log("Current page:", response.pagination.page)
}

// Get single product
const getProduct = async (id: string) => {
  const product = await productService.getById(id)
  console.log("Product:", product)
}

// Create product
const createProduct = async () => {
  const product = await productService.create({
    name: "Laptop",
    description: "Gaming laptop",
    price: 45000,
    sku: "LAP-001",
    category: { id: "1" },
    stock: 10
  })

  console.log("Created:", product)
}

// Update product
const updateProduct = async (id: string) => {
  const product = await productService.update(id, {
    price: 42000,
    stock: 8
  })

  console.log("Updated:", product)
}

// Delete product
const deleteProduct = async (id: string) => {
  await productService.delete(id)
  console.log("Product deleted")
}

// Search products
const searchProducts = async (query: string) => {
  const products = await productService.search(query)
  console.log("Search results:", products)
}

// Get featured products
const getFeatured = async () => {
  const products = await productService.getFeatured()
  console.log("Featured:", products)
}
```

### Orders

```typescript
import { orderService } from "@/services"

// Get all orders
const getOrders = async () => {
  const response = await orderService.getAll({
    status: "pending",
    paymentStatus: "paid",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31")
  })

  console.log("Orders:", response.data)
}

// Get single order
const getOrder = async (id: string) => {
  const order = await orderService.getById(id)
  console.log("Order:", order)
}

// Create order
const createOrder = async () => {
  const order = await orderService.create({
    items: cartItems,
    customer: customer,
    shippingAddress: address,
    paymentMethod: "gcash"
  })

  console.log("Order created:", order)
}

// Update order status
const updateOrderStatus = async (id: string) => {
  const order = await orderService.updateStatus(id, "shipped")
  console.log("Order updated:", order)
}

// Cancel order
const cancelOrder = async (id: string) => {
  const order = await orderService.cancel(id, "Customer requested")
  console.log("Order cancelled:", order)
}

// Download invoice
const downloadInvoice = async (id: string) => {
  const blob = await orderService.getInvoice(id)

  // Create download link
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `invoice-${id}.pdf`
  link.click()
}
```

## 🔧 Using API Client Directly

For endpoints not yet wrapped in services:

```typescript
import api from "@/lib/api-client"
import { endpoints } from "@/lib/api-endpoints"

// GET request
const data = await api.get("/custom-endpoint")

// POST request
const result = await api.post("/custom-endpoint", { data: "value" })

// PUT request
const updated = await api.put("/custom-endpoint/1", { data: "new value" })

// DELETE request
await api.delete("/custom-endpoint/1")

// Upload file
const formData = new FormData()
formData.append("file", file)

const uploaded = await api.upload("/upload", formData, (progress) => {
  console.log("Upload progress:", progress.loaded / progress.total * 100)
})
```

## 🎯 Using Endpoints Configuration

```typescript
import { endpoints } from "@/lib/api-endpoints"

// All endpoints are functions that return the URL string
console.log(endpoints.products.list())        // "/products"
console.log(endpoints.products.get(123))      // "/products/123"
console.log(endpoints.orders.updateStatus(5)) // "/orders/5/status"

// Use with API client
const product = await api.get(endpoints.products.get(123))
```

## 🔒 Authentication Flow

The API client handles authentication automatically:

1. **Login** → Stores token in localStorage
2. **All requests** → Automatically adds `Authorization: Bearer {token}` header
3. **Token expires (401)** → Automatically tries to refresh token
4. **Refresh fails** → Redirects to login page
5. **Logout** → Clears tokens from localStorage

## 📝 Error Handling

```typescript
import { authService } from "@/services"

try {
  await authService.login(credentials)
} catch (error) {
  // error is formatted as ApiError
  console.error("Error:", error.message)
  console.error("Status:", error.status)

  // Laravel validation errors
  if (error.errors) {
    Object.entries(error.errors).forEach(([field, messages]) => {
      console.error(`${field}:`, messages)
    })
  }
}
```

## 🌐 Environment-Specific Configuration

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_DEBUG=true
```

### Staging
```env
NEXT_PUBLIC_API_URL=https://staging-api.vendora.com/api
NEXT_PUBLIC_DEBUG=false
```

### Production
```env
NEXT_PUBLIC_API_URL=https://api.vendora.com/api
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_SHOW_ERROR_DETAILS=false
```

## 🔐 Laravel Sanctum Setup

If using Laravel Sanctum for authentication:

**Laravel .env:**
```env
SANCTUM_STATEFUL_DOMAINS=localhost:3000,vendora.com
SESSION_DOMAIN=localhost
```

**Next.js:**
```typescript
// Before making authenticated requests
await apiClient.get("/sanctum/csrf-cookie", {
  baseURL: env.sanctum.url
})
```

## 📦 Adding New Endpoints

### 1. Add to api-endpoints.ts

```typescript
export const customEndpoints = {
  list: () => "/custom",
  get: (id: string | number) => buildUrl("/custom/:id", { id }),
  create: () => "/custom",
  update: (id: string | number) => buildUrl("/custom/:id", { id }),
  delete: (id: string | number) => buildUrl("/custom/:id", { id }),
}

// Add to main endpoints export
export const endpoints = {
  // ... existing endpoints
  custom: customEndpoints,
}
```

### 2. Create Service (Optional)

```typescript
// services/custom.service.ts
import api from "@/lib/api-client"
import { endpoints } from "@/lib/api-endpoints"

export const customService = {
  getAll: async () => {
    return api.get(endpoints.custom.list())
  },

  getById: async (id: string) => {
    return api.get(endpoints.custom.get(id))
  },

  create: async (data: any) => {
    return api.post(endpoints.custom.create(), data)
  },

  update: async (id: string, data: any) => {
    return api.put(endpoints.custom.update(id), data)
  },

  delete: async (id: string) => {
    return api.delete(endpoints.custom.delete(id))
  },
}
```

### 3. Export Service

```typescript
// services/index.ts
export * from "./custom.service"
```

## 🧪 Testing API Calls

Use the debug mode to see all API calls:

```env
NEXT_PUBLIC_DEBUG=true
```

This will log:
- 📤 All outgoing requests
- 📥 All responses
- ❌ All errors

## 🔑 Available Endpoints

### Authentication
- POST `/auth/login`
- POST `/auth/register`
- POST `/auth/logout`
- POST `/auth/refresh`
- GET `/auth/me`

### Products
- GET `/products`
- GET `/products/:id`
- POST `/products`
- PUT `/products/:id`
- DELETE `/products/:id`

### Orders
- GET `/orders`
- GET `/orders/:id`
- POST `/orders`
- PUT `/orders/:id`
- DELETE `/orders/:id`

### Customers
- GET `/customers`
- GET `/customers/:id`
- POST `/customers`
- PUT `/customers/:id`

### Cart
- GET `/cart`
- POST `/cart/items`
- PUT `/cart/items/:id`
- DELETE `/cart/items/:id`

### Reports
- GET `/reports/sales`
- GET `/reports/revenue`
- GET `/reports/dashboard`

[See lib/api-endpoints.ts for complete list]

## 🎉 Benefits

✅ **Not Hardcoded** - All endpoints in one place
✅ **Type-Safe** - Full TypeScript support
✅ **Reusable** - Import and use anywhere
✅ **Maintainable** - Easy to update endpoints
✅ **Clean** - No scattered API calls
✅ **Auto Token Management** - Handles auth automatically
✅ **Error Handling** - Consistent error format
✅ **Environment-Aware** - Different configs per env

Your API integration is ready to use! 🚀
