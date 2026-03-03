# VENDORA API Documentation

> **Base URL:** `https://vendora-api.abedubas.dev`
> **Documentation:** https://vendora-api.abedubas.dev/api/documentation
> **API Version:** 1.0.0
> **Last Updated:** 2026-03-03

---

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_token>
```

---

## Endpoints

### Admin - Users

#### List Users (Admin only)
```
GET /api/admin/users
```
🔒 **Requires Authentication (Admin)**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | Search by name/email |
| user_type | string | Filter by user type (admin, vendor, manager, cashier, buyer) |
| status | string | Filter by status (active, inactive, suspended) |
| per_page | integer | Items per page (default: 20) |

**Response (`200`):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "user_type": "vendor",
      "phone": "+63 912 345 6789",
      "status": "active",
      "created_at": "2026-01-10T10:00:00Z",
      "updated_at": "2026-01-10T10:00:00Z"
    }
  ]
}
```

#### Create User (Admin only)
```
POST /api/admin/users
```
🔒 **Requires Authentication (Admin)**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| name | string | ✅ | "John Doe" |
| email | string (email) | ✅ | "john@example.com" |
| password | string | ✅ | "password" |
| user_type | string | ✅ | "admin" \| "vendor" \| "manager" \| "cashier" \| "buyer" |
| phone | string | ❌ | "+63 912 345 6789" |
| status | string | ❌ | "active" \| "inactive" \| "suspended" |

**Response:** `201` - User created successfully

#### Get User (Admin only)
```
GET /api/admin/users/{id}
```
🔒 **Requires Authentication (Admin)**

#### Update User (Admin only)
```
PUT /api/admin/users/{id}
```
🔒 **Requires Authentication (Admin)**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| name | string | ❌ | "John Doe" |
| email | string (email) | ❌ | "john@example.com" |
| password | string | ❌ | "newpassword" |
| user_type | string | ❌ | "vendor" |
| phone | string | ❌ | "+63 912 345 6789" |
| status | string | ❌ | "active" |

#### Delete User (Admin only)
```
DELETE /api/admin/users/{id}
```
🔒 **Requires Authentication (Admin)**

#### Change User Status (Admin only)
```
PATCH /api/admin/users/{id}/status
```
🔒 **Requires Authentication (Admin)**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| status | string (enum) | ✅ | "active" \| "inactive" \| "suspended" |

---

### Admin - Vendors

#### Create Vendor (Admin only)
```
POST /api/admin/vendors
```
🔒 **Requires Authentication (Admin)**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| name | string | ✅ | "John Vendor" |
| email | string (email) | ✅ | "vendor@example.com" |
| password | string | ✅ | "password" |
| password_confirmation | string | ✅ | "password" |
| business_name | string | ✅ | "Vendor Corp" |
| subscription_plan | enum | ✅ | "free" \| "basic" \| "premium" |

**Response (`201`):**
```json
{
  "message": "Vendor created successfully",
  "user": {
    "id": 1,
    "name": "John Vendor",
    "email": "vendor@example.com",
    "user_type": "vendor",
    "vendor_profile": {
      "id": 1,
      "business_name": "Vendor Corp",
      "subscription_plan": "basic"
    }
  }
}
```

---

### Auth

#### Register
```
POST /api/auth/register
```

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| name | string | ✅ | "John Doe" |
| email | string (email) | ✅ | "john@example.com" |
| password | string | ✅ | "password" |
| password_confirmation | string | ✅ | "password" |

**Response (`201`):**
```json
{
  "message": "Registration successful",
  "token": "1|e2b7x...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "user_type": "buyer",
    "created_at": "2026-01-10T10:00:00Z",
    "updated_at": "2026-01-10T10:00:00Z"
  }
}
```

#### Login
```
POST /api/auth/login
```

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| email | string (email) | ✅ | "vendor@example.com" |
| password | string | ✅ | "password" |

