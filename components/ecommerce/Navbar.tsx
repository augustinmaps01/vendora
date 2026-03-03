"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ShoppingBag, Sun, Moon, UtensilsCrossed, User2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCartStore } from "@/store/useCartStore"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

const BUYER_TOKEN_KEY = "rbtesa_buyer_token"
const BUYER_USER_KEY = "rbtesa_buyer_user"

type BuyerUser = {
    id: number
    name: string
    email: string
    user_type: string
}

export function Navbar() {
    const pathname = usePathname()
    const { items, setOpen } = useCartStore()
    const { setTheme, resolvedTheme } = useTheme()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [buyer, setBuyer] = useState<BuyerUser | null>(null)
    const cartCount = items.length

    useEffect(() => {
        setIsMounted(true)
        try {
            const stored = localStorage.getItem(BUYER_USER_KEY)
            if (stored) setBuyer(JSON.parse(stored))
        } catch { /* ignore */ }
    }, [])

    // Listen for storage changes (login/logout from the food-menu page)
    useEffect(() => {
        const onStorage = () => {
            try {
                const stored = localStorage.getItem(BUYER_USER_KEY)
                setBuyer(stored ? JSON.parse(stored) : null)
            } catch { setBuyer(null) }
        }
        window.addEventListener("storage", onStorage)
        // Also poll for same-tab changes
        const interval = setInterval(onStorage, 1000)
        return () => {
            window.removeEventListener("storage", onStorage)
            clearInterval(interval)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem(BUYER_TOKEN_KEY)
        localStorage.removeItem(BUYER_USER_KEY)
        setBuyer(null)
        window.dispatchEvent(new Event("storage"))
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled ? "backdrop-blur-xl shadow-md border-b" : "backdrop-blur-sm border-b"
            }`}
            style={{
                backgroundColor: '#110228',
                borderBottomColor: isScrolled ? '#7C3AED' : '#1a0440'
            }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Left: Logo + Shop */}
                    <div className="flex items-center gap-10 sm:gap-14">
                        <Link href="/ecommerce/rbtesa/products" className="flex items-center">
                            <Image
                                src="/new-logo/website logo white.png"
                                alt="Vendora"
                                width={120}
                                height={36}
                                className="h-8 w-auto object-contain"
                                priority
                            />
                        </Link>

                        <Link
                            href="/ecommerce/rbtesa/products"
                            className="text-sm font-medium relative py-1 transition-all text-white hover:text-white/80"
                        >
                            Shop
                            <span
                                className="absolute left-0 bottom-0 h-0.5 rounded-full transition-all duration-300"
                                style={{
                                    backgroundColor: '#7C3AED',
                                    width: pathname === "/ecommerce/rbtesa/products" ? '100%' : '0',
                                }}
                            />
                        </Link>

                        <Link
                            href="/ecommerce/rbtesa/food-menu"
                            className="flex items-center gap-1.5 text-sm font-medium relative py-1 transition-all text-white hover:text-white/80"
                        >
                            <UtensilsCrossed className="w-4 h-4" />
                            Food Menu
                            <span
                                className="absolute left-0 bottom-0 h-0.5 rounded-full transition-all duration-300"
                                style={{
                                    backgroundColor: '#7C3AED',
                                    width: pathname === "/ecommerce/rbtesa/food-menu" ? '100%' : '0',
                                }}
                            />
                        </Link>
                    </div>

                    {/* Right: User + Theme Toggle + Cart */}
                    <div className="flex items-center gap-2">
                        {/* User Icon / Authenticated User Dropdown */}
                        {isMounted && (
                            buyer ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] hover:bg-white/[0.14] transition-colors outline-none">
                                            <div
                                                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-black shrink-0"
                                                style={{ backgroundColor: '#7C3AED' }}
                                            >
                                                {buyer.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
                                            </div>
                                            <span className="text-xs font-semibold text-white/90 max-w-[100px] truncate hidden sm:block">
                                                {buyer.name}
                                            </span>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>
                                            <p className="text-sm font-semibold">{buyer.name}</p>
                                            <p className="text-xs text-muted-foreground">{buyer.email}</p>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Sign out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/ecommerce/rbtesa/food-menu">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="relative h-10 w-10 rounded-full text-white hover:bg-white/10"
                                        title="Sign in"
                                    >
                                        <User2 className="h-5 w-5" />
                                    </Button>
                                </Link>
                            )
                        )}

                        {/* Theme Toggle */}
                        {isMounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="relative h-10 w-10 rounded-full text-white hover:bg-white/10"
                                title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                            >
                                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        )}

                        {/* Cart Icon */}
                        {isMounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-10 w-10 rounded-full transition-colors active:scale-95 text-white"
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => setOpen(true)}
                                aria-label="Shopping cart"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg"
                                        style={{ backgroundColor: '#7C3AED' }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
