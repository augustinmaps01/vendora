# VENDORA API Documentation

> **Base URL:** `https://vendora-api.abedubas.dev`
> **Swagger UI:** https://vendora-api.abedubas.dev/api/documentation#/
> **OpenAPI Spec:** https://vendora-api.abedubas.dev/api/docs?api-docs.json
> **API Version:** 1.0.0
> **Last Updated:** 2026-03-04 (synced from live backend - includes Credits, Cash vs Credit, Profile Update, Change Password endpoints)

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
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| search | string | ❌ | Search by name or email |
| user_type | string | ❌ | Filter by user type (admin\|vendor\|manager\|cashier\|buyer) |
| status | string | ❌ | Filter by status (active\|inactive\|suspended) |
| per_page | integer | ❌ | Items per page |

**Responses:**
- **200**: List of users
- **401**: Unauthenticated
- **403**: Forbidden

---

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

**Responses:**
- **201**: User created successfully
- **401**: Unauthenticated
- **403**: Forbidden
- **422**: Validation error

---

#### Get User (Admin only)
```
GET /api/admin/users/{id}
```
🔒 **Requires Authentication (Admin)**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| id | integer | ✅ |

**Responses:**
- **200**: User details
- **401**: Unauthenticated
- **403**: Forbidden
- **404**: User not found

---

#### Update User (Admin only)
```
PUT /api/admin/users/{id}
```
🔒 **Requires Authentication (Admin)**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| id | integer | ✅ |

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| name | string | ❌ | "John Doe" |
| email | string (email) | ❌ | "john@example.com" |
| password | string | ❌ | "newpassword" |
| user_type | string | ❌ | "vendor" |
| phone | string | ❌ | "+63 912 345 6789" |
| status | string | ❌ | "active" |

**Responses:**
- **200**: User updated successfully
- **401**: Unauthenticated
- **403**: Forbidden
- **404**: User not found
- **422**: Validation error

---

#### Delete User (Admin only)
```
DELETE /api/admin/users/{id}
```
🔒 **Requires Authentication (Admin)**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| id | integer | ✅ |

**Responses:**
- **200**: User deleted successfully
- **401**: Unauthenticated
- **403**: Forbidden
- **404**: User not found

---

#### Change User Status (Admin only)
```
PATCH /api/admin/users/{id}/status
```
🔒 **Requires Authentication (Admin)**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| id | integer | ✅ |

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| status | string (enum) | ✅ | "active" \| "inactive" \| "suspended" |

**Responses:**
- **200**: Status updated successfully
- **401**: Unauthenticated
- **403**: Forbidden
- **404**: User not found
- **422**: Validation error

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

**Responses:**
- **201**: Vendor created successfully
- **401**: Unauthenticated
- **403**: Forbidden - Admin access required
- **422**: Validation error

---

### Auth

#### Register
```
POST /api/auth/register
```
> ⚠️ **Note:** This endpoint registers a **buyer** account only (`user_type` is always "buyer"). To create a vendor account, use `POST /api/admin/vendors` (admin-required) or ask the backend to support `user_type` in this endpoint.

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

**Responses:**
- **201**: Registration successful
- **422**: Validation error

---

#### Login
```
POST /api/auth/login
```

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| email | string (email) | ✅ |
| password | string | ✅ |

**Response (`200`):**
```json
{
  "message": "Login successful",
  "token": "1|abc123...",
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
    "assigned_stores": []
  }
}
```

**Responses:**
- **200**: Login successful
- **401**: Invalid credentials
- **422**: Validation error

---

#### Logout
```
POST /api/auth/logout
```
🔒 **Requires Authentication**

**Responses:**
- **200**: Logged out successfully
- **401**: Unauthenticated

---

### Categories

#### List Categories (Public)
```
GET /api/categories
```

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| is_active | boolean | ❌ | Filter by active status |
| with_count | boolean | ❌ | Include product count |