**Response (`200`):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "1|e2b7x...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "Vendor Corp",
    "email": "vendor@example.com",
    "user_type": "vendor",
    "vendor_profile": {
      "id": 1,
      "business_name": "Vendor Corp",
      "subscription_plan": "basic"
    },
    "stores": [
      { "id": 1, "name": "Main Store" }
    ],
    "assigned_stores": [
      { "id": 2, "name": "Branch Store", "role": "cashier" }
    ],
    "created_at": "2026-01-10T10:00:00Z",
    "updated_at": "2026-01-10T10:00:00Z"
  }
}
```

> **Note:** `vendor_profile` is nullable — it will be `null` for non-vendor users (admin, manager, cashier, buyer).

**Error Responses:**
- `401` - Invalid credentials: `{ "success": false, "error": "Unauthorized", "message": "Invalid credentials" }`
- `422` - Validation error

#### Logout
```
POST /api/auth/logout
```
🔒 **Requires Authentication**

**Response (`200`):**
```json
{ "message": "Logged out successfully" }
```

---

### Categories

#### List Categories (Public)
```
GET /api/categories
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| is_active | boolean | Filter by active status |
| with_count | boolean | Include product count |

**Response (`200`):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Grocery",
      "slug": "grocery",
      "description": "Food items",
      "icon": "shopping-cart",
      "is_active": true,
      "product_count": 25
    }
  ]
}
```

#### Get Category (Public)
```
GET /api/categories/{category}
```

#### Create Category
```
POST /api/categories
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| name | string | ✅ | "Electronics" |
| description | string | ❌ | "Electronic devices" |
| icon | string | ❌ | "cpu" |
| is_active | boolean | ❌ | true |

#### Update Category
```
PATCH /api/categories/{category}
```
🔒 **Requires Authentication**

#### Delete Category
```
DELETE /api/categories/{category}
```
🔒 **Requires Authentication**

**Response:** `204` - Deleted
**Error:** `409` - Cannot delete (has products)

---

### Customers

#### List Customers
```
GET /api/customers
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | Search by name/email/phone |
| status | string | Filter by status |
| sort | string | Sort field |
| direction | string | Sort direction (asc/desc) |
| page | integer | Page number |
| per_page | integer | Items per page |

**Response (`200`):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Dela Cruz",
      "email": "john.delacruz@email.com",
      "phone": "+63 912 345 6789",
      "orders_count": 15,
      "total_spent": 15420,
      "status": "active",
      "created_at": "2026-01-10T10:00:00Z",
      "updated_at": "2026-01-10T10:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 342
  }
}
```

#### Get Customer Summary
```
GET /api/customers/summary
```
🔒 **Requires Authentication**

**Response (`200`):**
```json
{
  "total_customers": 342,
  "active": 298,
  "vip": 24,
  "inactive": 20
}
```

#### Get Customer
```
GET /api/customers/{customer}
```
🔒 **Requires Authentication**

#### Create Customer
```
POST /api/customers
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| name | string | ✅ | "John Dela Cruz" |
| email | string | ❌ | "john.delacruz@email.com" |
| phone | string | ❌ | "+63 912 345 6789" |
| status | string | ✅ | "active" |

#### Update Customer
```
PATCH /api/customers/{customer}
```
🔒 **Requires Authentication**

#### Delete Customer
```
DELETE /api/customers/{customer}
```
🔒 **Requires Authentication**

---

### Dashboard

#### KPI Cards
```
GET /api/dashboard/kpis
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| start_date | string | Start date (YYYY-MM-DD) |
| end_date | string | End date (YYYY-MM-DD) |

**Response (`200`):**
```json
{
  "start_date": "2026-01-05",
  "end_date": "2026-01-11",
  "total_sales": 128420,
  "total_orders": 214,
  "net_revenue": 96880,
  "average_order_value": 600,
  "items_sold": 1248,
  "currency": "PHP"
}
```

#### Sales Trend
```
GET /api/dashboard/sales-trend
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| start_date | string | Start date (YYYY-MM-DD) |
| end_date | string | End date (YYYY-MM-DD) |

**Response (`200`):**
```json
{
  "start_date": "2026-01-05",
  "end_date": "2026-01-11",
  "labels": ["2026-01-05", "2026-01-06"],
  "series": [
    { "name": "pos", "data": [12000, 15000] },
    { "name": "online", "data": [8000, 9500] }
  ],
  "channel_definition": {
    "pos": "Cash or card payments.",
    "online": "Online payments."
  }
}
```

#### Orders by Channel
```
GET /api/dashboard/orders-by-channel
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| start_date | string | Start date (YYYY-MM-DD) |
| end_date | string | End date (YYYY-MM-DD) |

