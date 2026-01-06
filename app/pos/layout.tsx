"use client"

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Search,
  ChevronDown,
  Store,
  CreditCard,
  HelpCircle,
  PackageOpen,
  ClipboardList,
  TrendingUp,
  DollarSign,
  Megaphone,
  Calculator
} from "lucide-react"
import { NotificationPanel } from "@/components/pos/NotificationPanel"

// Sidebar menu structure based on data.docx
const sidebarSections = [
  {
    title: "Primary Menus",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/pos/dashboard" },
      { icon: ShoppingCart, label: "POS", href: "/pos" },
      { icon: Package, label: "Products", href: "/pos/products" },
      { icon: PackageOpen, label: "Inventory", href: "/pos/inventory" },
      { icon: ClipboardList, label: "Orders", href: "/pos/orders" },
      { icon: Users, label: "Customers", href: "/pos/customers" },
    ]
  },
  {
    title: "Growth & Finance",
    items: [
      { icon: Store, label: "E-commerce Store", href: "/pos/ecommerce" },
      { icon: CreditCard, label: "Payments", href: "/pos/payments" },
      { icon: BarChart3, label: "Reports and Analytics", href: "/pos/reports" },
      { icon: Megaphone, label: "Marketing and Ads", href: "/pos/marketing" },
    ]
  },
  {
    title: "Management",
    items: [
      { icon: Calculator, label: "Accounting", href: "/pos/accounting" },
      { icon: Settings, label: "Settings", href: "/pos/settings" },
      { icon: HelpCircle, label: "Help and Support", href: "/pos/help" },
    ]
  }
]

/**
 * POS Main Layout - Conditionally applies sidebar/nav
 * Auth pages (login, register, etc.) will use their own layout
 * App pages (dashboard, sales, etc.) will use this layout with sidebar
 */
export default function POSLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userData, setUserData] = useState<{ business_name?: string; email?: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Since backend is removed, use demo data for now
        // Replace this with your actual API call when backend is ready
        setUserData({
          business_name: 'Bunya Retail Shop',
          email: 'vendor@bunyaretail.com'
        })
      } catch (error) {
        // Silently fail - backend not connected yet
        setUserData({
          business_name: 'Bunya Retail Shop',
          email: 'vendor@bunyaretail.com'
        })
      }
    }

    if (mounted && !pathname?.startsWith("/pos/auth")) {
      fetchUserData()
    }
  }, [pathname, mounted])

  // Get first letter of business name for avatar
  const avatarLetter = userData?.business_name?.charAt(0).toUpperCase() || 'V'
  const displayName = userData?.business_name || 'Vendor Store'
  const displayEmail = userData?.email || 'vendor@example.com'

  // Check if current route is an auth page
  const isAuthPage = pathname?.startsWith("/pos/auth")

  // If it's an auth page, just render children without sidebar/nav
  if (isAuthPage) {
    return <>{children}</>
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  // For non-auth pages, render with sidebar and navigation
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 border-r border-purple-900 z-40
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ backgroundColor: '#110228' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center">
              <img src="/logos/logo.png" alt="Vendora Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Vendora</h1>
              <p className="text-xs text-white/80">Vendor Dashboard</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              type="text"
              placeholder="Search menu"
              className="w-full pl-10 pr-4 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          <div className="space-y-6">
            {sidebarSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {/* Section Title */}
                <h3 className="px-3 mb-2 text-xs font-semibold text-white/70 uppercase tracking-wider">
                  {section.title}
                </h3>

                {/* Section Items */}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                            transition-all duration-200
                            ${
                              isActive
                                ? "bg-white text-purple-700 font-medium shadow-lg"
                                : "text-white/90 hover:bg-white/10 hover:text-white backdrop-blur-sm"
                            }
                          `}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen transition-all duration-300 md:ml-64 bg-gray-50">
        {/* Header */}
        <header className="h-16 border-b flex items-center px-6 sticky top-0 z-30" style={{ backgroundColor: '#2e0f5f', borderColor: '#1f0a3d' }}>
          <div className="flex-1 flex items-center justify-between">
            {/* Left Side - Title & Search */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 md:hidden" /> {/* Spacer for mobile menu button */}
              <h2 className="text-xl font-semibold text-white hidden md:block">POS System</h2>

              {/* Search Bar */}
              <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 w-full max-w-md ml-4 border border-white/20">
                <Search className="h-4 w-4 text-white/70" />
                <input
                  type="text"
                  placeholder="Search products, customers..."
                  className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/60"
                />
              </div>
            </div>

            {/* Right Side - Notifications & User Profile */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <NotificationPanel />

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 h-auto"
                  >
                    {/* Avatar */}
                    <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-purple-700 font-semibold">
                      {avatarLetter}
                    </div>
                    {/* User Info */}
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-semibold text-white">{displayName}</span>
                      <span className="text-xs text-white/70">{displayEmail}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-white hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-gray-900">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                    <User className="mr-2 h-4 w-4 text-gray-600" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                    <Store className="mr-2 h-4 w-4 text-gray-600" />
                    <span>My Store</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                    <CreditCard className="mr-2 h-4 w-4 text-gray-600" />
                    <span>Subscription</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                    <Settings className="mr-2 h-4 w-4 text-gray-600" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                    <HelpCircle className="mr-2 h-4 w-4 text-gray-600" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
                    onClick={async () => {
                      try {
                        // Clear tokens
                        if (typeof window !== 'undefined') {
                          document.cookie = 'vendora_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                          localStorage.removeItem('vendora_access_token')
                          localStorage.removeItem('vendora_refresh_token')
                          localStorage.removeItem('vendora_user_type')
                          localStorage.removeItem('vendora_token_expiry')
                        }
                        window.location.href = "/pos/auth/login"
                      } catch (error) {
                        console.error('Logout error:', error)
                        window.location.href = "/pos/auth/login"
                      }
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