**Response (`200`):**
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic products",
    "icon": "laptop",
    "is_active": true,
    "product_count": 25
  }
]
```

**Responses:**
- **200**: Category list

---

#### Get Category (Public)
```
GET /api/categories/{category}
```

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| category | integer | ✅ |

**Responses:**
- **200**: Category details
- **404**: Not found

---

#### Create Category
```
POST /api/categories
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| name | string | ✅ |
| description | string | ❌ |
| icon | string | ❌ |
| is_active | boolean | ❌ |

**Responses:**
- **201**: Category created
- **401**: Unauthenticated
- **422**: Validation error

---

#### Update Category
```
PATCH /api/categories/{category}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| category | integer | ✅ |

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| name | string | ❌ |
| description | string | ❌ |
| icon | string | ❌ |
| is_active | boolean | ❌ |

**Responses:**
- **200**: Category updated
- **401**: Unauthenticated
- **404**: Not found
- **422**: Validation error

---

#### Delete Category
```
DELETE /api/categories/{category}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| category | integer | ✅ |

**Responses:**
- **204**: Deleted
- **401**: Unauthenticated
- **404**: Not found
- **409**: Cannot delete - has products

---

### Customers

#### List Customers
```
GET /api/customers
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| search | string | ❌ | Search by name/email/phone |
| status | string | ❌ | Filter by status |
| sort | string | ❌ | Sort field |
| direction | string | ❌ | asc \| desc |
| page | integer | ❌ | Page number |
| per_page | integer | ❌ | Items per page |

**Responses:**
- **200**: Paginated customer list with meta
- **401**: Unauthenticated

---

#### Get Customer Summary
```
GET /api/customers/summary
```
🔒 **Requires Authentication**

**Response (`200`):**
```json
{
  "total_customers": 150,
  "active": 120,
  "vip": 30,
  "inactive": 0
}
```

**Responses:**
- **200**: Customer summary
- **401**: Unauthenticated

---

#### Get Customer
```
GET /api/customers/{customer}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| customer | integer | ✅ |

**Responses:**
- **200**: Customer details
- **401**: Unauthenticated
- **404**: Not found

---

#### Create Customer
```
POST /api/customers
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| name | string | ✅ | "John Doe" |
| email | string (email) | ❌ | "john@example.com" |
| phone | string | ❌ | "+63 912 345 6789" |
| status | string | ✅ | "active" |

**Responses:**
- **201**: Customer created
- **401**: Unauthenticated
- **422**: Validation error

---

#### Update Customer
```
PATCH /api/customers/{customer}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| customer | integer | ✅ |

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| name | string | ❌ |
| email | string | ❌ |
| phone | string | ❌ |
| status | string | ❌ |

**Responses:**
- **200**: Customer updated
- **401**: Unauthenticated
- **404**: Not found
- **422**: Validation error

---

#### Delete Customer
```
DELETE /api/customers/{customer}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| customer | integer | ✅ |

**Responses:**
- **204**: Deleted
- **401**: Unauthenticated
- **404**: Not found

---

#### Get Customer Credit History
```
GET /api/customers/{customer}/credits
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| customer | integer | ✅ |

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| page | integer | ❌ | Page number |
| per_page | integer | ❌ | Items per page |

**Responses:**
- **200**: Paginated credit history for customer
- **401**: Unauthenticated
- **404**: Customer not found

---

### Credits

#### List Credit Transactions
```
GET /api/credits
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| customer_id | integer | ❌ | Filter by customer |
| status | string | ❌ | Filter by status |
| page | integer | ❌ | Page number |
| per_page | integer | ❌ | Items per page |

**Responses:**
- **200**: Paginated credit transactions list
- **401**: Unauthenticated

---

#### Issue Credit to Customer
```
POST /api/credits
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| customer_id | integer | ✅ | Customer to credit |
| amount | integer | ✅ | Credit amount |
| reference | string | ❌ | Reference number |
| notes | string | ❌ | Notes/description |

