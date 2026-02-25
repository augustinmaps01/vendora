"use client"

import { useState, useEffect, useMemo } from "react"
import { ProductCard } from "@/components/ecommerce/ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SlidersHorizontal, LayoutGrid, X, Search, Star, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/store/useCartStore"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"


// ---------------------------------------------------------------------------
// Mock product data
// ---------------------------------------------------------------------------
const ALL_PRODUCTS = [
    {
        id: "1",
        name: "Premium Wireless Headphones",
        price: 89.00,
        originalPrice: 119.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=1200&auto=format&fit=crop",
        badge: "Hot",
        badgeType: "hot" as const,
        rating: 4.9,
        reviewCount: 240,
        isFlashSale: true,
        isOnSale: true,
    },
    {
        id: "2",
        name: "Minimalist Running Shoes",
        price: 129.00,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
        badge: "Best Seller",
        badgeType: "bestseller" as const,
        rating: 4.8,
        reviewCount: 530,
        isNew: true,
    },
    {
        id: "3",
        name: "Organic Green Tea Set",
        price: 24.00,
        originalPrice: 32.00,
        category: "Food & Beverage",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
        badge: "25% OFF",
        badgeType: "discount" as const,
        rating: 4.7,
        reviewCount: 89,
        isOnSale: true,
    },
    {
        id: "4",
        name: "Smart Watch Pro",
        price: 199.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=1200&auto=format&fit=crop",
        rating: 4.6,
        reviewCount: 320,
        isFlashSale: true,
        isNew: true,
    },
    {
        id: "5",
        name: "Leather Messenger Bag",
        price: 79.00,
        originalPrice: 110.00,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
        badge: "30% OFF",
        badgeType: "discount" as const,
        rating: 4.9,
        reviewCount: 156,
        isOnSale: true,
    },
    {
        id: "6",
        name: "Ceramic Coffee Mug Set",
        price: 35.00,
        category: "Home & Living",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
        rating: 4.8,
        reviewCount: 203,
        isNew: true,
    },
    {
        id: "7",
        name: "Wireless Gaming Mouse",
        price: 59.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1200&auto=format&fit=crop",
        badge: "Hot",
        badgeType: "hot" as const,
        rating: 4.7,
        reviewCount: 445,
        isFlashSale: true,
    },
    {
        id: "8",
        name: "Yoga Mat Premium",
        price: 45.00,
        category: "Sports & Outdoors",
        image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=1200&auto=format&fit=crop",
        rating: 4.6,
        reviewCount: 178,
        isNew: true,
    },
    {
        id: "9",
        name: "Skincare Routine Bundle",
        price: 89.00,
        originalPrice: 120.00,
        category: "Beauty & Care",
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop",
        badge: "Best Seller",
        badgeType: "bestseller" as const,
        rating: 4.9,
        reviewCount: 892,
        isOnSale: true,
    },
    {
        id: "10",
        name: "Bluetooth Speaker",
        price: 69.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop",
        rating: 4.5,
        reviewCount: 267,
    },
    {
        id: "11",
        name: "Denim Jacket Classic",
        price: 95.00,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
        rating: 4.7,
        reviewCount: 134,
    },
    {
        id: "12",
        name: "Essential Oil Diffuser",
        price: 42.00,
        originalPrice: 55.00,
        category: "Home & Living",
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
        badge: "24% OFF",
        badgeType: "discount" as const,
        rating: 4.8,
        reviewCount: 412,
        isOnSale: true,
    },
]

const CATEGORY_CHIPS = [
    "All",
    "Electronics",
    "Fashion",
    "Home & Living",
    "Beauty & Care",
    "Sports & Outdoors",
    "Food & Beverage",
]

const CATEGORIES = CATEGORY_CHIPS.filter((c) => c !== "All")

