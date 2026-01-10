"use client"

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
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
  Megaphone,
  Calculator,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react"
import { NotificationPanel } from "@/components/pos/NotificationPanel"

// Sidebar menu structure based on data.docx
const sidebarSections = [
  {
    title: "Primary Menus",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/pos/dashboard", comingSoon: false },
      { icon: ShoppingCart, label: "POS", href: "/pos/pos-screen", comingSoon: false },
      { icon: Package, label: "Products", href: "/pos/products", comingSoon: false },
      { icon: PackageOpen, label: "Inventory", href: "/pos/inventory", comingSoon: false },
      { icon: ClipboardList, label: "Orders", href: "/pos/orders", comingSoon: false },
      { icon: Users, label: "Customers", href: "/pos/customers", comingSoon: false },
    ]
  },
  {
    title: "Growth & Finance",
    items: [
      { icon: Store, label: "E-commerce Store", href: "/pos/ecommerce", comingSoon: false },
      { icon: CreditCard, label: "Payments", href: "/pos/payments", comingSoon: false },
      { icon: BarChart3, label: "Reports and Analytics", href: "/pos/reports", comingSoon: true },
      { icon: Megaphone, label: "Marketing and Ads", href: "/pos/marketing", comingSoon: true },
    ]
  },
  {
    title: "Management",
    items: [
      { icon: Calculator, label: "Accounting", href: "/pos/accounting", comingSoon: true },
      { icon: Settings, label: "Settings", href: "/pos/settings", comingSoon: true },
      { icon: HelpCircle, label: "Help and Support", href: "/pos/help", comingSoon: true },
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false)
  const [mobileSidebarMoreOpen, setMobileSidebarMoreOpen] = useState(false)
  const [userData, setUserData] = useState<{ business_name?: string; email?: string } | null>(null)

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
      } catch {
        // Silently fail - backend not connected yet
        setUserData({
          business_name: 'Bunya Retail Shop',
          email: 'vendor@bunyaretail.com'
        })
      }
    }

    if (!pathname?.startsWith("/pos/auth")) {
      fetchUserData()
    }
  }, [pathname])

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

  // Get all menu items for mobile view
  const visibleMobileItems = 4 // Show first 4 items on mobile
  const allItems = sidebarSections.flatMap(section => section.items)
  const mobileVisibleItems = allItems.slice(0, visibleMobileItems)
  const mobileMoreItems = allItems.slice(visibleMobileItems)

  // For non-auth pages, render with sidebar and navigation
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => {
            setSidebarOpen(false)
            setMobileSidebarMoreOpen(false)
          }}
        />
      )}

      {/* Collapse Toggle Button (Desktop Only) - Hidden on Mobile, View More used instead */}
      <div className={`fixed z-50 hidden md:block top-20 transition-all duration-300 ${sidebarCollapsed ? 'left-[68px]' : 'left-[244px]'}`}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-6 h-6 bg-white border-purple-300 rounded-full shadow-lg hover:bg-gray-100"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-purple-700" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-purple-700" />
          )}
        </Button>
      </div>

      {/* Sidebar - Mobile: Full width with hamburger toggle | Desktop: Collapsible */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 border-r border-purple-900 z-40
          transform transition-all duration-300 ease-in-out overflow-hidden flex flex-col
          md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${sidebarCollapsed ? "md:w-20" : "md:w-64"}
        `}
        style={{ backgroundColor: '#110228' }}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-6 border-b border-white/20 transition-all duration-300 flex-shrink-0 ${sidebarCollapsed ? 'md:px-2 md:justify-center' : ''}`}>
          <div className={`flex items-center gap-2 transition-all duration-300 ${sidebarCollapsed ? 'md:justify-center md:w-full' : ''}`}>
            <div className="relative flex items-center justify-center w-8 h-8 rounded">
              <Image src="/logos/logo.png" alt="Vendora Logo" width={32} height={32} className="object-contain" />
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'md:hidden' : ''}`}>
              <h1 className="text-lg font-bold text-white whitespace-nowrap">Vendora</h1>
              <p className="text-xs text-white/80 whitespace-nowrap">Vendor Dashboard</p>
            </div>
          </div>
        </div>

        {/* Search - Always visible on mobile, hidden when collapsed on desktop */}
        <div className={`px-4 py-3 flex-shrink-0 ${sidebarCollapsed ? 'md:hidden' : ''}`}>
          <div className="relative">
            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-white/60" />
            <input
              type="text"
              placeholder="Search menu"
              className="w-full py-2 pl-10 pr-4 text-sm text-white border rounded-lg bg-white/10 border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 min-h-0 px-3 pt-2 pb-4 overflow-y-auto overflow-x-hidden transition-all duration-300 ${sidebarCollapsed ? 'md:px-2' : ''}`}>
          <div className="space-y-4">
            {/* Mobile: Show only Primary Menus + View More button */}
            <div className="md:hidden">
              {/* Primary Menus Section */}
              <div>
                <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider uppercase text-white/70">
                  {sidebarSections[0].title}
                </h3>
                <ul className="space-y-1">
                  {sidebarSections[0].items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || (item.href === "/pos/pos-screen" && pathname === "/pos")

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => {
                            setSidebarOpen(false)
                            setMobileSidebarMoreOpen(false)
                          }}
                          className={`
                            relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                            transition-all duration-200
                            ${
                              isActive
                                ? "bg-white text-purple-700 font-medium shadow-lg"
                                : "text-white/90 hover:bg-white/10 hover:text-white"
                            }
                          `}
                        >
                          <Icon className="flex-shrink-0 w-5 h-5" />
                          <span className="flex-1">{item.label}</span>
                          {item.comingSoon && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-white whitespace-nowrap shadow-sm">
                              Soon
                            </span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* View More Button */}
              <div className="mt-4">
                <button
                  onClick={() => setMobileSidebarMoreOpen(!mobileSidebarMoreOpen)}
                  className={`
                    w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm
                    transition-all duration-200
                    ${mobileSidebarMoreOpen ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10 hover:text-white"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <MoreVertical className="flex-shrink-0 w-5 h-5" />
                    <span className="flex-1">View More</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileSidebarMoreOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* View More Dropdown Content - Always rendered, shown/hidden with CSS */}
                <div className={`mt-2 space-y-4 pl-4 overflow-hidden transition-all duration-300 ${
                  mobileSidebarMoreOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {sidebarSections.slice(1).map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider uppercase text-white/60">
                        {section.title}
                      </h3>
                      <ul className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon
                          const isActive = pathname === item.href

                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => {
                                  setSidebarOpen(false)
                                  setMobileSidebarMoreOpen(false)
                                }}
                                className={`
                                  relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                                  transition-all duration-200
                                  ${
                                    isActive
                                      ? "bg-white text-purple-700 font-medium shadow-lg"
                                      : "text-white/90 hover:bg-white/10 hover:text-white"
                                  }
                                `}
                              >
                                <Icon className="flex-shrink-0 w-5 h-5" />
                                <span className="flex-1">{item.label}</span>
                                {item.comingSoon && (
                                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-white whitespace-nowrap shadow-sm">
                                    Soon
                                  </span>
                                )}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop: Show all sections normally */}
            <div className="hidden md:block">
              {sidebarSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-4">
                  {/* Section Title - Hidden when collapsed on desktop */}
                  <h3 className={`px-3 mb-1.5 text-xs font-semibold tracking-wider uppercase text-white/70 ${sidebarCollapsed ? 'md:hidden' : ''}`}>
                    {section.title}
                  </h3>

                  {/* Section Items */}
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href || (item.href === "/pos/pos-screen" && pathname === "/pos")

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`
                              relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                              transition-all duration-200 group
                              ${sidebarCollapsed ? 'md:justify-center md:px-2' : ''}
                              ${
                                isActive
                                  ? "bg-white text-purple-700 font-medium shadow-lg"
                                  : "text-white/90 hover:bg-white/10 hover:text-white"
                              }
                            `}
                            title={sidebarCollapsed ? item.label : ''}
                          >
                            <Icon className="flex-shrink-0 w-5 h-5" />
                            <span className={`flex-1 ${sidebarCollapsed ? 'md:hidden' : ''}`}>{item.label}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-white whitespace-nowrap shadow-sm ${sidebarCollapsed ? 'md:hidden' : ''} ${item.comingSoon ? '' : 'hidden'}`}>
                              Soon
                            </span>

                            {/* Tooltip for collapsed state - Desktop only */}
                            {sidebarCollapsed && (
                              <div className="hidden md:block absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-[100] shadow-xl">
                                <div className="flex items-center gap-2">
                                  <span>{item.label}</span>
                                  {item.comingSoon && (
                                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-purple-500 to-violet-600 shadow-sm">
                                      Soon
                                    </span>
                                  )}
                                </div>
                                {/* Arrow */}
                                <div className="absolute -translate-y-1/2 border-4 border-transparent right-full top-1/2 border-r-gray-900"></div>
                              </div>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 bg-gray-50 overflow-x-hidden ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-30 flex items-center h-16 w-full px-6 border-b md:sticky md:left-auto md:right-auto md:w-auto" style={{ backgroundColor: '#2e0f5f', borderColor: '#1f0a3d' }}>
          <div className="flex items-center justify-between flex-1">
            {/* Left Side - Logo (Mobile) / Title & Search (Desktop) */}
            <div className="flex items-center flex-1 gap-4">
              {/* Mobile: Clickable Logo to open sidebar */}
              <button
                onClick={() => {
                  setSidebarOpen(!sidebarOpen)
                  if (sidebarOpen) setMobileSidebarMoreOpen(false)
                }}
                className="flex items-center gap-2 md:hidden"
              >
                <div className="relative flex items-center justify-center w-8 h-8 rounded">
                  <Image src="/logos/logo.png" alt="Vendora Logo" width={32} height={32} className="object-contain" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Vendora</h1>
                </div>
              </button>

              {/* Desktop: Title */}
              <h2 className="hidden text-xl font-semibold text-white md:block">POS System</h2>

              {/* Search Bar */}
              <div className="items-center hidden w-full max-w-md gap-2 px-4 py-2 ml-4 border rounded-lg lg:flex bg-white/10 border-white/20">
                <Search className="w-4 h-4 text-white/70" />
                <input
                  type="text"
                  placeholder="Search products, customers..."
                  className="w-full text-sm text-white bg-transparent border-none outline-none placeholder:text-white/60"
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
                    className="flex items-center h-auto gap-3 px-3 py-2 hover:bg-white/10"
                  >
                    {/* Avatar */}
                    <div className="flex items-center justify-center font-semibold text-purple-700 bg-white rounded-full h-9 w-9">
                      {avatarLetter}
                    </div>
                    {/* User Info */}
                    <div className="flex-col items-start hidden md:flex">
                      <span className="text-sm font-semibold text-white">{displayName}</span>
                      <span className="text-xs text-white/70">{displayEmail}</span>
                    </div>
                    <ChevronDown className="hidden w-4 h-4 text-white md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-gray-900">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                    <User className="w-4 h-4 mr-2 text-gray-600" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                    <Store className="w-4 h-4 mr-2 text-gray-600" />
                    <span>My Store</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                    <CreditCard className="w-4 h-4 mr-2 text-gray-600" />
                    <span>Subscription</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                    <Settings className="w-4 h-4 mr-2 text-gray-600" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                    <HelpCircle className="w-4 h-4 mr-2 text-gray-600" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
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
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="max-w-full px-6 pt-24 pb-24 overflow-x-hidden md:p-6 md:pb-6">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t md:hidden" style={{ backgroundColor: '#110228', borderColor: '#2e0f5f' }}>
          <div className="grid grid-cols-5 gap-1 px-2 py-2">
            {/* First 4 visible items */}
            {mobileVisibleItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href === "/pos/pos-screen" && pathname === "/pos")

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative flex flex-col items-center justify-center gap-1 p-2 rounded-lg
                    transition-all duration-200
                    ${isActive ? 'bg-white text-purple-700' : 'text-white/90'}
                  `}
                >
                  <Icon className="flex-shrink-0 w-5 h-5" />
                  <span className="text-[10px] font-medium truncate max-w-full">
                    {item.label.split(' ')[0]}
                  </span>
                  {item.comingSoon && (
                    <span className="absolute w-2 h-2 bg-purple-500 rounded-full shadow-sm top-1 right-1"></span>
                  )}
                </Link>
              )
            })}

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                className={`
                  w-full flex flex-col items-center justify-center gap-1 p-2 rounded-lg
                  transition-all duration-200
                  ${mobileMoreOpen ? 'bg-white text-purple-700' : 'text-white/90'}
                `}
              >
                <MoreVertical className="w-5 h-5" />
                <span className="text-[10px] font-medium">More</span>
              </button>

              {/* More Items Dropdown - Always rendered, shown/hidden with CSS */}
              <div
                className={`fixed inset-0 z-40 transition-opacity duration-200 ${
                  mobileMoreOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setMobileMoreOpen(false)}
              />
              <div className={`absolute bottom-full right-0 mb-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[60vh] overflow-y-auto transition-all duration-200 ${
                mobileMoreOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}>
                <div className="p-2 border-b bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-700">More Options</h3>
                </div>
                <div className="p-1">
                  {mobileMoreItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMoreOpen(false)}
                        className={`
                          relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                          transition-all duration-200
                          ${isActive ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                        `}
                      >
                        <Icon className="flex-shrink-0 w-5 h-5" />
                        <span className="flex-1">{item.label}</span>
                        {item.comingSoon && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-sm">
                            Soon
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
