"use client"

import { Hero } from "@/components/ecommerce/Hero"
import { ProductCard } from "@/components/ecommerce/ProductCard"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, TrendingUp, Truck, ShieldCheck, Monitor, Shirt, Home, Sparkle, Dumbbell, Gift, Headphones } from "lucide-react"
import { Product } from "@/store/useCartStore"
import Image from "next/image"

// Mock Data
const FEATURED_PRODUCTS: (Product & {
    badge?: string
    badgeType?: "hot" | "bestseller" | "discount"
    originalPrice?: number
    rating?: number
    reviewCount?: number
})[] = [
    {
        id: "1",
        name: "Premium Wireless Headphones",
        price: 89.00,
        originalPrice: 119.00,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
        category: "Electronics",
        description: "Immersive sound experience with active noise cancellation.",
        badge: "Hot",
        badgeType: "hot",
        rating: 4.9,
        reviewCount: 240,
    },
    {
        id: "2",
        name: "Ultra Comfort Running Shoes",
        price: 129.00,
        originalPrice: 159.00,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
        category: "Fashion",
        description: "Lightweight running shoes with superior cushioning.",
        badge: "Best Seller",
        badgeType: "bestseller",
        rating: 4.8,
        reviewCount: 185,
    },
    {
        id: "3",
        name: "Cozy Knit Throw Blanket",
        price: 45.00,
        originalPrice: 65.00,
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=2070&auto=format&fit=crop",
        category: "Home & Living",
        description: "Soft and warm blanket for ultimate comfort.",
        badge: "-30%",
        badgeType: "discount",
        rating: 4.7,
        reviewCount: 156,
    },
    {
        id: "4",
        name: "Modern Desk Lamp",
        price: 79.00,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2058&auto=format&fit=crop",
        category: "Home & Living",
        description: "Adjustable LED desk lamp with touch control.",
        rating: 4.6,
        reviewCount: 92,
    },
]

const CATEGORIES = [
    {
        name: "Electronics",
        icon: Monitor,
        description: "Latest gadgets and tech essentials",
        count: "2,340 products",
    },
    {
        name: "Fashion",
        icon: Shirt,
        description: "Trendy clothing and accessories",
        count: "5,678 products",
    },
    {
        name: "Home & Living",
        icon: Home,
        description: "Furniture and home decor",
        count: "1,890 products",
    },
    {
        name: "Beauty & Care",
        icon: Sparkle,
        description: "Skincare and personal care",
        count: "3,245 products",
    },
    {
        name: "Sports & Outdoors",
        icon: Dumbbell,
        description: "Fitness gear and outdoor equipment",
        count: "1,567 products",
    },
    {
        name: "Gifts & Lifestyle",
        icon: Gift,
        description: "Perfect gifts for every occasion",
        count: "4,123 products",
    },
]