**Responses:**
- **201**: Credit issued
- **401**: Unauthenticated
- **422**: Validation error

---

#### Record Credit Payment
```
POST /api/credits/{id}/payment
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| id | integer | ✅ |

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| amount | integer | ✅ | Payment amount |
| method | string | ✅ | Payment method |

**Responses:**
- **200**: Credit payment recorded
- **401**: Unauthenticated
- **404**: Credit not found
- **422**: Validation error

---

### Dashboard

#### KPI Cards
```
GET /api/dashboard/kpis
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required |
|-------|------|----------|
| start_date | string | ❌ |
| end_date | string | ❌ |

**Response (`200`):**
```json
{
  "total_sales": 45000,
  "total_orders": 120,
  "net_revenue": 40500,
  "average_order_value": 375,
  "items_sold": 350,
  "currency": "PHP"
}
```

**Responses:**
- **200**: KPI summary
- **401**: Unauthenticated
- **422**: Validation error

---

#### Sales Trend
```
GET /api/dashboard/sales-trend
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required |
|-------|------|----------|
| start_date | string | ❌ |
| end_date | string | ❌ |

**Response (`200`):**
```json
{
  "labels": ["Jan 1", "Jan 2"],
  "series": {
    "pos": [1200, 1500],
    "online": [800, 900]
  },
  "channel_definition": { "pos": "In-store", "online": "E-commerce" }
}
```

**Responses:**
- **200**: Sales trend data
- **401**: Unauthenticated
- **422**: Validation error

---

#### Orders by Channel
```
GET /api/dashboard/orders-by-channel
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required |
|-------|------|----------|
| start_date | string | ❌ |
| end_date | string | ❌ |

**Response (`200`):**
```json
{
  "total_orders": 120,
  "channels": [
    { "name": "pos", "count": 80, "percentage": 66.7 },
    { "name": "online", "count": 40, "percentage": 33.3 }
  ],
  "channel_definition": { "pos": "In-store", "online": "E-commerce" }
}
```

**Responses:**
- **200**: Orders by channel
- **401**: Unauthenticated
- **422**: Validation error

---

#### Payment Methods Distribution
```
GET /api/dashboard/payment-methods
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required |
|-------|------|----------|
| start_date | string | ❌ |
| end_date | string | ❌ |

**Response (`200`):**
```json
{
  "total_amount": 45000,
  "methods": [
    { "method": "cash", "amount": 25000, "count": 70, "percentage": 55.6 },
    { "method": "card", "amount": 15000, "count": 35, "percentage": 33.3 }
  ]
}
```

**Responses:**
- **200**: Payment methods distribution
- **401**: Unauthenticated
- **422**: Validation error

---

#### Cash vs Credit Breakdown
```
GET /api/dashboard/cash-vs-credit
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required |
|-------|------|----------|
| start_date | string | ❌ |
| end_date | string | ❌ |

**Response (`200`):**
```json
{
  "total_amount": 45000,
  "cash": {
    "amount": 30000,
    "percentage": 66.7,
    "count": 80
  },
  "credit": {
    "amount": 15000,
    "percentage": 33.3,
    "count": 40
  },
  "outstanding_credit": 5000
}
```

**Responses:**
- **200**: Cash vs credit breakdown
- **401**: Unauthenticated
- **422**: Validation error

---

