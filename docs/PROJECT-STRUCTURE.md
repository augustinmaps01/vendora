# Project Structure - Vendora POS & E-commerce System

## 📁 Proposed Folder Structure

```
client-side/
├── 📁 app/                                    # Next.js App Router
│   ├── 📄 layout.tsx                          # Root layout (common wrapper)
│   ├── 📄 page.tsx                            # Landing page
│   ├── 📄 globals.css                         # Global styles
│   ├── 📄 favicon.ico                         # Site favicon
│   │
│   ├── 📁 (auth)/                             # Auth group (shared layout)
│   │   ├── 📄 layout.tsx                      # Auth layout (centered, branded)
│   │   ├── 📁 login/
│   │   │   └── 📄 page.tsx                    # Login page
│   │   ├── 📁 register/
│   │   │   └── 📄 page.tsx                    # Register page
│   │   └── 📁 subscription/
│   │       └── 📄 page.tsx                    # Subscription/Pricing page
│   │
│   ├── 📁 admin/                              # Admin Dashboard (EXISTING - KEEP AS IS)
│   │   ├── 📄 layout.tsx                      # Admin layout (sidebar, header)
│   │   ├── 📄 page.tsx                        # Admin dashboard
│   │   ├── 📁 products/                       # Product management
│   │   │   ├── 📄 page.tsx                    # Products list
│   │   │   ├── 📁 new/
│   │   │   │   └── 📄 page.tsx                # Add product
│   │   │   └── 📁 [id]/
│   │   │       ├── 📄 page.tsx                # Edit product
│   │   │       └── 📄 loading.tsx             # Loading state
│   │   ├── 📁 orders/                         # Order management
│   │   │   ├── 📄 page.tsx                    # Orders list
│   │   │   └── 📁 [id]/
│   │   │       └── 📄 page.tsx                # Order details
│   │   ├── 📁 inventory/                      # Inventory management
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 customers/                      # Customer management
│   │   │   ├── 📄 page.tsx                    # Customers list
│   │   │   └── 📁 [id]/
│   │   │       └── 📄 page.tsx                # Customer details
│   │   ├── 📁 reports/                        # Reports & Analytics
│   │   │   ├── 📄 page.tsx                    # Reports dashboard
│   │   │   ├── 📁 sales/
│   │   │   ├── 📁 inventory/
│   │   │   └── 📁 customers/
│   │   ├── 📁 settings/                       # Settings
│   │   │   ├── 📄 page.tsx                    # General settings
│   │   │   ├── 📁 store/
│   │   │   ├── 📁 payment/
│   │   │   ├── 📁 shipping/
│   │   │   └── 📁 users/
│   │   └── 📁 subscriptions/                  # Subscription management
│   │       └── 📄 page.tsx
│   │
│   ├── 📁 pos/                                # Point of Sale (EXISTING - KEEP AS IS)
│   │   ├── 📄 layout.tsx                      # POS layout (full screen)
│   │   ├── 📄 page.tsx                        # POS main screen
│   │   ├── 📁 checkout/
│   │   │   └── 📄 page.tsx                    # Checkout screen
│   │   ├── 📁 transactions/                   # Transaction history
│   │   │   ├── 📄 page.tsx                    # Transactions list
│   │   │   └── 📁 [id]/
│   │   │       └── 📄 page.tsx                # Transaction details
│   │   ├── 📁 customers/                      # Quick customer lookup
│   │   │   └── 📄 page.tsx
│   │   └── 📁 settings/                       # POS settings
│   │       └── 📄 page.tsx
│   │
│   ├── 📁 ecommerce/                          # E-commerce Store (EXISTING - KEEP AS IS)
│   │   ├── 📄 layout.tsx                      # E-commerce layout (header, footer)
│   │   ├── 📄 page.tsx                        # Store homepage
│   │   ├── 📁 products/                       # Product browsing
│   │   │   ├── 📄 page.tsx                    # Products listing
│   │   │   ├── 📁 [category]/
│   │   │   │   └── 📄 page.tsx                # Category page
│   │   │   └── 📁 [id]/
│   │   │       └── 📄 page.tsx                # Product detail page
│   │   ├── 📁 cart/
│   │   │   └── 📄 page.tsx                    # Shopping cart
│   │   ├── 📁 checkout/
│   │   │   ├── 📄 page.tsx                    # Checkout page
│   │   │   ├── 📁 shipping/
│   │   │   ├── 📁 payment/
│   │   │   └── 📁 confirmation/
│   │   ├── 📁 account/                        # Customer account
│   │   │   ├── 📄 page.tsx                    # Account dashboard
│   │   │   ├── 📁 orders/
│   │   │   │   ├── 📄 page.tsx                # Order history
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── 📄 page.tsx            # Order details
│   │   │   ├── 📁 profile/
│   │   │   ├── 📁 addresses/
│   │   │   └── 📁 wishlist/
│   │   ├── 📁 search/
│   │   │   └── 📄 page.tsx                    # Search results
│   │   └── 📁 about/
│   │       └── 📄 page.tsx                    # About page
│   │
│   └── 📁 api/                                # API Routes
│       ├── 📁 auth/
│       │   ├── 📁 login/
│       │   ├── 📁 register/
│       │   └── 📁 logout/
│       ├── 📁 products/
│       ├── 📁 orders/
│       ├── 📁 customers/
│       ├── 📁 payments/
│       └── 📁 subscriptions/
│
├── 📁 components/                             # React Components
│   ├── 📁 ui/                                 # shadcn/ui components (auto-generated)
│   │   ├── 📄 button.tsx
│   │   ├── 📄 card.tsx
│   │   ├── 📄 dialog.tsx
│   │   ├── 📄 input.tsx
│   │   └── ... (all shadcn components)
│   │
│   ├── 📁 layout/                             # Layout components
│   │   ├── 📄 responsive-container.tsx
│   │   ├── 📄 responsive-grid.tsx
│   │   ├── 📄 responsive-sidebar.tsx
│   │   ├── 📄 header.tsx                      # Reusable header
│   │   ├── 📄 footer.tsx                      # Reusable footer
│   │   ├── 📄 sidebar.tsx                     # Reusable sidebar
│   │   └── 📄 navbar.tsx                      # Reusable navbar
│   │
│   ├── 📁 shared/                             # Shared/Reusable components
│   │   ├── 📄 logo.tsx                        # App logo
│   │   ├── 📄 loading-spinner.tsx
│   │   ├── 📄 error-boundary.tsx
│   │   ├── 📄 empty-state.tsx
│   │   ├── 📄 page-header.tsx
│   │   ├── 📄 data-table.tsx                  # Reusable table
│   │   ├── 📄 search-input.tsx
│   │   ├── 📄 theme-toggle.tsx
│   │   └── 📄 user-avatar.tsx
│   │
│   ├── 📁 auth/                               # Authentication components
│   │   ├── 📄 login-form.tsx
│   │   ├── 📄 register-form.tsx
│   │   ├── 📄 subscription-card.tsx
│   │   └── 📄 protected-route.tsx
│   │
│   ├── 📁 admin/                              # Admin-specific components
│   │   ├── 📄 admin-header.tsx
│   │   ├── 📄 admin-sidebar.tsx
│   │   ├── 📄 stats-card.tsx
│   │   ├── 📄 product-form.tsx
│   │   ├── 📄 order-status-badge.tsx
│   │   ├── 📄 customer-table.tsx
│   │   └── 📄 analytics-chart.tsx
│   │
│   ├── 📁 pos/                                # POS-specific components
│   │   ├── 📄 pos-header.tsx
│   │   ├── 📄 product-grid.tsx
│   │   ├── 📄 cart-item.tsx
│   │   ├── 📄 cart-summary.tsx
│   │   ├── 📄 payment-modal.tsx
│   │   ├── 📄 receipt-printer.tsx
│   │   ├── 📄 numpad.tsx
│   │   ├── 📄 barcode-scanner.tsx
│   │   └── 📄 category-filter.tsx
│   │
│   ├── 📁 ecommerce/                          # E-commerce-specific components
│   │   ├── 📄 ecommerce-header.tsx
│   │   ├── 📄 ecommerce-footer.tsx
│   │   ├── 📄 product-card.tsx
│   │   ├── 📄 product-filters.tsx
│   │   ├── 📄 product-gallery.tsx
│   │   ├── 📄 add-to-cart-button.tsx
│   │   ├── 📄 cart-drawer.tsx
│   │   ├── 📄 checkout-steps.tsx
│   │   ├── 📄 payment-methods.tsx
│   │   ├── 📄 shipping-options.tsx
│   │   ├── 📄 order-summary.tsx
│   │   ├── 📄 review-rating.tsx
│   │   └── 📄 newsletter-signup.tsx
│   │
│   └── 📁 examples/                           # Example components (for reference)
│       └── 📄 dialog-sizes-example.tsx
│
├── 📁 lib/                                    # Utility functions & configurations
│   ├── 📄 utils.ts                            # General utilities (cn, etc.)
│   ├── 📄 currency.ts                         # PHP currency utilities
│   ├── 📄 responsive.ts                       # Responsive utilities
│   ├── 📄 api-client.ts                       # API client (axios setup)
│   ├── 📄 auth.ts                             # Auth utilities
│   ├── 📄 validation.ts                       # Validation schemas (zod)
│   ├── 📄 date.ts                             # Date utilities
│   └── 📄 constants.ts                        # App constants
│
├── 📁 hooks/                                  # Custom React hooks
│   ├── 📄 use-mobile.ts                       # Mobile detection (from sidebar)
│   ├── 📄 use-cart.ts                         # Shopping cart hook
│   ├── 📄 use-auth.ts                         # Authentication hook
│   ├── 📄 use-products.ts                     # Products data hook
│   ├── 📄 use-orders.ts                       # Orders data hook
│   ├── 📄 use-toast.ts                        # Toast notifications
│   ├── 📄 use-local-storage.ts                # Local storage hook
│   └── 📄 use-debounce.ts                     # Debounce hook
│
├── 📁 store/                                  # State management (Zustand)
│   ├── 📄 cart-store.ts                       # Cart state
│   ├── 📄 auth-store.ts                       # Auth state
│   ├── 📄 pos-store.ts                        # POS state
│   └── 📄 ui-store.ts                         # UI state (sidebar, modals)
│
├── 📁 types/                                  # TypeScript type definitions
│   ├── 📄 index.ts                            # Barrel export
│   ├── 📄 auth.ts                             # Auth types
│   ├── �� product.ts                          # Product types
│   ├── 📄 order.ts                            # Order types
│   ├── 📄 customer.ts                         # Customer types
│   ├── 📄 cart.ts                             # Cart types
│   └── 📄 api.ts                              # API response types
│
├── 📁 config/                                 # Configuration files
│   ├── 📄 site.ts                             # Site metadata
│   ├── 📄 navigation.ts                       # Navigation configs
│   └── 📄 env.ts                              # Environment variables
│
├── 📁 styles/                                 # Additional styles
│   ├── 📄 animations.css                      # Custom animations
│   └── 📄 print.css                           # Print styles (receipts)
│
├── 📁 public/                                 # Static assets
│   ├── 📁 images/
│   │   ├── 📁 products/                       # Product images
│   │   ├── 📁 banners/                        # Banner images
│   │   ├── 📁 logos/                          # Logo variations
│   │   └── 📁 placeholders/                   # Placeholder images
│   ├── 📁 fonts/                              # Custom fonts
│   │   ├── geist-sans/
│   │   └── geist-mono/
│   ├── 📁 icons/                              # Custom icons
│   └── 📁 docs/                               # Documentation PDFs
│
├── 📁 docs/                                   # Documentation
│   ├── 📄 PROJECT-STRUCTURE.md                # This file
│   ├── 📄 responsive-design-guide.md          # Responsive guide
│   ├── 📄 API.md                              # API documentation
│   └── 📄 COMPONENTS.md                       # Component usage guide
│
├── 📁 tests/                                  # Test files
│   ├── 📁 unit/
│   ├── 📁 integration/
│   └── 📁 e2e/
│
├── 📄 .env.local                              # Environment variables
├── 📄 .env.example                            # Example env file
├── 📄 .gitignore                              # Git ignore
├── 📄 components.json                         # shadcn config
├── 📄 next.config.js                          # Next.js config
├── 📄 package.json                            # Dependencies
├── 📄 tailwind.config.ts                      # Tailwind config
├── 📄 tsconfig.json                           # TypeScript config
└── 📄 README.md                               # Project readme
```