export default function EcommercePage() {
    return (
        <div className="flex flex-col">
            <Hero />

            {/* Features Section */}
            <section className="border-b bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="flex items-center gap-4 group">
                            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl text-blue-600 dark:text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base">Free Shipping</h3>
                                <p className="text-sm text-muted-foreground">On orders over $50</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl text-green-600 dark:text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base">Secure Payment</h3>
                                <p className="text-sm text-muted-foreground">100% protected</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl text-purple-600 dark:text-purple-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base">30 Day Returns</h3>
                                <p className="text-sm text-muted-foreground">Money back guarantee</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="bg-white">
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Shop by Category</h2>
                        <p className="text-base text-gray-600 mt-2">Browse curated collections for every lifestyle</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {CATEGORIES.map((category) => {
                            const Icon = category.icon
                            return (
                                <div
                                    key={category.name}
                                    className="group relative bg-gray-50 rounded-2xl p-6 md:p-7 cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
                                >
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        {/* Icon */}
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                                            <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} />
                                        </div>

                                        {/* Category Name */}
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">{category.name}</h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>

                                        {/* Product Count */}
                                        <p className="text-xs text-gray-500 font-medium">{category.count}</p>

                                        {/* View Products Link */}
                                        <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 group-hover:gap-2.5 transition-all">
                                            View products
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Why Shop With Us Section */}
            <section className="bg-gradient-to-b from-blue-50/30 to-gray-50/30">
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Why Shop with ShopSphere?</h2>
                        <p className="text-base text-gray-600 mt-2 max-w-2xl mx-auto">Experience a smoother, safer, and happier way to shop.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                        {/* Fast, Free Shipping */}
                        <div className="group bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex flex-col items-center text-center space-y-4">
                                {/* Icon Circle */}
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <Truck className="w-8 h-8 text-white" strokeWidth={2} />
                                    </div>
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full"></div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900">Fast, Free Shipping</h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Get your orders delivered quickly at no extra cost. We offer free shipping on all orders over $50 with tracking included.
                                </p>
                            </div>
                        </div>

                        {/* Secure Checkout */}
                        <div className="group bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex flex-col items-center text-center space-y-4">
                                {/* Icon Circle */}
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <ShieldCheck className="w-8 h-8 text-white" strokeWidth={2} />
                                    </div>
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-green-500 rounded-full"></div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900">Secure Checkout</h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Shop with confidence knowing your payment information is protected with bank-level encryption and security measures.
                                </p>
                            </div>
                        </div>

                        {/* 24/7 Support */}
                        <div className="group bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex flex-col items-center text-center space-y-4">
                                {/* Icon Circle */}
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <Headphones className="w-8 h-8 text-white" strokeWidth={2} />
                                    </div>
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-purple-500 rounded-full"></div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900">24/7 Support</h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Our dedicated customer support team is always available to assist you with any questions or concerns you may have.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="bg-white">
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Featured Products</h2>
                        <button className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:gap-2.5 transition-all group">
                            View all products
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
                        {FEATURED_PRODUCTS.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {/* Mobile View All Button */}
                    <div className="mt-8 flex justify-center md:hidden">
                        <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:gap-2.5 transition-all px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-full">
                            View all products
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Promotional Banner */}
            <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 shadow-2xl">
                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                    </div>

                    <div className="relative grid lg:grid-cols-2 gap-8 items-center p-8 md:p-12 lg:p-16">
                        {/* Left Content */}
                        <div className="space-y-6 text-center lg:text-left">
                            {/* Eyebrow Label */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                                <Sparkles className="w-4 h-4 text-white" />
                                <span className="text-sm font-bold text-white tracking-wide">Limited Time Offer</span>
                            </div>

                            {/* Headline */}
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                                Up to 40% Off <br className="hidden md:block" />
                                Selected Collections
                            </h2>

                            {/* Subheading */}
                            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl">
                                Shop our exclusive deals before they're gone. Discover premium products at unbeatable prices.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto h-14 px-8 bg-white text-indigo-600 hover:bg-gray-100 rounded-full font-bold text-base shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                                >
                                    Shop the Sale
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <button className="w-full sm:w-auto h-14 px-8 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full font-bold text-base transition-all">
                                    View Terms
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Floating Product Cards */}
                        <div className="relative hidden lg:flex items-center justify-center h-[400px]">
                            {/* Product Card 1 - Headphones */}
                            <div className="absolute top-0 left-0 w-48 bg-white rounded-2xl shadow-2xl p-4 transform hover:scale-105 transition-all animate-float">
                                <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
                                    <Image
                                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop"
                                        alt="Headphones"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 font-medium">Electronics</p>
                                    <p className="text-sm font-bold text-gray-900">Premium Headphones</p>
                                    <p className="text-lg font-black text-indigo-600">$89.00</p>
                                </div>
                            </div>

                            {/* Product Card 2 - Sneakers */}
                            <div className="absolute top-20 right-0 w-48 bg-white rounded-2xl shadow-2xl p-4 transform hover:scale-105 transition-all animate-float-delay">
                                <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
                                    <Image
                                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop"
                                        alt="Sneakers"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 font-medium">Fashion</p>
                                    <p className="text-sm font-bold text-gray-900">Running Shoes</p>
                                    <p className="text-lg font-black text-indigo-600">$129.00</p>
                                </div>
                            </div>

                            {/* Product Card 3 - Home Decor */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 bg-white rounded-2xl shadow-2xl p-4 transform hover:scale-105 transition-all animate-float-slow">
                                <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
                                    <Image
                                        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop"
                                        alt="Desk Lamp"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 font-medium">Home & Living</p>
                                    <p className="text-sm font-bold text-gray-900">Modern Desk Lamp</p>
                                    <p className="text-lg font-black text-indigo-600">$79.00</p>
                                </div>
                            </div>

                            {/* Glow Effects */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                        </div>

                        {/* Mobile Product Illustration */}
                        <div className="lg:hidden flex items-center justify-center mt-8">
                            <div className="grid grid-cols-2 gap-4 max-w-sm">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                                    <div className="text-3xl mb-2">🎧</div>
                                    <p className="text-sm font-bold text-white">Electronics</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                                    <div className="text-3xl mb-2">👟</div>
                                    <p className="text-sm font-bold text-white">Fashion</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