**Response (`200`):**
```json
{
  "start_date": "2026-01-05",
  "end_date": "2026-01-11",
  "total_orders": 120,
  "channels": [
    { "channel": "pos", "orders_count": 74, "percentage": 61.67 },
    { "channel": "online", "orders_count": 46, "percentage": 38.33 }
  ],
  "channel_definition": {
    "pos": "Cash or card payments.",
    "online": "Online payments."
  }
}
```

#### Payment Methods Distribution
```
GET /api/dashboard/payment-methods
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| start_date | string | Start date (YYYY-MM-DD) |
| end_date | string | End date (YYYY-MM-DD) |

**Response (`200`):**
```json
{
  "start_date": "2026-01-05",
  "end_date": "2026-01-11",
  "total_amount": 96880,
  "methods": [
    { "method": "cash", "amount": 45200, "payments_count": 56, "percentage": 46.67 },
    { "method": "card", "amount": 35000, "payments_count": 40, "percentage": 36.13 },
    { "method": "online", "amount": 16680, "payments_count": 24, "percentage": 17.20 }
  ]
}
```

#### Top Products
```
GET /api/dashboard/top-products
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| start_date | string | Start date |
| end_date | string | End date |
| limit | integer | Number of products |

**Response (`200`):**
```json
{
  "start_date": "2026-01-05",
  "end_date": "2026-01-11",
  "items": [
    {
      "product_id": 1,
      "name": "Premium Rice 5kg",
      "units_sold": 52,
      "revenue": 15600,
      "currency": "PHP"
    }
  ]
}
```

#### Inventory Health
```
GET /api/dashboard/inventory-health
```
🔒 **Requires Authentication**

**Response (`200`):**
```json
{
  "total_items": 156,
  "breakdown": [
    { "status": "in_stock", "count": 120, "percentage": 76.92 },
    { "status": "low_stock", "count": 28, "percentage": 17.95 },
    { "status": "out_of_stock", "count": 8, "percentage": 5.13 }
  ]
}
```

#### Recent Activity
```
GET /api/dashboard/recent-activity
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| limit | integer | Number of items to return |

**Response (`200`):**
```json
{
  "items": [
    {
      "id": 1,
      "action": "create",
      "model_type": "App\\Models\\Order",
      "model_id": 42,
      "message": "Create Order #42",
      "created_at": "2026-01-11 09:10:00"
    }
  ]
}
```

#### Low Stock Alerts
```
GET /api/dashboard/low-stock-alerts
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| limit | integer | Number of items to return |

**Response (`200`):**
```json
{
  "items": [
    {
      "id": 1,
      "name": "PVC Pipe 1 inch",
      "stock": 4,
      "min_stock": 10,
      "status": "low_stock"
    }
  ]
}
```

#### Pending Orders
```
GET /api/dashboard/pending-orders
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| limit | integer | Number of items to return |

**Response (`200`):**
```json
{
  "items": [
    {
      "id": 1,
      "order_number": "ORD-10492",
      "customer": "Michael S.",
      "ordered_at": "2026-01-10",
      "items_count": 3,
      "total": 2560,
      "currency": "PHP",
      "status": "pending"
    }
  ]
}
```

---

### Inventory

#### List Inventory
```
GET /api/inventory
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | Search term |
| status | string | Filter by status (in_stock, low_stock, out_of_stock) |
| page | integer | Page number |
| per_page | integer | Items per page |

**Response (`200`):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Premium Rice 5kg",
      "sku": "GR-1001",
      "stock": 18,
      "min_stock": 10,
      "max_stock": 50,
      "status": "in_stock"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 120
  }
}
```

#### Inventory Summary
```
GET /api/inventory/summary
```
🔒 **Requires Authentication**

**Response (`200`):**
```json
{
  "total_items": 156,
  "low_stock_items": 8,
  "out_of_stock_items": 3
}
```

#### Adjust Stock
```
POST /api/inventory/adjustments
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| product_id | integer | ✅ | 1 |
| type | string | ✅ | "add" \| "remove" |
| quantity | integer | ✅ | 5 |
| note | string | ❌ | "Manual adjustment" |

**Response (`201`):**
```json
{
  "message": "Stock adjusted successfully.",
  "adjustment_id": 12,
  "inventory": {
    "id": 1,
    "name": "Premium Rice 5kg",
    "sku": "GR-1001",
    "stock": 23,
    "min_stock": 10,
    "max_stock": 50,
    "status": "in_stock"
  }
}
```

---

### Ledger

