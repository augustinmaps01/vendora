"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingBag, User, Menu, Heart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/store/useCartStore"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useState, useEffect } from "react"

export function Navbar() {
    const pathname = usePathname()
    const { items, setOpen } = useCartStore()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const cartCount = items.length

    // Handle client-side mounting to prevent hydration errors
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Handle scroll effect for elevated navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    const navLinks = [
        { href: "/ecommerce", label: "Home" },
        { href: "/ecommerce/products", label: "Shop" },
        { href: "/ecommerce/new", label: "New Arrivals" },
        { href: "/ecommerce/categories", label: "Categories" },
        { href: "/ecommerce/deals", label: "Deals" },
        { href: "/ecommerce/contact", label: "Contact" },
    ]

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                isScrolled
                    ? "backdrop-blur-xl shadow-md border-b"
                    : "backdrop-blur-sm border-b"
            )}
            style={{
                backgroundColor: '#110228',
                borderBottomColor: isScrolled ? '#26D5FF' : '#1a0440'
            }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
                {/* Mobile Navigation Bar */}
                <div className="flex items-center justify-between h-16 lg:hidden">
                    {/* Mobile Logo */}
                    <Link
                        href="/ecommerce"
                        className="text-xl sm:text-2xl font-bold tracking-tight"
                        style={{ color: '#26D5FF' }}
                    >
                        Vendora
                    </Link>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {isMounted && (
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-full transition-colors active:scale-95"
                                        style={{ color: '#26D5FF' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(38, 213, 255, 0.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        aria-label="Open menu"
                                    >
                                        <Menu className="w-5 h-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="w-[85vw] max-w-[320px] bg-white p-0 border-r-2 border-gray-100 [&>button]:hidden"
                                >
                                    {/* Visually Hidden Title for Accessibility */}
                                    <VisuallyHidden>
                                        <SheetTitle>Navigation Menu</SheetTitle>
                                    </VisuallyHidden>

                                    {/* Custom Header with Close Button */}
                                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                                        <Link
                                            href="/ecommerce"
                                            className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            ShopSphere
                                        </Link>
                                        <SheetClose asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-full hover:bg-gray-100"
                                            >
                                                <X className="h-5 w-5 text-gray-500" />
                                            </Button>
                                        </SheetClose>
                                    </div>

                                    <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
                                        <div className="flex flex-col gap-6 p-6">
                                            {/* Mobile Search */}
                                            <div className="flex items-center relative">
                                                <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" />
                                                <Input
                                                    placeholder="Search products…"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="pl-11 pr-4 h-12 bg-gray-50 border-gray-200 rounded-full focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:border-gray-900 text-base"
                                                />
                                            </div>

                                            {/* Mobile Navigation Links */}
                                            <nav className="flex flex-col gap-2">
                                                {navLinks.map((link) => (
                                                    <SheetClose asChild key={link.href}>
                                                        <Link
                                                            href={link.href}
                                                            className={cn(
                                                                "text-base font-medium px-4 py-3.5 rounded-xl transition-all active:scale-95",
                                                                pathname === link.href
                                                                    ? "bg-gray-900 text-white shadow-md"
                                                                    : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                                                            )}
                                                        >
                                                            {link.label}
                                                        </Link>
                                                    </SheetClose>
                                                ))}
                                            </nav>

                                            {/* Divider */}
                                            <div className="h-px bg-gray-200 my-2" />

                                            {/* User Actions */}
                                            <div className="flex flex-col gap-3">
                                                <SheetClose asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start h-12 px-4 rounded-xl border-gray-200 hover:bg-gray-50 active:scale-95"
                                                    >
                                                        <User className="w-5 h-5 mr-3 text-gray-600" />
                                                        <span className="text-base font-medium text-gray-700">My Account</span>
                                                    </Button>
                                                </SheetClose>
                                                <SheetClose asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start h-12 px-4 rounded-xl border-gray-200 hover:bg-gray-50 active:scale-95"
                                                    >
                                                        <Heart className="w-5 h-5 mr-3 text-gray-600" />
                                                        <span className="text-base font-medium text-gray-700">Wishlist</span>
                                                    </Button>
                                                </SheetClose>
                                            </div>
                                        </div>

                                        {/* Mobile Menu Footer */}
                                        <div className="mt-auto p-6 bg-gray-50 border-t border-gray-200">
                                            <p className="text-sm text-gray-500 text-center">
                                                Need help? Contact our support team 24/7
                                            </p>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        )}

                        {/* Mobile Cart Icon */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative h-10 w-10 rounded-full transition-colors active:scale-95"
                            style={{ color: '#26D5FF' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(38, 213, 255, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onClick={() => setOpen(true)}
                            aria-label="Shopping cart"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {(cartCount > 0 || true) && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#26D5FF' }}>
                                    {cartCount > 0 ? cartCount : 3}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Desktop Navigation Bar */}
                <div className="hidden lg:flex items-center h-20 gap-10">
                    {/* Logo */}
                    <Link
                        href="/ecommerce"
                        className="text-2xl font-bold tracking-tight transition-all"
                        style={{ color: '#26D5FF' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#1ea8d8'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#26D5FF'}
                    >
                        Vendora
                    </Link>

                    {/* Center Navigation Links */}
                    <nav className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium transition-all relative group py-1"
                                style={{
                                    color: pathname === link.href ? '#26D5FF' : '#ffffff'
                                }}
                                onMouseEnter={(e) => {
                                    if (pathname !== link.href) e.currentTarget.style.color = '#26D5FF'
                                }}
                                onMouseLeave={(e) => {
                                    if (pathname !== link.href) e.currentTarget.style.color = '#ffffff'
                                }}
                            >
                                {link.label}
                                <span
                                    className="absolute left-0 bottom-0 h-0.5 transition-all duration-300 rounded-full"
                                    style={{
                                        backgroundColor: '#26D5FF',
                                        width: pathname === link.href ? '100%' : '0'
                                    }}
                                />
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="ml-auto flex items-center gap-2">
                        {/* Search Bar */}
                        <div className="flex items-center relative w-[340px]">
                            <Search className="absolute left-4 w-4 h-4 pointer-events-none" style={{ color: '#26D5FF' }} />
                            <Input
                                placeholder="Search products…"
                                className="w-full pl-11 pr-4 h-10 rounded-full text-sm transition-all text-white placeholder:text-gray-400"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderColor: '#26D5FF'
                                }}
                            />
                        </div>

                        {/* Action Icons */}
                        <div className="flex items-center gap-1 ml-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full transition-colors"
                                style={{ color: '#26D5FF' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(38, 213, 255, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                aria-label="User account"
                            >
                                <User className="w-5 h-5" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full transition-colors"
                                style={{ color: '#26D5FF' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(38, 213, 255, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                aria-label="Wishlist"
                            >
                                <Heart className="w-5 h-5" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative rounded-full transition-colors"
                                style={{ color: '#26D5FF' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(38, 213, 255, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => setOpen(true)}
                                aria-label="Shopping cart"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {(cartCount > 0 || true) && (
                                    <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1.5 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#26D5FF' }}>
                                        {cartCount > 0 ? cartCount : 3}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
