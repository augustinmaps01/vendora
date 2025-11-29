# Responsive Design Guide

This application is fully responsive and works seamlessly across all device sizes - from mobile phones to large desktop displays. Perfect for POS systems and e-commerce platforms that need to work on tablets, phones, and desktop computers.

## Supported Device Sizes

### Mobile Devices (< 640px)
- **Phones** (Portrait & Landscape)
- iPhone SE, iPhone 12/13/14, Samsung Galaxy, etc.
- Optimized for touch interactions
- Single column layouts
- Bottom navigation for easy thumb access

### Small Tablets (640px - 767px)
- **Small tablets** (Portrait)
- iPad Mini, smaller Android tablets
- 2-column product grids
- Drawer-based navigation

### Tablets (768px - 1023px)
- **Tablets** (Portrait & Landscape)
- iPad, iPad Air, Android tablets
- 3-4 column product grids
- Sidebar begins to appear on larger tablets

### Desktop (1024px+)
- **Small laptops** (1024px - 1279px)
- **Desktop** (1280px - 1535px)
- **Large Desktop** (1536px+)
- Full sidebar navigation
- Multi-column layouts
- Advanced features visible

## Tailwind CSS Breakpoints

```typescript
mobile:  default (0px - 639px)
sm:      >= 640px   (Small tablets)
md:      >= 768px   (Tablets)
lg:      >= 1024px  (Small laptops/Desktop)
xl:      >= 1280px  (Desktop)
2xl:     >= 1536px  (Large desktop)
```

## Responsive Utilities

### 1. Breakpoint Detection Hooks

```typescript
import {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useDeviceType
} from "@/lib/responsive"

function MyComponent() {
  const breakpoint = useBreakpoint() // 'mobile' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  const isMobile = useIsMobile()     // true if width < 768px
  const isTablet = useIsTablet()     // true if 768px <= width < 1024px
  const isDesktop = useIsDesktop()   // true if width >= 1024px
  const deviceType = useDeviceType() // 'mobile' | 'tablet' | 'desktop'

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  )
}
```

### 2. Window Size Hook

```typescript
import { useWindowSize } from "@/lib/responsive"

function MyComponent() {
  const { width, height } = useWindowSize()

  return <div>Window: {width} x {height}</div>
}
```

### 3. Touch Device Detection

```typescript
import { useIsTouchDevice } from "@/lib/responsive"

function MyComponent() {
  const isTouch = useIsTouchDevice()

  return (
    <Button size={isTouch ? "lg" : "md"}>
      Click Me
    </Button>
  )
}
```

### 4. Orientation Detection

```typescript
import { useOrientation } from "@/lib/responsive"

function MyComponent() {
  const orientation = useOrientation() // 'portrait' | 'landscape'

  return <div>Current orientation: {orientation}</div>
}
```

## Responsive Layout Components

### 1. Responsive Container

Automatically adjusts width and padding based on screen size.

```typescript
import { ResponsiveContainer } from "@/components/layout/responsive-container"

<ResponsiveContainer maxWidth="xl" padded>
  <h1>My Content</h1>
</ResponsiveContainer>
```

**Props:**
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
- `padded`: Add responsive horizontal padding
- `centered`: Center the container

### 2. Responsive Grid

Automatically adjusts columns based on screen size.

```typescript
import { ResponsiveGrid } from "@/components/layout/responsive-grid"

<ResponsiveGrid
  cols={{ mobile: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
  gap="md"
>
  {products.map(product => (
    <ProductCard key={product.id} {...product} />
  ))}
</ResponsiveGrid>
```

**Preset Grids:**

```typescript
import {
  ProductGrid,      // 2, 3, 4, 5, 6 columns
  EcommerceGrid,    // 1, 2, 2, 3, 4 columns
  DashboardGrid     // 1, 1, 2, 3, 4 columns
} from "@/components/layout/responsive-grid"

// POS Product Selection
<ProductGrid>
  {products.map(product => <ProductCard {...product} />)}
</ProductGrid>

// E-commerce Product Listing
<EcommerceGrid>
  {products.map(product => <ProductCard {...product} />)}
</EcommerceGrid>

// Dashboard Widgets
<DashboardGrid>
  {widgets.map(widget => <DashboardCard {...widget} />)}
</DashboardGrid>
```