#### Top Products
```
GET /api/dashboard/top-products
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required |
|-------|------|----------|
| start_date | string | ❌ |
| end_date | string | ❌ |
| limit | integer | ❌ |

**Response (`200`):**
```json
{
  "items": [
    { "product_id": 1, "name": "Product A", "units_sold": 50, "revenue": 15000, "currency": "PHP" }
  ]
}
```

**Responses:**
- **200**: Top products
- **401**: Unauthenticated
- **422**: Validation error

---

#### Inventory Health
```
GET /api/dashboard/inventory-health
```
🔒 **Requires Authentication**

**Response (`200`):**
```json
{
  "total_items": 200,
  "breakdown": [
    { "status": "in_stock", "count": 150, "percentage": 75 },
    { "status": "low_stock", "count": 30, "percentage": 15 },
    { "status": "out_of_stock", "count": 20, "percentage": 10 }
  ]
}
```

**Responses:**
- **200**: Inventory health
- **401**: Unauthenticated

---

#### Low Stock Alerts
```
GET /api/dashboard/low-stock-alerts
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required |
|-------|------|----------|
| limit | integer | ❌ |

**Response (`200`):**
```json
{
  "items": [
    { "id": 1, "name": "Product A", "stock": 3, "min_stock": 10, "status": "low_stock" }
  ]
}
```

**Responses:**
- **200**: Low stock alerts
- **401**: Unauthenticated
- **422**: Validation error

---

#### Recent Activity
```
GET /api/dashboard/recent-activity
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required |
|-------|------|----------|
| limit | integer | ❌ |

**Responses:**
- **200**: Recent activity feed
- **401**: Unauthenticated
- **422**: Validation error

---

#### Pending Orders
```
GET /api/dashboard/pending-orders
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required |
|-------|------|----------|
| limit | integer | ❌ |

**Responses:**
- **200**: Pending orders list
- **401**: Unauthenticated
- **422**: Validation error

---

### Inventory

#### List Inventory
```
GET /api/inventory
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| search | string | ❌ | Search by product name/SKU |
| status | string | ❌ | Filter by stock status |
| sort | string | ❌ | Sort field |
| direction | string | ❌ | asc \| desc |
| page | integer | ❌ | Page number |
| per_page | integer | ❌ | Items per page |

**Responses:**
- **200**: Inventory list
- **401**: Unauthenticated

---

#### Create Inventory Record
```
POST /api/inventory
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| product_id | integer | ✅ | Product to track |
| quantity | integer | ✅ | Current quantity |
| reorder_level | integer | ❌ | Reorder threshold |
| status | string | ❌ | Inventory status |

**Responses:**
- **201**: Inventory record created
- **401**: Unauthenticated
- **422**: Validation error

---

#### Inventory Summary
```
GET /api/inventory/summary
```
🔒 **Requires Authentication**

**Responses:**
- **200**: Inventory summary cards
- **401**: Unauthenticated

---

#### Get Inventory Item
```
GET /api/inventory/{id}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| id | integer | ✅ |

**Responses:**
- **200**: Inventory item details
- **401**: Unauthenticated
- **404**: Not found

---

#### Update Inventory Record
```
PATCH /api/inventory/{id}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| id | integer | ✅ |

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| quantity | integer | ❌ | Updated quantity |
| reorder_level | integer | ❌ | Updated reorder threshold |
| status | string | ❌ | Updated status |

**Responses:**
- **200**: Inventory record updated
- **401**: Unauthenticated
- **404**: Not found
- **422**: Validation error

---

#### Adjust Stock
```
POST /api/inventory/adjustments
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| product_id | integer | ✅ | Product to adjust |
| type | string | ✅ | Adjustment type (add/remove/set) |
| quantity | integer | ✅ | Quantity to adjust |
| note | string | ❌ | Reason for adjustment |

**Responses:**
- **201**: Stock adjusted
- **401**: Unauthenticated
- **404**: Product not found
- **422**: Validation error

---

### Ledger

#### List Ledger Entries
```
GET /api/ledger
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | ❌ | Filter by entry type |
| category | string | ❌ | Filter by category |
| product_id | integer | ❌ | Filter by product |
| date_from | string | ❌ | Start date (YYYY-MM-DD) |
| date_to | string | ❌ | End date (YYYY-MM-DD) |
| search | string | ❌ | Search term |
| page | integer | ❌ | Page number |
| per_page | integer | ❌ | Items per page |

