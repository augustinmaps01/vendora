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
  Bell,
  Search,
  ChevronDown,
  Store,
  CreditCard,
  HelpCircle
} from "lucide-react"
import { authService } from "@/services/auth-jwt.service"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/pos/dashboard" },
  { icon: ShoppingCart, label: "Sales", href: "/pos/sales" },
  { icon: Package, label: "Products", href: "/pos/products" },
  { icon: Users, label: "Customers", href: "/pos/customers" },
  { icon: BarChart3, label: "Reports", href: "/pos/reports" },
  { icon: Settings, label: "Settings", href: "/pos/settings" },
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
        const user = await authService.vendor.me()
        setUserData(user)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
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
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-600 to-green-700 border-r border-emerald-500/20 z-40
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-emerald-500/20 px-6">
          <h1 className="text-2xl font-bold text-white">Vendora POS</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-200
                      ${
                        isActive
                          ? "bg-white text-emerald-700 shadow-md"
                          : "text-emerald-50 hover:bg-emerald-500/30 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen transition-all duration-300 md:ml-64 bg-gradient-to-br from-emerald-50 via-white to-green-50">
        {/* Header */}
        <header className="h-16 border-b bg-white/80 backdrop-blur-sm flex items-center px-6 shadow-sm sticky top-0 z-30">
          <div className="flex-1 flex items-center justify-between">
            {/* Left Side - Title & Search */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 md:hidden" /> {/* Spacer for mobile menu button */}
              <h2 className="text-xl font-semibold text-emerald-900 hidden md:block">POS System</h2>

              {/* Search Bar */}
              <div className="hidden lg:flex items-center gap-2 bg-emerald-50/50 rounded-lg px-4 py-2 w-full max-w-md ml-4">
                <Search className="h-4 w-4 text-emerald-600" />
                <input
                  type="text"
                  placeholder="Search products, customers..."
                  className="bg-transparent border-none outline-none text-sm w-full text-emerald-900 placeholder:text-emerald-500"
                />
              </div>
            </div>

            {/* Right Side - Notifications & User Profile */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-emerald-100 text-emerald-700"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 hover:bg-emerald-100 px-3 py-2 h-auto"
                  >
                    {/* Avatar */}
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-semibold shadow-md">
                      {avatarLetter}
                    </div>
                    {/* User Info */}
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-semibold text-emerald-900">{displayName}</span>
                      <span className="text-xs text-emerald-600">{displayEmail}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-emerald-600 hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-emerald-900">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-emerald-50">
                    <User className="mr-2 h-4 w-4 text-emerald-600" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-emerald-50">
                    <Store className="mr-2 h-4 w-4 text-emerald-600" />
                    <span>My Store</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-emerald-50">
                    <CreditCard className="mr-2 h-4 w-4 text-emerald-600" />
                    <span>Subscription</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-emerald-50">
                    <Settings className="mr-2 h-4 w-4 text-emerald-600" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-emerald-50">
                    <HelpCircle className="mr-2 h-4 w-4 text-emerald-600" />
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
