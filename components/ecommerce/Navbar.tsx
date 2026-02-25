"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"
import { useState, useEffect } from "react"

export function Navbar() {
    const pathname = usePathname()
    const { items, setOpen } = useCartStore()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const cartCount = items.length

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled ? "backdrop-blur-xl shadow-md border-b" : "backdrop-blur-sm border-b"
            }`}
            style={{
                backgroundColor: '#110228',
                borderBottomColor: isScrolled ? '#26D5FF' : '#1a0440'
            }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Left: Logo + Shop */}
                    <div className="flex items-center gap-10 sm:gap-14">
                        <Link
                            href="/ecommerce/products"
                            className="text-xl sm:text-2xl font-bold tracking-tight transition-all"
                            style={{ color: '#26D5FF' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#1ea8d8'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#26D5FF'}
                        >
                            Vendora
                        </Link>

                        <Link
                            href="/ecommerce/products"
                            className="text-sm font-medium relative py-1 transition-all"
                            style={{
                                color: pathname === "/ecommerce/products" ? '#26D5FF' : '#ffffff',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#26D5FF' }}
                            onMouseLeave={(e) => {
                                if (pathname !== "/ecommerce/products") e.currentTarget.style.color = '#ffffff'
                            }}
                        >
                            Shop
                            <span
                                className="absolute left-0 bottom-0 h-0.5 rounded-full transition-all duration-300"
                                style={{
                                    backgroundColor: '#26D5FF',
                                    width: pathname === "/ecommerce/products" ? '100%' : '0',
                                }}
                            />
                        </Link>
                    </div>

                    {/* Cart Icon */}
                    {isMounted && (
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
                            {cartCount > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg"
                                    style={{ backgroundColor: '#26D5FF' }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
