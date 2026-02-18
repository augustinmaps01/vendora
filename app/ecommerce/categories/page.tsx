"use client"

import { ProductCard } from "@/components/ecommerce/ProductCard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Monitor,
    Shirt,
    Home,
    Sparkles,
    Dumbbell,
    Gift,
    ChevronRight,
    Package
} from "lucide-react"
import Link from "next/link"

const CATEGORIES = [
    {
        id: "electronics",
        name: "Electronics",
        icon: Monitor,
        description: "Latest gadgets, computers, phones, and tech accessories",
        productCount: 2340,
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        image: "💻"
    },
    {
        id: "fashion",
        name: "Fashion",
        icon: Shirt,
        description: "Clothing, shoes, accessories for men and women",
        productCount: 1890,
        color: "from-pink-500 to-rose-600",
        bgColor: "bg-pink-50",
        image: "👕"
    },
    {
        id: "home",
        name: "Home & Living",
        icon: Home,
        description: "Furniture, decor, kitchen essentials, and more",
        productCount: 1560,
        color: "from-amber-500 to-orange-600",
        bgColor: "bg-amber-50",
        image: "🏠"
    },
    {
        id: "beauty",
        name: "Beauty & Care",
        icon: Sparkles,
        description: "Skincare, makeup, fragrances, and wellness products",
        productCount: 980,
        color: "from-purple-500 to-violet-600",
        bgColor: "bg-purple-50",
        image: "💄"
    },
    {
        id: "sports",
        name: "Sports & Outdoors",
        icon: Dumbbell,
        description: "Fitness equipment, outdoor gear, and sportswear",
        productCount: 750,
        color: "from-green-500 to-emerald-600",
        bgColor: "bg-green-50",
        image: "⚽"
    },
    {
        id: "gifts",
        name: "Gifts & Lifestyle",
        icon: Gift,
        description: "Unique gifts, party supplies, and lifestyle items",
        productCount: 620,
        color: "from-indigo-500 to-blue-600",
        bgColor: "bg-indigo-50",
        image: "🎁"
    },
]

// Mock featured products by category
const FEATURED_BY_CATEGORY: Record<string, any[]> = {
    electronics: [
        {
            id: "e1",
            name: "Wireless Mouse Pro",
            price: 59.00,
            category: "Electronics",
            image: "/placeholder.svg",
            rating: 4.8,
            reviewCount: 342,
        },
        {
            id: "e2",
            name: "USB-C Hub Adapter",
            price: 45.00,
            originalPrice: 65.00,
            category: "Electronics",
            image: "/placeholder.svg",
            badge: "30% OFF",
            badgeType: "discount" as const,
            rating: 4.7,
            reviewCount: 189,
        },
        {
            id: "e3",
            name: "Laptop Stand",
            price: 39.00,
            category: "Electronics",
            image: "/placeholder.svg",
            rating: 4.9,
            reviewCount: 456,
        },
        {
            id: "e4",
            name: "Webcam HD 1080p",
            price: 79.00,
            category: "Electronics",
            image: "/placeholder.svg",
            badge: "Best Seller",
            badgeType: "bestseller" as const,
            rating: 4.6,
            reviewCount: 267,
        },
    ],
}

export default function CategoriesPage() {

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 lg:px-8 py-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Shop by Category</h1>
                    <p className="text-lg text-gray-600">Browse products organized by category</p>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-12">
                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {CATEGORIES.map((category) => {
                        const Icon = category.icon
                        return (
                            <Link key={category.id} href={`/ecommerce/products?category=${category.name}`}>
                                <Card className="group overflow-hidden border-2 border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300 cursor-pointer">
                                    <div className="p-8">
                                        {/* Icon Container */}
                                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                            <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                                        </div>

                                        {/* Category Info */}
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-600 mb-4 leading-relaxed">
                                            {category.description}
                                        </p>

                                        {/* Product Count & Arrow */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Package className="w-4 h-4 text-gray-400" />
                                                <span className="font-semibold text-gray-700">
                                                    {category.productCount.toLocaleString()} products
                                                </span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>

                                    {/* Decorative Background */}
                                    <div className={`h-3 ${category.bgColor} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                                </Card>
                            </Link>
                        )
                    })}
                </div>

                {/* Featured in Electronics */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Featured in Electronics</h2>
                            <p className="text-gray-600">Top picks from our electronics category</p>
                        </div>
                        <Link href="/ecommerce/products?category=Electronics">
                            <Button variant="outline" className="hidden md:flex items-center gap-2">
                                View all
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURED_BY_CATEGORY.electronics?.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                {/* Popular Categories Quick Links */}
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Can't find what you're looking for?</h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Try browsing all products or use our search feature
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/ecommerce/products">
                                <Button size="lg" className="h-14 px-8 bg-white text-gray-900 hover:bg-gray-100 rounded-full font-bold shadow-xl w-full sm:w-auto">
                                    Browse all products
                                </Button>
                            </Link>
                            <Link href="/ecommerce/deals">
                                <Button size="lg" variant="outline" className="h-14 px-8 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full font-bold w-full sm:w-auto">
                                    View deals
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Category Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-white rounded-2xl border border-gray-200">
                        <div className="text-4xl font-black text-gray-900 mb-2">6</div>
                        <div className="text-sm text-gray-600 font-medium">Categories</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl border border-gray-200">
                        <div className="text-4xl font-black text-gray-900 mb-2">8K+</div>
                        <div className="text-sm text-gray-600 font-medium">Products</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl border border-gray-200">
                        <div className="text-4xl font-black text-gray-900 mb-2">150+</div>
                        <div className="text-sm text-gray-600 font-medium">Vendors</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl border border-gray-200">
                        <div className="text-4xl font-black text-gray-900 mb-2">24/7</div>
                        <div className="text-sm text-gray-600 font-medium">Support</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