## 🎯 Key Features of This Structure

### 1. **Route Groups** `(auth)`
- Groups login, register, subscription pages
- Shares a common centered layout
- Located at root level for single login → multiple destinations

### 2. **Feature-Based Organization**
- **admin/** - Complete admin dashboard
- **pos/** - Point of sale system
- **ecommerce/** - Online store
- Each has its own layout and components

### 3. **Component Organization**
- **ui/** - shadcn components (auto-generated)
- **layout/** - Reusable layouts (header, footer, sidebar)
- **shared/** - Components used across all features
- **admin/**, **pos/**, **ecommerce/** - Feature-specific components

### 4. **Utility Organization**
- **lib/** - Pure utility functions
- **hooks/** - Custom React hooks
- **store/** - Global state management
- **types/** - TypeScript definitions

### 5. **Asset Organization**
- **public/images/** - Organized by type
- **public/fonts/** - Custom fonts
- **styles/** - Additional CSS (animations, print)

## 📋 Naming Conventions

### Files
- **Pages**: `page.tsx`
- **Layouts**: `layout.tsx`
- **Components**: `kebab-case.tsx` (e.g., `product-card.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `api-client.ts`)
- **Types**: `kebab-case.ts` (e.g., `product.ts`)

### Folders
- **Route segments**: lowercase (e.g., `products`, `checkout`)
- **Component folders**: kebab-case (e.g., `admin`, `ecommerce`)
- **Dynamic routes**: `[id]`, `[slug]`, `[category]`

### Components
- **PascalCase** for component names
- **Descriptive names** (e.g., `AddToCartButton`, not `Button1`)

## 🔄 Reusable Components Strategy

### Layout Components
```typescript
// Used across all features
<Header variant="admin" | "pos" | "ecommerce" />
<Footer variant="simple" | "full" />
<Sidebar side="left" | "right" width="sm" | "md" | "lg" />
```

### Shared Components with Custom Props
```typescript
// DataTable with custom styling
<DataTable
  data={products}
  columns={columns}
  variant="admin" | "pos"
  striped={boolean}
  hoverable={boolean}
/>

// ProductCard with different layouts
<ProductCard
  product={product}
  layout="grid" | "list" | "compact"
  showActions={boolean}
  variant="admin" | "ecommerce" | "pos"
/>
```

## 🎨 Layout Examples

### Admin Layout
```typescript
// app/admin/layout.tsx
<AdminSidebar />
<main>
  <AdminHeader />
  {children}
</main>
```

### POS Layout
```typescript
// app/pos/layout.tsx
<div className="h-screen flex flex-col">
  <POSHeader />
  <main className="flex-1 flex">
    <ProductGrid />
    <CartSidebar />
  </main>
</div>
```

### E-commerce Layout
```typescript
// app/ecommerce/layout.tsx
<EcommerceHeader />
<main className="min-h-screen">
  {children}
</main>
<EcommerceFooter />
```

### Auth Layout
```typescript
// app/(auth)/layout.tsx
<div className="min-h-screen flex items-center justify-center">
  <Logo />
  <Card>{children}</Card>
</div>
```

## 🚀 Benefits

### 1. **Scalability**
- Easy to add new features
- Clear separation of concerns
- Feature-based organization

### 2. **Maintainability**
- Easy to locate files
- Consistent naming
- Logical grouping

### 3. **Reusability**
- Shared components
- Common utilities
- Consistent patterns

### 4. **Developer Experience**
- Clear structure
- Easy onboarding
- Self-documenting

### 5. **Performance**
- Code splitting by route
- Lazy loading
- Optimized imports

## 📝 Best Practices

1. **Keep components small** - One responsibility per component
2. **Use TypeScript** - Type everything
3. **Consistent naming** - Follow conventions
4. **Document complex logic** - Add comments
5. **Reuse when possible** - Don't duplicate code
6. **Test critical paths** - Write tests for important features
7. **Use barrel exports** - Clean imports with index.ts files

## 🔍 Finding Files Quickly

- **Auth pages**: `app/(auth)/[login|register|subscription]`
- **Admin pages**: `app/admin/[feature]`
- **POS pages**: `app/pos/[feature]`
- **E-commerce pages**: `app/ecommerce/[feature]`
- **Shared components**: `components/shared/`
- **Feature components**: `components/[admin|pos|ecommerce]/`
- **Utilities**: `lib/`
- **Hooks**: `hooks/`
- **Types**: `types/`

This structure provides a solid foundation for your POS and E-commerce system that's easy to understand, maintain, and scale!