### 3. Responsive Sidebar

Shows as sidebar on desktop, drawer on mobile.

```typescript
import { ResponsiveSidebar } from "@/components/layout/responsive-sidebar"
import { Button } from "@/components/ui/button"

<ResponsiveSidebar
  trigger={<Button>Open Filters</Button>}
  side="left"
  width="md"
>
  <FilterOptions />
</ResponsiveSidebar>
```

**Complete Layout Example:**

```typescript
import { ResponsiveLayout } from "@/components/layout/responsive-sidebar"
import { Button } from "@/components/ui/button"

<ResponsiveLayout
  sidebar={<NavigationMenu />}
  sidebarTrigger={<Button>Menu</Button>}
  sidebarSide="left"
  sidebarWidth="md"
>
  <main>Your main content here</main>
</ResponsiveLayout>
```

## Tailwind Responsive Classes

### Basic Usage

```tsx
// Hide on mobile, show on desktop
<div className="hidden lg:block">Desktop Only</div>

// Show on mobile, hide on desktop
<div className="block lg:hidden">Mobile Only</div>

// Different padding for different sizes
<div className="p-4 md:p-6 lg:p-8">Responsive Padding</div>

// Different text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>

// Different flex direction
<div className="flex flex-col md:flex-row">
  Vertical on mobile, horizontal on tablet+
</div>
```

### Grid Layouts

```tsx
// 1 column on mobile, 2 on tablet, 3 on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card {...item} />)}
</div>

// 2 columns on mobile, 4 on tablet, 6 on desktop
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
  {items.map(item => <ProductCard {...item} />)}
</div>
```

### Spacing

```tsx
// Responsive margins
<div className="mt-4 md:mt-6 lg:mt-8">Content</div>

// Responsive gaps
<div className="flex gap-2 md:gap-4 lg:gap-6">Items</div>
```

## Real-World Examples

### 1. POS Product Selection Screen

```typescript
"use client"

import { ProductGrid } from "@/components/layout/responsive-grid"
import { ResponsiveContainer } from "@/components/layout/responsive-container"
import { Card } from "@/components/ui/card"
import { formatPHP } from "@/lib/currency"
import { useIsMobile } from "@/lib/responsive"

export function POSScreen({ products }: { products: any[] }) {
  const isMobile = useIsMobile()

  return (
    <ResponsiveContainer>
      {/* Header - different sizes for mobile/desktop */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
        Products
      </h1>

      {/* Product Grid - 2 cols mobile, 3 tablet, 4 laptop, 5+ desktop */}
      <ProductGrid>
        {products.map((product) => (
          <Card
            key={product.id}
            className={`p-3 md:p-4 ${isMobile ? "text-sm" : "text-base"}`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover rounded mb-2"
            />
            <h3 className="font-semibold truncate">{product.name}</h3>
            <p className="text-lg md:text-xl font-bold text-primary">
              {formatPHP(product.price)}
            </p>
          </Card>
        ))}
      </ProductGrid>
    </ResponsiveContainer>
  )
}
```

### 2. E-commerce Product Page

```typescript
"use client"

import { ResponsiveContainer } from "@/components/layout/responsive-container"
import { Button } from "@/components/ui/button"
import { formatPHP } from "@/lib/currency"

export function ProductPage({ product }: { product: any }) {
  return (
    <ResponsiveContainer maxWidth="2xl" padded>
      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Product Images */}
        <div>
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full rounded-lg"
          />
          {/* Thumbnails - 3 on mobile, 4 on tablet, 5 on desktop */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-4">
            {product.images.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                alt={`${product.name} ${i + 1}`}
                className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-75"
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4 md:space-y-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            {product.name}
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
            {formatPHP(product.price)}
          </p>
          <p className="text-sm md:text-base text-muted-foreground">
            {product.description}
          </p>

          {/* Buttons - Full width on mobile, auto on desktop */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="w-full sm:w-auto flex-1">
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  )
}
```

### 3. Dashboard Layout

