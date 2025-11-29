"use client"

import { ProductCard } from "@/components/ecommerce/ProductCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Sparkles, TrendingUp, Clock, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"

// Mock new arrivals data
const NEW_ARRIVALS = [
    {
        id: "101",
        name: "Ultra HD 4K Monitor",
        price: 399.00,
        originalPrice: 549.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200&auto=format&fit=crop",
        badge: "New",
        badgeType: "hot" as const,
        rating: 4.9,
        reviewCount: 45,
        vendor: "TechHub",
        daysAgo: 1
    },
    {
        id: "102",
        name: "Wireless Earbuds Pro",
        price: 149.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1200&auto=format&fit=crop",
        badge: "New",
        badgeType: "hot" as const,
        rating: 4.8,
        reviewCount: 89,
        vendor: "GadgetZone",
        daysAgo: 2
    },
    {
        id: "103",
        name: "Sustainable Cotton T-Shirt",
        price: 29.00,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
        badge: "New",
        badgeType: "hot" as const,
        rating: 4.7,
        reviewCount: 123,
        vendor: "StyleCo",
        daysAgo: 3
    },
    {
        id: "104",
        name: "Smart Home Security Camera",
        price: 89.00,
        originalPrice: 129.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1600&auto=format&fit=crop",
        badge: "New",
        badgeType: "hot" as const,
        rating: 4.9,
        reviewCount: 67,
        vendor: "HomeTech",
        daysAgo: 3
    },
    {
        id: "105",
        name: "Organic Face Serum",
        price: 45.00,
        category: "Beauty & Care",
        image: "https://images.unsplash.com/photo-1506617420156-8e4536971650?q=80&w=1200&auto=format&fit=crop",
        badge: "New",
        badgeType: "hot" as const,
        rating: 5.0,
        reviewCount: 234,
        vendor: "BeautyBox",
        daysAgo: 4
    },
    {
        id: "106",
        name: "Bamboo Kitchen Utensil Set",
        price: 34.00,
        category: "Home & Living",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
        badge: "New",
        badgeType: "hot" as const,
        rating: 4.8,
        reviewCount: 156,
        vendor: "HomeEssentials",
        daysAgo: 5
    },
    {
        id: "107",
        name: "Fitness Tracker Band",
        price: 79.00,
        originalPrice: 99.00,
        category: "Sports & Outdoors",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
        badge: "New",
        badgeType: "hot" as const,
        rating: 4.6,
        reviewCount: 98,
        vendor: "FitGear",
        daysAgo: 6
    },
    {
        id: "108",
        name: "Premium Leather Wallet",
        price: 59.00,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
        badge: "New",
        badgeType: "hot" as const,
        rating: 4.9,
        reviewCount: 187,
        vendor: "FashionFirst",
        daysAgo: 6
    },
    {
        id: "109",
        name: "Mechanical Keyboard RGB",
        price: 119.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1514986888952-8cd320577b68?q=80&w=1200&auto=format&fit=crop",
        badge: "New",
        badgeType: "hot" as const,
        rating: 4.8,
        reviewCount: 267,
        vendor: "TechHub",
        daysAgo: 7
    },
    {
        id: "110",
        name: "Aromatherapy Candle Set",
        price: 39.00,
        originalPrice: 52.00,
        category: "Home & Living",
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
        badge: "New",
        badgeType: "hot" as const,
        rating: 4.7,
        reviewCount: 145,
        vendor: "HomeEssentials",
        daysAgo: 7
    },
]

const TRENDING_CATEGORIES = [
    { name: "Electronics", icon: "💻", count: 234 },
    { name: "Fashion", icon: "👕", count: 189 },
    { name: "Beauty", icon: "💄", count: 156 },
    { name: "Home", icon: "🏠", count: 123 },
]