**Responses:**
- **200**: Ledger entries list
- **401**: Unauthenticated

---

#### Ledger Summary
```
GET /api/ledger/summary
```
🔒 **Requires Authentication**

**Responses:**
- **200**: Ledger summary totals
- **401**: Unauthenticated

---

#### Create Ledger Entry
```
POST /api/ledger
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | ✅ | Entry type |
| product_id | integer | ❌ | Associated product |
| quantity | integer | ❌ | Quantity |
| amount | integer | ❌ | Amount in cents |
| description | string | ✅ | Entry description |
| reference | string | ❌ | Reference number |

**Responses:**
- **201**: Ledger entry created
- **401**: Unauthenticated
- **422**: Validation error

---

### Orders

#### List Orders
```
GET /api/orders
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| search | string | ❌ | Search by order number/customer |
| status | string | ❌ | Filter by status |
| channel | string | ❌ | Filter by channel (pos/online) |
| sort | string | ❌ | Sort field |
| direction | string | ❌ | asc \| desc |
| page | integer | ❌ | Page number |
| per_page | integer | ❌ | Items per page |

**Responses:**
- **200**: Order list
- **401**: Unauthenticated

---

#### Order Summary
```
GET /api/orders/summary
```
🔒 **Requires Authentication**

**Responses:**
- **200**: Order summary cards
- **401**: Unauthenticated

---

#### Get Order
```
GET /api/orders/{order}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| order | integer | ✅ |

**Responses:**
- **200**: Order details
- **401**: Unauthenticated
- **404**: Not found

---

#### Create Order
```
POST /api/orders
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| customer_id | integer | ❌ | 1 |
| store_id | integer | ❌ | 1 |
| ordered_at | string | ✅ | "2026-02-10" (YYYY-MM-DD) |
| status | string | ✅ | "pending" |
| channel | string | ❌ | "pos" \| "online" |
| notes | string | ❌ | "Special instructions" |
| items | array | ✅ | `[{ "product_id": 1, "quantity": 2 }]` |

**Responses:**
- **201**: Order created
- **401**: Unauthenticated
- **422**: Validation error

---

#### Update Order
```
PATCH /api/orders/{order}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| order | integer | ✅ |

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| status | string | ❌ |
| notes | string | ❌ |

**Responses:**
- **200**: Order updated
- **401**: Unauthenticated
- **404**: Not found
- **422**: Validation error

---

#### Delete Order
```
DELETE /api/orders/{order}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| order | integer | ✅ |

**Responses:**
- **204**: Deleted
- **401**: Unauthenticated
- **404**: Not found

---

### Payments

#### List Payments
```
GET /api/payments
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| search | string | ❌ | Search term |
| status | string | ❌ | Filter by status |
| method | string | ❌ | Filter by payment method |
| sort | string | ❌ | Sort field |
| direction | string | ❌ | asc \| desc |
| page | integer | ❌ | Page number |
| per_page | integer | ❌ | Items per page |

**Responses:**
- **200**: Payment list
- **401**: Unauthenticated

---

#### Payment Summary
```
GET /api/payments/summary
```
🔒 **Requires Authentication**

**Responses:**
- **200**: Payment summary cards
- **401**: Unauthenticated

---

#### Get Payment
```
GET /api/payments/{payment}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| payment | integer | ✅ |

**Responses:**
- **200**: Payment details
- **401**: Unauthenticated
- **404**: Not found

---

#### Create Payment
```
POST /api/payments
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| order_id | integer | ✅ | Associated order |
| paid_at | string | ✅ | "YYYY-MM-DD HH:mm" datetime format |
| amount | integer | ✅ | Amount in cents (use Math.round()) |
| method | string | ✅ | "cash" \| "card" \| "online" |
| status | string | ✅ | "completed" \| "pending" \| "failed" |
| reference | string | ❌ | Payment reference number |

> ⚠️ **Critical**: `paid_at` must be datetime format `"YYYY-MM-DD HH:mm"`, never date-only.

**Responses:**
- **201**: Payment created
- **401**: Unauthenticated
- **422**: Validation error

---

#### Update Payment
```
PATCH /api/payments/{payment}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| payment | integer | ✅ |

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| paid_at | string | ❌ |
| amount | integer | ❌ |
| method | string | ❌ |
| status | string | ❌ |