#### List Ledger Entries
```
GET /api/ledger
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | Filter by entry type (e.g., stock_in, stock_out, sale, expense) |
| category | string | Filter by category |
| product_id | integer | Filter by product ID |
| date_from | string | Start date filter (YYYY-MM-DD) |
| date_to | string | End date filter (YYYY-MM-DD) |
| search | string | Search term |
| page | integer | Page number |
| per_page | integer | Items per page |

**Response (`200`):**
```json
{
  "data": [
    {
      "id": 1,
      "type": "stock_in",
      "product_id": 1,
      "quantity": 10,
      "amount": 5000,
      "description": "Purchased new stock",
      "reference": "PO-001",
      "created_at": "2026-01-10T10:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 50
  }
}
```

#### Create Ledger Entry
```
POST /api/ledger
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| type | string | ✅ | "stock_in" |
| product_id | integer | ❌ | 1 |
| quantity | integer | ❌ | 10 |
| amount | integer | ❌ | 5000 |
| description | string | ✅ | "Purchased new stock" |
| reference | string | ❌ | "PO-001" |

**Response:** `201` - Ledger entry created

#### Ledger Summary
```
GET /api/ledger/summary
```
🔒 **Requires Authentication**

**Response (`200`):**
```json
{
  "total_entries": 150,
  "total_income": 500000,
  "total_expenses": 200000,
  "net_balance": 300000
}
```

---

### Orders

#### List Orders
```
GET /api/orders
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | Search term |
| status | string | Filter by status |
| page | integer | Page number |
| per_page | integer | Items per page |

**Response (`200`):**
```json
{
  "data": [
    {
      "id": 1,
      "order_number": "ORD-001",
      "customer": "John Dela Cruz",
      "ordered_at": "2026-01-10",
      "items_count": 5,
      "total": 2450,
      "currency": "PHP",
      "status": "pending"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 342
  }
}
```

#### Order Summary
```
GET /api/orders/summary
```
🔒 **Requires Authentication**

#### Get Order
```
GET /api/orders/{order}
```
🔒 **Requires Authentication**

#### Create Order
```
POST /api/orders
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| customer_id | integer | ❌ | 1 |
| ordered_at | string | ✅ | "2026-01-10" |
| status | string | ✅ | "pending" |
| items | array | ✅ | See below |

**Items Array:**
```json
[
  { "product_id": 1, "quantity": 2 },
  { "product_id": 5, "quantity": 1 }
]
```

> **Note:** `customer_id` is now optional. `ordered_at` and `status` are required.

#### Update Order Status
```
PATCH /api/orders/{order}
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| status | string | ❌ | "completed" \| "cancelled" \| "pending" |

> **Note:** This endpoint is specifically for updating order status. Other order fields cannot be modified after creation.

#### Delete Order
```
DELETE /api/orders/{order}
```
🔒 **Requires Authentication**

---

### Payments

#### List Payments
```
GET /api/payments
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | Search term |
| status | string | Filter by status |
| method | string | Filter by method (cash, card, online) |
| page | integer | Page number |
| per_page | integer | Items per page |

**Response (`200`):**
```json
{
  "data": [
    {
      "id": 1,
      "payment_number": "PAY-001",
      "order_id": 1,
      "customer": "John Dela Cruz",
      "paid_at": "2026-01-10 14:30",
      "amount": 2450,
      "currency": "PHP",
      "method": "cash",
      "status": "completed"
    }
  ]
}
```

#### Payment Summary
```
GET /api/payments/summary
```
🔒 **Requires Authentication**

**Response (`200`):**
```json
{
  "total_revenue": 125450,
  "cash_payments": 45200,
  "card_payments": 58750,
  "online_payments": 21500
}
```

#### Get Payment
```
GET /api/payments/{payment}
```
🔒 **Requires Authentication**

#### Create Payment
```
POST /api/payments
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| order_id | integer | ✅ | 1 |
| paid_at | string | ✅ | "2026-01-10 14:30" |
| amount | integer | ✅ | 2450 |
| method | string | ✅ | "cash" \| "card" \| "online" |
| status | string | ✅ | "completed" |

> **Important:** All fields are now required. `paid_at` must be datetime format "YYYY-MM-DD HH:mm". `amount` must be a rounded integer.

#### Update Payment
```
PATCH /api/payments/{payment}
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| paid_at | string | ❌ | "2026-01-10 15:00" |
| amount | integer | ❌ | 2500 |
| method | string | ❌ | "card" |
| status | string | ❌ | "refunded" |

#### Delete Payment
```
DELETE /api/payments/{payment}
```
🔒 **Requires Authentication**

**Response:** `204` - Deleted

---

### Products

#### List Authenticated User's Products (for POS)
```
GET /api/products/my
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | Search term |
| category_id | integer | Filter by category |
| min_price | integer | Minimum price filter |
| max_price | integer | Maximum price filter |
| in_stock | boolean | Filter in-stock items only |
| is_active | boolean | Filter by active status |
| sort | string | Sort field |
| direction | string | Sort direction (asc/desc) |
| page | integer | Page number |
| per_page | integer | Items per page |

**Response (`200`):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Premium Rice 5kg",
      "sku": "GR-1001",
      "price": 1250,
      "stock": 18
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 120
  }
}
```

> **Note:** `GET /api/products` (public product listing) and `GET /api/products/{product}` (public product detail) are not documented in the Swagger spec but may still be available. The frontend e-commerce pages use these endpoints.

#### Create Product
```
POST /api/products
```
🔒 **Requires Authentication**

**Request Body (multipart/form-data):**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| name | string | ✅ | "Premium Rice 5kg" |
| sku | string | ✅ | "GR-1001" |
| category_id | integer | ✅ | 3 |
| price | integer | ✅ | 1250 |
| currency | string | ✅ | "PHP" |
| stock | integer | ✅ | 18 |
| is_active | boolean | ❌ | true |
| is_ecommerce | boolean | ❌ | true |
| image | file | ❌ | (binary) |

> **Updated:** `currency` and `stock` are now required fields.

#### Update Product
```
PATCH /api/products/{product}
```
🔒 **Requires Authentication**

**Request Body (multipart/form-data):**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| name | string | ❌ | "Premium Rice 10kg" |
| sku | string | ❌ | "GR-1002" |
| category_id | integer | ❌ | 3 |
| price | integer | ❌ | 2500 |
| currency | string | ❌ | "PHP" |
| stock | integer | ❌ | 25 |
| is_active | boolean | ❌ | true |
| is_ecommerce | boolean | ❌ | true |
| image | file | ❌ | (binary) |

#### Update Product Stock
```
PATCH /api/products/{product}/stock
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| stock | integer | ✅ | 50 |

**Response (`200`):** Updated product with new stock value

#### Delete Product
```
DELETE /api/products/{product}
```
🔒 **Requires Authentication**

#### Bulk Stock Decrement
```
POST /api/products/bulk-stock-decrement
```
🔒 **Requires Authentication**

**Request Body:**
```json
{
  "items": [
    { "productId": 1, "quantity": 2, "variantSku": null },
    { "productId": 5, "quantity": 1, "variantSku": "VAR-001" }
  ],
  "orderId": "ORD-001"
}
```

---

### Stores

#### List Stores
```
GET /api/stores
```
🔒 **Requires Authentication**

**Response (`200`):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Main Store",
      "code": "MAIN-001",
      "address": "123 Main St",
      "phone": "+63 912 345 6789",
      "email": "store@example.com",
      "is_active": true
    }
  ]
}
```

#### Get Store
```
GET /api/stores/{store}
```
🔒 **Requires Authentication**

#### Create Store
```
POST /api/stores
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| name | string | ✅ | "Main Store" |
| code | string | ✅ | "MAIN-001" |
| address | string | ❌ | "123 Main St" |
| phone | string | ❌ | "+63 912 345 6789" |
| email | string | ❌ | "store@example.com" |
| is_active | boolean | ❌ | true |
| settings | object | ❌ | `{}` |

#### Update Store
```
PATCH /api/stores/{store}
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| name | string | ❌ | "Main Store Updated" |
| code | string | ❌ | "MAIN-002" |
| address | string | ❌ | "456 New St" |
| phone | string | ❌ | "+63 912 345 6789" |
| email | string | ❌ | "newstore@example.com" |
| is_active | boolean | ❌ | true |
| settings | object | ❌ | `{}` |

#### Delete Store
```
DELETE /api/stores/{store}
```
🔒 **Requires Authentication**

---

### Store Products

#### List Store Products
```
GET /api/stores/{store}/products
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | Search term |
| is_available | boolean | Filter by availability |
| low_stock | boolean | Filter low stock items |
| sort | string | Sort field |
| direction | string | Sort direction (asc/desc) |
| per_page | integer | Items per page |

**Response (`200`):**
```json
{
  "data": [
    {
      "id": 1,
      "product_id": 5,
      "store_id": 1,
      "stock": 50,
      "min_stock": 10,
      "max_stock": 100,
      "price_override": 1500,
      "is_available": true,
      "product": {
        "id": 5,
        "name": "Premium Rice 5kg",
        "sku": "GR-1001",
        "price": 1250
      }
    }
  ]
}
```

#### Get Store Product
```
GET /api/stores/{store}/products/{product}
```
🔒 **Requires Authentication**

**Response (`200`):**
```json
{
  "id": 1,
  "product_id": 5,
  "store_id": 1,
  "stock": 50,
  "min_stock": 10,
  "max_stock": 100,
  "price_override": 1500,
  "is_available": true
}
```

#### Add Product to Store
```
POST /api/stores/{store}/products
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| product_id | integer | ✅ | 5 |
| stock | integer | ❌ | 50 |
| min_stock | integer | ❌ | 10 |
| max_stock | integer | ❌ | 100 |
| price_override | integer | ❌ | 1500 |
| is_available | boolean | ❌ | true |

#### Update Store Product
```
PATCH /api/stores/{store}/products/{product}
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| stock | integer | ❌ | 60 |
| min_stock | integer | ❌ | 15 |
| max_stock | integer | ❌ | 120 |
| price_override | integer | ❌ | 1600 |
| is_available | boolean | ❌ | true |

#### Remove Product from Store
```
DELETE /api/stores/{store}/products/{product}
```
🔒 **Requires Authentication**

---

### Store Staff

#### Get Available Store Roles
```
GET /api/store-roles
```
🔒 **Requires Authentication**

**Response (`200`):**
```json
{
  "data": [
    {
      "value": "cashier",
      "label": "Cashier",
      "permissions": ["view_orders", "create_orders"]
    },
    {
      "value": "manager",
      "label": "Store Manager",
      "permissions": ["view_orders", "create_orders", "manage_inventory"]
    }
  ]
}
```

#### List Store Staff
```
GET /api/stores/{store}/staff
```
🔒 **Requires Authentication**

**Response (`200`):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "staff@example.com",
      "role": "cashier"
    }
  ]
}
```

#### Add Staff Member
```
POST /api/stores/{store}/staff
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| email | string (email) | ✅ | "staff@example.com" |
| role | string | ✅ | "cashier" |
| permissions | array | ❌ | ["view_orders", "create_orders"] |

#### Update Staff Member
```
PATCH /api/stores/{store}/staff/{user}
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| role | string | ❌ | "manager" |
| permissions | array | ❌ | ["view_orders", "create_orders", "manage_inventory"] |

#### Remove Staff Member
```
DELETE /api/stores/{store}/staff/{user}
```
🔒 **Requires Authentication**

---

### User

#### Get Authenticated User
```
GET /api/user
```
🔒 **Requires Authentication**

**Response (`200`):**
```json
{
  "id": 1,
  "name": "Vendor Corp",
  "business_name": "Vendor Corp",
  "email": "vendor@example.com",
  "subscription_plan": "basic",
  "user_type": "vendor",
  "stores": [
    { "id": 1, "name": "Main Store", "code": "MAIN-001" }
  ],
  "assigned_stores": [
    { "id": 2, "name": "Branch Store", "role": "cashier" }
  ],
  "created_at": "2026-01-10T10:00:00Z",
  "updated_at": "2026-01-10T10:00:00Z"
}
```

---

## Error Responses

| Code | Description |
|------|-------------|
| 401 | Unauthenticated - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 422 | Validation Error - Invalid request data |

**Validation Error Response:**
```json
{
  "message": "The email field is required.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

---

## API Categories Summary

| Category | Description |
|----------|-------------|
| Admin - Users | Admin user management (CRUD + status) |
| Admin - Vendors | Vendor creation (admin only) |
| Auth | Authentication endpoints |
| Category | Category endpoints |
| Customer | Customer endpoints |
| Dashboard | Dashboard KPIs, charts, and alerts |
| Inventory | Inventory management and adjustments |
| Ledger | Financial ledger entries and summaries |
| Order | Order endpoints |
| Payment | Payment endpoints |
| Product | Product endpoints (including vendor-specific) |
| Store | Store management endpoints |
| Store Product | Store-specific product management |
| Store Staff | Store staff and role management |
| User | Authenticated user profile |