```typescript
"use client"

import { DashboardGrid } from "@/components/layout/responsive-grid"
import { ResponsiveContainer } from "@/components/layout/responsive-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPHP } from "@/lib/currency"

export function Dashboard({ stats }: { stats: any }) {
  return (
    <ResponsiveContainer>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid - 1 col mobile, 2 tablet, 4 desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold">
              {formatPHP(stats.totalSales)}
            </p>
          </CardContent>
        </Card>
        {/* More stat cards... */}
      </div>

      {/* Charts - Stack on mobile, side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Chart</CardTitle>
          </CardHeader>
          <CardContent className="h-64 md:h-80">
            {/* Chart component */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders Chart</CardTitle>
          </CardHeader>
          <CardContent className="h-64 md:h-80">
            {/* Chart component */}
          </CardContent>
        </Card>
      </div>
    </ResponsiveContainer>
  )
}
```

### 4. Shopping Cart (Mobile Drawer, Desktop Sidebar)

```typescript
"use client"

import { ResponsiveSidebar } from "@/components/layout/responsive-sidebar"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { formatPHP, calculateSubtotal, addVAT } from "@/lib/currency"

export function CartLayout({ children, cartItems }: any) {
  const subtotal = calculateSubtotal(cartItems)
  const total = addVAT(subtotal)

  const CartContent = () => (
    <div className="flex flex-col h-full">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Shopping Cart</h2>

      {/* Cart Items - scrollable */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {cartItems.map((item: any) => (
          <div key={item.id} className="flex gap-3 p-3 border rounded">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity}
              </p>
              <p className="font-bold">{formatPHP(item.price)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Total - sticky at bottom */}
      <div className="border-t pt-4 mt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatPHP(subtotal)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>{formatPHP(total)}</span>
        </div>
        <Button className="w-full" size="lg">
          Checkout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex">
      <main className="flex-1">{children}</main>

      <ResponsiveSidebar
        trigger={
          <Button size="lg" className="fixed bottom-4 right-4 md:hidden">
            <ShoppingCart className="mr-2" />
            Cart ({cartItems.length})
          </Button>
        }
        side="right"
        width="md"
      >
        <CartContent />
      </ResponsiveSidebar>
    </div>
  )
}
```

## Best Practices

### 1. Mobile-First Approach
Always design for mobile first, then enhance for larger screens:

```tsx
// Good - Mobile first
<div className="text-sm md:text-base lg:text-lg">Text</div>

// Avoid - Desktop first
<div className="text-lg md:text-base sm:text-sm">Text</div>
```

### 2. Touch-Friendly Sizes
Use larger buttons and touch targets on mobile:

```tsx
import { useIsTouchDevice } from "@/lib/responsive"

function ActionButton() {
  const isTouch = useIsTouchDevice()

  return (
    <Button size={isTouch ? "lg" : "default"}>
      Click Me
    </Button>
  )
}
```

### 3. Optimize Images
Use responsive images with different sizes:

```tsx
<img
  src={product.image}
  alt={product.name}
  className="w-full h-auto"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### 4. Conditional Rendering
Show different components based on screen size:

```tsx
import { useIsMobile, useIsDesktop } from "@/lib/responsive"

function Navigation() {
  const isMobile = useIsMobile()
  const isDesktop = useIsDesktop()

  return (
    <>
      {isMobile && <MobileNav />}
      {isDesktop && <DesktopNav />}
    </>
  )
}
```

### 5. Test on Real Devices
- Test on actual phones, tablets, and desktops
- Use Chrome DevTools device emulation
- Test both portrait and landscape orientations
- Test touch interactions on touch devices

## Testing Responsive Design

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select device presets or enter custom dimensions
4. Test different orientations

### Common Test Devices
- **Mobile**: iPhone 12 (390x844), Samsung Galaxy S21 (360x800)
- **Tablet**: iPad (768x1024), iPad Pro (1024x1366)
- **Desktop**: 1920x1080, 1366x768, 2560x1440

## Performance Tips

1. **Use CSS instead of JS when possible** - Tailwind responsive classes are more performant
2. **Lazy load images** - Especially on mobile devices
3. **Minimize re-renders** - Use hooks efficiently
4. **Optimize for touch** - Larger buttons, proper spacing
5. **Test on slow networks** - Mobile users often have slower connections

Your application is now fully responsive and will work beautifully across all device sizes!