// ---------------------------------------------------------------------------
// Countdown hook
// ---------------------------------------------------------------------------
function useCountdown(targetSeconds: number) {
    const [remaining, setRemaining] = useState(targetSeconds)

    useEffect(() => {
        const id = setInterval(() => {
            setRemaining((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(id)
    }, [])

    const h = Math.floor(remaining / 3600)
    const m = Math.floor((remaining % 3600) / 60)
    const s = remaining % 60
    return { h, m, s }
}



// ---------------------------------------------------------------------------
// Filter Sidebar (shared content for desktop sidebar + mobile sheet)
// ---------------------------------------------------------------------------
function FilterPanel({
    selectedCategories,
    onCategoryToggle,
    priceRange,
    onPriceRangeChange,
    onClearFilters,
}: {
    selectedCategories: string[]
    onCategoryToggle: (cat: string) => void
    priceRange: [number, number]
    onPriceRangeChange: (range: [number, number]) => void
    onClearFilters: () => void
}) {
    const hasActiveFilters = selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 500

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Category filter */}
            <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2.5">
                    {CATEGORIES.map((cat) => (
                        <div key={cat} className="flex items-center gap-2.5">
                            <Checkbox
                                id={`sidebar-filter-${cat}`}
                                checked={selectedCategories.includes(cat)}
                                onCheckedChange={() => onCategoryToggle(cat)}
                            />
                            <Label
                                htmlFor={`sidebar-filter-${cat}`}
                                className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                            >
                                {cat}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price range */}
            <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h4>
                <Slider
                    min={0}
                    max={500}
                    step={10}
                    value={priceRange}
                    onValueChange={(v) => onPriceRangeChange(v as [number, number])}
                    className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm font-semibold">
                    <span className="text-emerald-600">${priceRange[0]}</span>
                    <span className="text-emerald-600">${priceRange[1]}</span>
                </div>
            </div>

            {/* Clear all button */}
            {hasActiveFilters && (
                <Button
                    variant="outline"
                    className="w-full font-semibold gap-1.5 rounded-full border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={onClearFilters}
                >
                    <X className="w-4 h-4" />
                    Clear all filters
                </Button>
            )}
        </div>
    )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function ProductsPage() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
    const [showFilters, setShowFilters] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("featured")
    const countdown = useCountdown(2 * 3600 + 47 * 60 + 33)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const flashSaleProducts = ALL_PRODUCTS.filter((p) => p.isFlashSale)

    // ── Filtering logic ──────────────────────────────────────────────────
    const filteredProducts = useMemo(() => {
        return ALL_PRODUCTS.filter((p) => {
            const matchesCat =
                selectedCategories.length > 0
                    ? selectedCategories.includes(p.category)
                    : true
            const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1]
            const matchesSearch =
                searchQuery.trim() === "" ||
                p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.trim().toLowerCase())
            return matchesCat && matchesPrice && matchesSearch
        })
    }, [selectedCategories, priceRange, searchQuery])

    // ── Sorting logic ────────────────────────────────────────────────────
    const sortedProducts = useMemo(() => {
        const items = [...filteredProducts]
        switch (sortBy) {
            case "price-asc":
                return items.sort((a, b) => a.price - b.price)
            case "price-desc":
                return items.sort((a, b) => b.price - a.price)
            case "rating":
                return items.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            case "newest":
                return items.sort((a, b) => Number(b.id) - Number(a.id))
            case "featured":
            default:
                return items // original order
        }
    }, [filteredProducts, sortBy])

    const handleCategoryToggle = (cat: string) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        )
    }

    const clearFilters = () => {
        setSelectedCategories([])
        setPriceRange([0, 500])
        setSearchQuery("")
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Store Banner ──────────────────────────────────────────── */}
            <div
                className="relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #110228 0%, #2E0F5F 50%, #7C3AED 100%)' }}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute -top-24 -right-20 w-80 h-80 opacity-20"
                        style={{ background: 'linear-gradient(135deg, rgba(217,70,239,0.35) 0%, rgba(124,58,237,0) 70%)' }}
                    />
                </div>
                <div className="container mx-auto px-4 lg:px-8 relative z-10 flex items-center justify-center min-h-[200px] sm:min-h-[260px] md:min-h-[300px]">
                    <div className="max-w-3xl text-center flex flex-col items-center">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                            style={{ backgroundColor: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}
                        >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7C3AED' }} />
                            <span className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: '#D946EF' }}>
                                Vendor Owner
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            Luna Street Mart
                        </h1>
                        <p className="mt-2 text-sm md:text-base text-gray-300">
                            123 Rizal Ave, Brgy. San Isidro, Quezon City
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Main Content ──────────────────────────────────────────── */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">

                {/* ── Category chips + Flash Sale — unified promo zone ─── */}

                {/* Flash Sale — Premium Hero Banner */}
                <div className="rounded-3xl overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #110228 0%, #2E0F5F 40%, #7C3AED 80%, #9333EA 100%)' }}
                >
                    {/* Hero Header */}
                    <div className="relative px-5 sm:px-8 pt-6 pb-5 overflow-hidden">
                        {/* Background decorative circles */}
                        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10"
                            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }}
                        />
                        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10"
                            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }}
                        />

                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Left: Branding */}
                            <div className="flex items-center gap-3.5">
                                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm shadow-lg">
                                    <span className="text-2xl leading-none" role="img" aria-label="fire">🔥</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200">Limited Time</span>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide animate-pulse" style={{ backgroundColor: '#26D5FF', color: '#110228' }}>
                                            LIVE
                                        </span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                                        Flash Sale
                                    </h2>
                                    <p className="text-sm text-purple-200 mt-0.5">Up to <span className="font-bold" style={{ color: '#26D5FF' }}>30% OFF</span> — today only!</p>
                                </div>
                            </div>

                            {/* Right: Countdown */}
                            {isMounted && (
                                <div className="flex flex-col items-start sm:items-end gap-1">
                                    <span className="text-xs text-purple-200 font-semibold uppercase tracking-wider">Ends in</span>
                                    <div className="flex items-end gap-1.5">
                                        {/* Hours */}
                                        <div className="flex flex-col items-center">
                                            <div className="min-w-[52px] h-14 rounded-xl flex items-center justify-center bg-white/15 border border-white/25 backdrop-blur-sm shadow-inner">
                                                <span className="text-3xl font-black text-white tabular-nums leading-none">
                                                    {String(countdown.h).padStart(2, '0')}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-purple-200 mt-1 font-semibold uppercase tracking-wider">hrs</span>
                                        </div>
                                        <span className="text-3xl font-black text-white/60 mb-6">:</span>
                                        {/* Minutes */}
                                        <div className="flex flex-col items-center">
                                            <div className="min-w-[52px] h-14 rounded-xl flex items-center justify-center bg-white/15 border border-white/25 backdrop-blur-sm shadow-inner">
                                                <span className="text-3xl font-black text-white tabular-nums leading-none">
                                                    {String(countdown.m).padStart(2, '0')}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-purple-200 mt-1 font-semibold uppercase tracking-wider">min</span>
                                        </div>
                                        <span className="text-3xl font-black text-white/60 mb-6">:</span>
                                        {/* Seconds */}
                                        <div className="flex flex-col items-center">
                                            <div className="min-w-[52px] h-14 rounded-xl flex items-center justify-center border border-cyan-300/50 shadow-lg" style={{ backgroundColor: '#26D5FF' }}>
                                                <span className="text-3xl font-black tabular-nums leading-none" style={{ color: '#110228' }}>
                                                    {String(countdown.s).padStart(2, '0')}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-purple-200 mt-1 font-semibold uppercase tracking-wider">sec</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Carousel */}
                    <div className="bg-white/5 backdrop-blur-sm px-4 sm:px-6 pb-5 pt-4">
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                            {flashSaleProducts.map((product) => {
                                const savings = product.originalPrice
                                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                                    : null
                                const savedAmount = product.originalPrice
                                    ? (product.originalPrice - product.price).toFixed(2)
                                    : null
                                // Deterministic fake stock % per product
                                const stockPct = 20 + ((product.id.charCodeAt(0) * 17) % 55)

                                return (
                                    <div
                                        key={product.id}
                                        className="shrink-0 w-56 sm:w-64 bg-white rounded-2xl overflow-hidden shadow-xl group hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                                    >
                                        {/* Image */}
                                        <Link href={`/ecommerce/products/${product.id}`} className="relative block">
                                            <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    unoptimized
                                                />
                                                {/* Discount badge */}
                                                {savings && (
                                                    <div className="absolute top-0 left-0 text-white text-xs font-black px-2.5 py-1.5 rounded-br-xl shadow-md" style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}>
                                                        -{savings}%
                                                    </div>
                                                )}
                                                {/* Flash overlay */}
                                                <div className="absolute top-2 right-2">
                                                    <span className="text-base" role="img" aria-label="flash">⚡</span>
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Info */}
                                        <div className="p-3 flex flex-col flex-1 gap-1.5">
                                            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#7C3AED' }}>{product.category}</p>
                                            <Link href={`/ecommerce/products/${product.id}`}>
                                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug hover:text-violet-600 transition-colors">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            {/* Stars */}
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating ?? 4.5) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                                                ))}
                                                <span className="text-[10px] text-gray-400 ml-0.5">({product.reviewCount})</span>
                                            </div>

                                            <div className="flex-1" />

                                            {/* Price */}
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-lg font-black" style={{ color: '#7C3AED' }}>${product.price.toFixed(2)}</span>
                                                {product.originalPrice && (
                                                    <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                                                )}
                                            </div>

                                            {/* Savings pill */}
                                            {savedAmount && (
                                                <p className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5 w-fit">
                                                    Save ${savedAmount}
                                                </p>
                                            )}

                                            {/* Stock urgency bar */}
                                            <div className="space-y-1 mt-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] text-gray-400">Stock</span>
                                                    <span className={`text-[10px] font-bold ${stockPct < 30 ? 'text-violet-600' : 'text-violet-500'}`}>
                                                        {stockPct < 30 ? '⚡ Almost gone!' : `${stockPct}% left`}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all`}
                                                        style={{ width: `${stockPct}%`, background: stockPct < 30 ? '#7C3AED' : '#26D5FF' }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Add to cart */}
                                            <button
                                                onClick={() => {
                                                    useCartStore.getState().addItem(product)
                                                }}
                                                className="mt-2 w-full h-9 rounded-xl text-xs font-bold text-white active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg"
                                                style={{ background: 'linear-gradient(90deg, #110228 0%, #7C3AED 100%)' }}
                                            >
                                                <ShoppingCart className="w-3.5 h-3.5" />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* ── All Products — Desktop marketplace layout ───────── */}
                <section>
                    {/* Section title row */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100">
                                <LayoutGrid className="w-4 h-4 text-gray-600" />
                            </div>
                            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                                All Products
                            </h2>
                        </div>
                    </div>

                    {/* ── Search bar + Sort dropdown ──────────────────── */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-5">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-violet-500"
                            />
                        </div>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full sm:w-[160px] h-11 rounded-xl border-gray-200 bg-white text-sm" suppressHydrationWarning>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="featured">Featured</SelectItem>
                                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                                <SelectItem value="price-desc">Price: High → Low</SelectItem>
                                <SelectItem value="rating">Top Rated</SelectItem>
                                <SelectItem value="newest">Newest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Product count */}
                    <p className="text-sm text-gray-500 mb-4">
                        Showing <span className="font-semibold text-gray-900">{sortedProducts.length}</span> of{" "}
                        <span className="font-semibold text-gray-900">{ALL_PRODUCTS.length}</span> products
                    </p>

                    {/* ── Sidebar + Grid layout ──────────────────────── */}
                    <div className="flex gap-6">

                        {/* ── Desktop Filter Sidebar (lg+ only) ────── */}
                        <aside className="hidden lg:block w-56 shrink-0">
                            <div className="sticky top-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                                <FilterPanel
                                    selectedCategories={selectedCategories}
                                    onCategoryToggle={handleCategoryToggle}
                                    priceRange={priceRange}
                                    onPriceRangeChange={setPriceRange}
                                    onClearFilters={clearFilters}
                                />
                            </div>
                        </aside>

                        {/* ── Product Grid ──────────────────────────── */}
                        <div className="flex-1 min-w-0">
                            {/* Mobile filter button (< lg) */}
                            <div className="lg:hidden mb-4">
                                {isMounted && (
                                    <Sheet open={showFilters} onOpenChange={setShowFilters}>
                                        <SheetTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-9 px-4 text-sm font-semibold gap-1.5 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                            >
                                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                                Filter
                                                {(selectedCategories.length > 0 || priceRange[1] < 500) && (
                                                    <span
                                                        className="ml-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white font-bold"
                                                        style={{ backgroundColor: '#f43f5e' }}
                                                    >
                                                        {selectedCategories.length + (priceRange[1] < 500 ? 1 : 0)}
                                                    </span>
                                                )}
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="right" className="w-80 border-l border-gray-200 bg-white">
                                            <SheetHeader className="mb-6">
                                                <SheetTitle className="text-gray-900 text-lg font-bold">Filters</SheetTitle>
                                            </SheetHeader>
                                            <FilterPanel
                                                selectedCategories={selectedCategories}
                                                onCategoryToggle={handleCategoryToggle}
                                                priceRange={priceRange}
                                                onPriceRangeChange={setPriceRange}
                                                onClearFilters={clearFilters}
                                            />
                                        </SheetContent>
                                    </Sheet>
                                )}
                            </div>

                            {sortedProducts.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                    {sortedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-white border border-gray-200 p-10 text-center shadow-sm">
                                    <p className="text-lg font-semibold text-gray-900 mb-1">No products found</p>
                                    <p className="text-sm text-gray-500 mb-5">Try adjusting your search or filters</p>
                                    <Button
                                        onClick={clearFilters}
                                        className="rounded-full font-semibold"
                                        style={{ backgroundColor: '#7C3AED' }}
                                    >
                                        Clear all filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}