export default function NewArrivalsPage() {
    // Cast plugin to any to smooth over Embla type differences between packages
    const sliderPlugin = useRef<any>(
        Autoplay({ delay: 4500, stopOnInteraction: true })
    )
    const FEATURED = NEW_ARRIVALS.slice(0, 4)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_25%),radial-gradient(circle_at_80%_0%,white,transparent_30%)]" />
                <div className="container mx-auto px-4 lg:px-8 py-14 md:py-20 relative">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <div className="max-w-xl text-white space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-semibold">Fresh Arrivals</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black leading-tight">
                                New This Week
                            </h1>
                            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                                Discover the latest drops across tech, fashion, home, and more — curated and refreshed daily.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button size="lg" className="h-12 px-6 bg-white text-indigo-700 hover:bg-gray-100 rounded-full font-semibold shadow-lg">
                                    <TrendingUp className="w-5 h-5 mr-2" />
                                    Shop Trending
                                </Button>
                                <Button size="lg" variant="outline" className="h-12 px-6 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full font-semibold">
                                    View All Products
                                </Button>
                            </div>
                            <div className="flex items-center gap-4 text-white/80 text-sm pt-2">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    Curated & verified
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Updated daily
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-[55%] bg-white/10 backdrop-blur-lg rounded-3xl p-4 shadow-2xl border border-white/10">
                            <Carousel
                                plugins={[sliderPlugin.current]}
                                className="w-full"
                                opts={{ loop: true, align: "start" }}
                            >
                                <CarouselContent className="ml-0">
                                    {FEATURED.map((item) => (
                                        <CarouselItem key={item.id} className="pl-0">
                                            <div className="grid md:grid-cols-[1.1fr_0.9fr] items-center gap-4 md:gap-6">
                                                <div className="relative h-[220px] md:h-[260px] rounded-2xl overflow-hidden bg-white">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        priority
                                                    />
                                                    {item.badge && (
                                                        <Badge className="absolute top-3 left-3 bg-indigo-600 text-white rounded-full px-3 py-1 shadow">
                                                            {item.badge}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="space-y-3 text-white">
                                                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">{item.category}</p>
                                                    <h3 className="text-2xl font-bold leading-snug">{item.name}</h3>
                                                    <p className="text-sm text-white/80">By {item.vendor}</p>
                                                    <div className="flex items-center gap-3 text-lg font-semibold">
                                                        <span className="text-white">${item.price.toFixed(2)}</span>
                                                        {item.originalPrice && (
                                                            <span className="text-white/60 line-through text-base">
                                                                ${item.originalPrice.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-6 pt-1 text-sm text-white/80">
                                                        <div className="flex items-center gap-1.5">
                                                            <Sparkles className="w-4 h-4" />
                                                            {item.rating} • {item.reviewCount} reviews
                                                        </div>
                                                        <div className="hidden md:flex items-center gap-1.5">
                                                            <Clock className="w-4 h-4" />
                                                            {item.daysAgo === 1 ? "Today" : `${item.daysAgo}d ago`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <div className="flex items-center justify-end gap-2 pt-3">
                                    <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full bg-white/20 border-white/20 text-white hover:bg-white/30" />
                                    <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full bg-white/20 border-white/20 text-white hover:bg-white/30" />
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trending Categories */}
            <div className="container mx-auto px-4 lg:px-8 -mt-8 relative z-10 mb-12">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                            Trending Categories
                        </h2>
                        <Link href="/ecommerce/categories">
                            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                                View all
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {TRENDING_CATEGORIES.map((category) => (
                            <Link key={category.name} href={`/ecommerce/products?category=${category.name}`}>
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center hover:shadow-md transition-all cursor-pointer group">
                                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                                    <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                                    <p className="text-sm text-gray-500">{category.count} new items</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* New Arrivals Grid */}
            <div className="container mx-auto px-4 lg:px-8 pb-16">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Latest Arrivals</h2>
                        <p className="text-gray-600">Fresh products added in the last 7 days</p>
                    </div>
                    <Badge variant="secondary" className="hidden md:flex items-center gap-2 px-4 py-2 text-sm">
                        <Clock className="w-4 h-4" />
                        Updated daily
                    </Badge>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {NEW_ARRIVALS.map((product) => (
                        <div key={product.id} className="relative">
                            <ProductCard product={product} />
                            {/* Days Ago Badge */}
                            <div className="absolute top-3 left-3 z-10">
                                <Badge className="bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 shadow-sm">
                                    {product.daysAgo === 1 ? "Today" : `${product.daysAgo}d ago`}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <div className="text-center">
                    <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-2 border-gray-900 text-gray-900 hover:bg-gray-100 font-semibold">
                        Load more products
                    </Button>
                </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16">
                <div className="container mx-auto px-4 lg:px-8 text-center">
                    <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Never Miss New Arrivals</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Subscribe to get notified when new products drop from your favorite vendors
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 h-12 px-4 rounded-full border-2 border-gray-700 bg-gray-800 text-white placeholder:text-gray-400 focus:outline-none focus:border-white"
                        />
                        <Button size="lg" className="h-12 px-8 bg-white text-gray-900 hover:bg-gray-100 rounded-full font-bold">
                            Subscribe
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
