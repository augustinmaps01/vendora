"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingBag, User, Menu, Heart } from "lucide-react"
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
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useState, useEffect } from "react"

export function Navbar() {
    const pathname = usePathname()
    const { items, setOpen } = useCartStore()
    const [isScrolled, setIsScrolled] = useState(false)
    const cartCount = items.length

    // Handle scroll effect for elevated navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

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
            <div className="container mx-auto px-4 lg:px-8 xl:px-12">
                {/* Mobile Navigation Bar */}
                <div className="flex items-center justify-between h-16 lg:hidden">
                    {/* Mobile Logo */}
                    <Link
                        href="/ecommerce"
                        className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                    >
                        ShopSphere
                    </Link>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-1">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Open menu"
                                >
                                    <Menu className="w-5 h-5 text-gray-700" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] bg-white">
                                <SheetHeader>
                                    <SheetTitle className="text-left">
                                        <Link
                                            href="/ecommerce"
                                            className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                                        >
                                            ShopSphere
                                        </Link>
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="flex flex-col gap-6 mt-6">
                                    {/* Mobile Search */}
                                    <div className="flex items-center relative">
                                        <Search className="absolute left-4 w-4 h-4 text-gray-400" />
                                        <Input
                                            placeholder="Search products…"
                                            className="pl-11 h-11 bg-gray-50 border-gray-200 rounded-full focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:border-gray-900"
                                        />
                                    </div>

                                    {/* Mobile Navigation Links */}
                                    <nav className="flex flex-col gap-1">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={cn(
                                                    "text-base font-medium px-3 py-2.5 rounded-lg transition-all",
                                                    pathname === link.href
                                                        ? "bg-gray-900 text-white"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                )}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Mobile Cart Icon */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => setOpen(true)}
                            aria-label="Shopping cart"
                        >
                            <ShoppingBag className="w-5 h-5 text-gray-700" />
                            {(cartCount > 0 || true) && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
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