**Responses:**
- **200**: Payment updated
- **401**: Unauthenticated
- **404**: Not found
- **422**: Validation error

---

#### Delete Payment
```
DELETE /api/payments/{payment}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| payment | integer | ✅ |

**Responses:**
- **204**: Deleted
- **401**: Unauthenticated
- **404**: Not found

---

### Products

#### List All Products (Public)
```
GET /api/products
```

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| search | string | ❌ | Search by name/SKU |
| category_id | integer | ❌ | Filter by category |
| status | string | ❌ | Filter by status |
| sort | string | ❌ | Sort field |
| page | integer | ❌ | Page number |
| per_page | integer | ❌ | Items per page |

**Responses:**
- **200**: Paginated product list

---

#### List Authenticated User's Products (for POS)
```
GET /api/products/my
```
🔒 **Requires Authentication**

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| search | string | ❌ | Search by name/SKU |
| category_id | integer | ❌ | Filter by category |
| min_price | integer | ❌ | Minimum price filter |
| max_price | integer | ❌ | Maximum price filter |
| in_stock | boolean | ❌ | Filter in-stock only |
| is_active | boolean | ❌ | Filter active products |
| sort | string | ❌ | Sort field |
| direction | string | ❌ | asc \| desc |
| page | integer | ❌ | Page number |
| per_page | integer | ❌ | Items per page (use 500 for POS) |

**Responses:**
- **200**: Product list
- **401**: Unauthenticated

---

#### Create Product
```
POST /api/products
```
🔒 **Requires Authentication**

> Use `api.upload()` (multipart/form-data) for image uploads.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | ✅ | Product name |
| sku | string | ✅ | Unique SKU |
| category_id | integer | ✅ | Category ID |
| price | integer | ✅ | Price in cents |
| cost | integer | ❌ | Cost price in cents |
| currency | string | ✅ | e.g. "PHP" |
| stock | integer | ✅ | Initial stock quantity |
| description | string | ❌ | Product description |
| is_active | boolean | ❌ | Defaults to true |
| is_ecommerce | boolean | ❌ | Show in e-commerce |
| image | file | ❌ | Product image file |

**Responses:**
- **201**: Product created
- **401**: Unauthenticated
- **422**: Validation error

---

#### Update Product
```
PATCH /api/products/{product}
```
🔒 **Requires Authentication**

> Use `api.upload()` (multipart/form-data) when updating images.

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| product | integer | ✅ |

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| name | string | ❌ |
| sku | string | ❌ |
| category_id | integer | ❌ |
| price | integer | ❌ |
| currency | string | ❌ |
| stock | integer | ❌ |
| is_active | boolean | ❌ |
| is_ecommerce | boolean | ❌ |
| image | file | ❌ |

**Responses:**
- **200**: Product updated
- **401**: Unauthenticated
- **404**: Not found
- **422**: Validation error

---

#### Update Product Stock
```
PATCH /api/products/{product}/stock
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| product | integer | ✅ |

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| stock | integer | ✅ |

**Responses:**
- **200**: Stock updated
- **401**: Unauthenticated
- **404**: Not found
- **422**: Validation error

---

