# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vendora is a multi-tenant Point of Sale (POS) and E-commerce platform built with Next.js 16 (App Router). It serves three user types: Vendors (primary), Admins, and E-commerce customers.

## Common Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Route Structure

The app has three main sections under `/app`:
- `/pos/*` - Vendor dashboard (primary entry point, protected routes)
- `/admin/*` - Admin portal
- `/ecommerce/*` - Customer-facing storefront

Root page (`/`) redirects to `/pos/auth/login`.

### Key Layers

**Services (`services/`)**: Pure API wrappers with no business logic. All API calls go through services.
- `auth-jwt.service.ts` - Three auth contexts: `admin`, `vendor`, `pos`
- `product.service.ts`, `category.service.ts`, `order.service.ts`
- Import via barrel: `import { authService, productService } from "@/services"`

**API Client (`lib/`)**:
- `axios-client.ts` - Axios instance with JWT interceptors, token refresh queue, 401 handling
- `api-client.ts` - High-level helpers (`api.get`, `api.post`, etc.) that extract `response.data.data`
- `api-endpoints.ts` - Endpoint builder functions with parameter interpolation

**State (`store/`)**: Zustand stores with localStorage persistence
- `auth-store.ts` - User, authentication state
- `cart-store.ts` - Cart items with currency.js for decimal calculations
- `ui-store.ts` - Theme, sidebar state

**Configuration (`config/`)**:
- `env.ts` - Environment variables with type safety and defaults
- `api.config.ts` - API constants, token storage keys
- `api-endpoints.ts` - Auth endpoint definitions

**Types (`types/`)**: TypeScript interfaces for all entities
- Import via barrel: `import type { User, Product } from "@/types"`

### Authentication Flow

JWT with refresh tokens. Tokens stored in both cookies (for middleware) and localStorage (fallback).

1. Login via `authService.pos.login()` → stores token via `tokenManager`
2. Axios interceptor adds `Authorization: Bearer {token}` header
3. On 401, interceptor attempts token refresh, queues concurrent requests
4. Middleware (`middleware.ts`) protects `/pos/*` routes server-side

User type (`admin`/`vendor`) tracked separately to determine refresh endpoints and redirect paths.

### Component Organization

```
components/
├── ui/          # shadcn/ui primitives
├── pos/         # POS-specific components
├── admin/       # Admin components
├── ecommerce/   # Storefront components
├── layout/      # Header, sidebar, navigation
└── shared/      # Reusable utilities
```

### Path Aliases

Use `@/*` for imports from project root:
```typescript
import { authService } from "@/services"
import { env } from "@/config/env"
import type { User } from "@/types"
```

## Technology Stack

- **Framework**: Next.js 16 with App Router, React 19, TypeScript 5.9
- **State**: Zustand with persist middleware
- **HTTP**: Axios with interceptors
- **Forms**: React Hook Form + Zod validation
- **UI**: Tailwind CSS + shadcn/ui (Radix primitives)
- **Charts**: Recharts
- **Money**: currency.js for decimal calculations

## Business Context

- Currency: PHP (Philippines Peso)
- Tax rate: 12% VAT (configured in cart store)
- Multi-tenant: Vendors have isolated data, admins manage vendors
