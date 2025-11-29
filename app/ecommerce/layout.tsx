"use client"

import { Navbar } from "@/components/ecommerce/Navbar"
import { Footer } from "@/components/ecommerce/Footer"
import { CartSheet } from "@/components/ecommerce/CartSheet"
import { usePathname } from "next/navigation"

export default function EcommerceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isLandingPage = pathname === "/ecommerce/landing"

    // Landing page has its own navbar and footer, so we don't wrap it
    if (isLandingPage) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartSheet />
        </div>
    )
}