#### Delete Product
```
DELETE /api/products/{product}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| product | integer | ✅ |

**Responses:**
- **204**: Deleted
- **401**: Unauthenticated
- **404**: Not found

---

#### Bulk Stock Decrement
```
POST /api/products/bulk-stock-decrement
```
🔒 **Requires Authentication**

> Used after POS transactions to update inventory (non-blocking, silent fail OK).

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| items | array | ✅ | `[{ "productId": 1, "quantity": 2, "variantSku": null }]` |
| orderId | string | ❌ | Transaction reference |

**Responses:**
- **200**: Stock decremented
- **401**: Unauthenticated
- **422**: Validation error

---

### Stores

#### List Stores
```
GET /api/stores
```
🔒 **Requires Authentication**

**Responses:**
- **200**: Store list (stores the user has access to)
- **401**: Unauthenticated

---

#### Create Store
```
POST /api/stores
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| name | string | ✅ |
| code | string | ✅ |
| address | string | ❌ |
| phone | string | ❌ |
| email | string | ❌ |
| is_active | boolean | ❌ |
| settings | object | ❌ |

**Responses:**
- **201**: Store created
- **401**: Unauthenticated
- **422**: Validation error

---

#### Get Store
```
GET /api/stores/{store}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| store | integer | ✅ |

**Responses:**
- **200**: Store details
- **401**: Unauthenticated
- **403**: Forbidden
- **404**: Not found

---

#### Update Store
```
PATCH /api/stores/{store}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| store | integer | ✅ |

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| name | string | ❌ |
| code | string | ❌ |
| address | string | ❌ |
| phone | string | ❌ |
| email | string | ❌ |
| is_active | boolean | ❌ |
| settings | object | ❌ |

**Responses:**
- **200**: Store updated
- **401**: Unauthenticated
- **403**: Forbidden
- **404**: Not found
- **422**: Validation error

---

#### Delete Store
```
DELETE /api/stores/{store}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| store | integer | ✅ |

**Responses:**
- **204**: Deleted
- **401**: Unauthenticated
- **403**: Forbidden
- **404**: Not found

---

### Store Products

#### List Store Products
```
GET /api/stores/{store}/products
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| store | integer | ✅ |

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| search | string | ❌ | Search by name/SKU |
| is_available | boolean | ❌ | Filter available products |
| low_stock | boolean | ❌ | Filter low stock |
| sort | string | ❌ | Sort field |
| direction | string | ❌ | asc \| desc |
| per_page | integer | ❌ | Items per page |

**Responses:**
- **200**: Store product list
- **401**: Unauthenticated
- **403**: Forbidden

---

#### Get Store Product
```
GET /api/stores/{store}/products/{product}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| store | integer | ✅ |
| product | integer | ✅ |

**Responses:**
- **200**: Store product details
- **401**: Unauthenticated
- **403**: Forbidden
- **404**: Product not found in store

---

#### Add Product to Store
```
POST /api/stores/{store}/products
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| store | integer | ✅ |

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| product_id | integer | ✅ | Product to add |
| stock | integer | ❌ | Store-specific stock |
| min_stock | integer | ❌ | Minimum stock threshold |
| max_stock | integer | ❌ | Maximum stock threshold |
| price_override | integer | ❌ | Override product price |
| is_available | boolean | ❌ | Available for sale |

**Responses:**
- **201**: Product added to store
- **401**: Unauthenticated
- **403**: Forbidden
- **404**: Product not found
- **422**: Validation error or product already added

---

#### Update Store Product
```
PATCH /api/stores/{store}/products/{product}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| store | integer | ✅ |
| product | integer | ✅ |

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| stock | integer | ❌ |
| min_stock | integer | ❌ |
| max_stock | integer | ❌ |
| price_override | integer | ❌ |
| is_available | boolean | ❌ |

**Responses:**
- **200**: Store product updated
- **401**: Unauthenticated
- **403**: Forbidden
- **404**: Product not found in store
- **422**: Validation error

---

#### Remove Product from Store
```
DELETE /api/stores/{store}/products/{product}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| store | integer | ✅ |
| product | integer | ✅ |

**Responses:**
- **204**: Product removed from store
- **401**: Unauthenticated
- **403**: Forbidden
- **404**: Product not found in store

