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
                    ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-200/60"
                    : "bg-white/98 backdrop-blur-sm border-b border-gray-100"
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
                {/* Mobile Navigation Bar */}
                <div className="flex items-center justify-between h-16 lg:hidden">
                    {/* Mobile Logo */}
                    <Link
                        href="/ecommerce"
                        className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                    >
                        ShopSphere
                    </Link>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {isMounted && (
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
                                        aria-label="Open menu"
                                    >
                                        <Menu className="w-5 h-5 text-gray-700" />
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
                            className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
                            onClick={() => setOpen(true)}
                            aria-label="Shopping cart"
                        >
                            <ShoppingBag className="w-5 h-5 text-gray-700" />
                            {(cartCount > 0 || true) && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
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
                        className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent hover:from-gray-800 hover:to-gray-600 transition-all"
                    >
                        ShopSphere
                    </Link>

                    {/* Center Navigation Links */}
                    <nav className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-all relative group py-1",
                                    pathname === link.href
                                        ? "text-gray-900"
                                        : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                {link.label}
                                <span
                                    className={cn(
                                        "absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-700 transition-all duration-300 rounded-full",
                                        pathname === link.href
                                            ? "w-full"
                                            : "w-0 group-hover:w-full"
                                    )}
                                />
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="ml-auto flex items-center gap-2">
                        {/* Search Bar */}
                        <div className="flex items-center relative w-[340px]">
                            <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" />
                            <Input
                                placeholder="Search products…"
                                className="w-full pl-11 pr-4 h-10 bg-gray-50/80 border-gray-200 rounded-full text-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:border-gray-900 focus-visible:bg-white transition-all"
                            />
                        </div>

                        {/* Action Icons */}
                        <div className="flex items-center gap-1 ml-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="User account"
                            >
                                <User className="w-5 h-5 text-gray-700" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Wishlist"
                            >
                                <Heart className="w-5 h-5 text-gray-700" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative rounded-full hover:bg-gray-100 transition-colors"
                                onClick={() => setOpen(true)}
                                aria-label="Shopping cart"
                            >
                                <ShoppingBag className="w-5 h-5 text-gray-700" />
                                {(cartCount > 0 || true) && (
                                    <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
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