---

### Store Staff

#### Get Available Store Roles
```
GET /api/store-roles
```
🔒 **Requires Authentication**

**Responses:**
- **200**: Available roles list
- **401**: Unauthenticated

---

#### List Store Staff
```
GET /api/stores/{store}/staff
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| store | integer | ✅ |

**Responses:**
- **200**: Staff list
- **401**: Unauthenticated
- **403**: Forbidden

---

#### Add Staff Member (existing user)
```
POST /api/stores/{store}/staff
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| store | integer | ✅ |

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | ✅ | Email of existing user |
| role | string | ✅ | Role to assign |
| permissions | array | ❌ | Additional permissions |

**Responses:**
- **201**: Staff member added
- **401**: Unauthenticated
- **403**: Forbidden
- **404**: User not found
- **422**: Validation error or user already staff

---

#### Create Staff Member (new user)
```
POST /api/stores/{store}/staff/create
```
🔒 **Requires Authentication**

> Creates a new user account and assigns them as staff in one step.

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| store | integer | ✅ |

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| name | string | ✅ |
| email | string | ✅ |
| password | string | ✅ |
| phone | string | ❌ |
| role | string | ✅ |
| permissions | array | ❌ |

**Responses:**
- **201**: User created and assigned as staff
- **401**: Unauthenticated
- **403**: Forbidden
- **422**: Validation error

---

#### Update Staff Member
```
PATCH /api/stores/{store}/staff/{user}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| store | integer | ✅ |
| user | integer | ✅ |

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| role | string | ❌ |
| permissions | array | ❌ |

**Responses:**
- **200**: Staff member updated
- **401**: Unauthenticated
- **403**: Forbidden
- **404**: User not a staff member
- **422**: Validation error

---

#### Remove Staff Member
```
DELETE /api/stores/{store}/staff/{user}
```
🔒 **Requires Authentication**

**Path Parameters:**
| Param | Type | Required |
|-------|------|----------|
| store | integer | ✅ |
| user | integer | ✅ |

**Responses:**
- **204**: Staff member removed
- **401**: Unauthenticated
- **403**: Forbidden
- **404**: User not a staff member

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
  "assigned_stores": []
}
```

**Responses:**
- **200**: Authenticated user with stores
- **401**: Unauthenticated

---

#### Update Own Profile
```
PATCH /api/user
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | ❌ | Updated name |
| email | string | ❌ | Updated email |
| phone | string | ❌ | Updated phone |
| password | string | ❌ | Updated password |

**Responses:**
- **200**: Profile updated
- **401**: Unauthenticated
- **422**: Validation error

---

#### Change Password
```
POST /api/user/change-password
```
🔒 **Requires Authentication**

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| current_password | string | ✅ | Current password |
| new_password | string | ✅ | New password |
| new_password_confirmation | string | ✅ | Confirm new password |

**Responses:**
- **200**: Password changed successfully
- **401**: Unauthenticated
- **422**: Validation error (wrong current password or mismatch)

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `204` - No Content (successful delete)
- `401` - Unauthenticated (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., deleting a category with products)
- `422` - Validation Error

---

## API Categories Summary

| Category | Endpoints | Auth Required |
|----------|-----------|---------------|
| Auth | 3 | Partial |
| Admin - Users | 6 | Admin only |
| Admin - Vendors | 1 | Admin only |
| Categories | 5 | Partial (GET public) |
| Credits | 3 | ✅ |
| Customers | 7 | ✅ |
| Dashboard | 10 | ✅ |
| Inventory | 6 | ✅ |
| Ledger | 3 | ✅ |
| Orders | 6 | ✅ |
| Payments | 6 | ✅ |
| Products | 7 | Partial (GET public) |
| Stores | 5 | ✅ |
| Store Products | 6 | ✅ |
| Store Staff | 6 | ✅ |
| User | 3 | ✅ |
| **Total** | **83** | |
