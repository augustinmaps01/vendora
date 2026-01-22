"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/ecommerce/ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Mock product data
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
        vendor: "TechHub"
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
        vendor: "StyleCo"
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
        vendor: "TeaTime"
    },
    {
        id: "4",
        name: "Smart Watch Pro",
        price: 199.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=1200&auto=format&fit=crop",
        rating: 4.6,
        reviewCount: 320,
        vendor: "GadgetZone"
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
        vendor: "FashionFirst"
    },
    {
        id: "6",
        name: "Ceramic Coffee Mug Set",
        price: 35.00,
        category: "Home & Living",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
        rating: 4.8,
        reviewCount: 203,
        vendor: "HomeEssentials"
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
        vendor: "TechHub"
    },
    {
        id: "8",
        name: "Yoga Mat Premium",
        price: 45.00,
        category: "Sports & Outdoors",
        image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=1200&auto=format&fit=crop",
        rating: 4.6,
        reviewCount: 178,
        vendor: "FitGear"
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
        vendor: "BeautyBox"
    },
    {
        id: "10",
        name: "Bluetooth Speaker",
        price: 69.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop",
        rating: 4.5,
        reviewCount: 267,
        vendor: "GadgetZone"
    },
    {
        id: "11",
        name: "Denim Jacket Classic",
        price: 95.00,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
        rating: 4.7,
        reviewCount: 134,
        vendor: "StyleCo"
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
        vendor: "HomeEssentials"
    },
]

const CATEGORIES = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Beauty & Care",
    "Sports & Outdoors",
    "Food & Beverage",
]

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState([0, 500])
    const [sortBy, setSortBy] = useState("featured")
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    // Handle client-side mounting to prevent hydration errors
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Filter products
    const filteredProducts = ALL_PRODUCTS.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
        return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return a.price - b.price
            case "price-high":
                return b.price - a.price
            case "rating":
                return (b.rating || 0) - (a.rating || 0)
            case "newest":
                return parseInt(b.id) - parseInt(a.id)
            default:
                return 0
        }
    })

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        )
    }

    const clearFilters = () => {
        setSelectedCategories([])
        setPriceRange([0, 500])
        setSearchQuery("")
        setSortBy("featured")
    }

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Categories */}
            <div>
                <h3 className="font-bold text-sm mb-3" style={{ color: '#110228' }}>Categories</h3>
                <div className="space-y-2.5">
                    {CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center gap-2.5">
                            <Checkbox
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => handleCategoryToggle(category)}
                            />
                            <Label
                                htmlFor={category}
                                className="text-sm text-gray-700 cursor-pointer"
                            >
                                {category}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-bold text-sm mb-3" style={{ color: '#110228' }}>Price Range</h3>
                <div className="space-y-4">
                    <Slider
                        min={0}
                        max={500}
                        step={10}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm font-semibold" style={{ color: '#26D5FF' }}>
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </div>
            </div>

            {/* Clear Filters */}
            <Button
                variant="outline"
                className="w-full border-2 hover:text-white transition-colors"
                style={{ borderColor: '#26D5FF', color: '#26D5FF' }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#26D5FF'
                    e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#26D5FF'
                }}
                onClick={clearFilters}
            >
                Clear all filters
            </Button>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #110228 0%, #2E0F5F 50%, #7C3AED 100%)' }}>
                {/* Background Shape */}
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute -top-24 -right-20 w-80 h-80 opacity-20"
                        style={{ background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.35) 0%, rgba(124, 58, 237, 0) 70%)' }}
                    />
                </div>

                <div className="container mx-auto px-4 lg:px-8 relative z-10 flex items-center justify-center min-h-[300px] md:min-h-[360px]">
                    <div className="max-w-3xl text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ backgroundColor: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7C3AED' }} />
                            <span className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: '#D946EF' }}>
                                Vendor Owner
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            Luna Street Mart
                        </h1>
                        <p className="mt-2 text-sm md:text-base text-gray-300">
                            Address: 123 Rizal Ave, Brgy. San Isidro, Quezon City
                        </p>
                    </div>
                </div>

                {/* Bottom Divider */}
                <div className="absolute bottom-0 left-0 right-0 h-6" style={{ backgroundColor: '#f9fafb' }} />
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl border-2 p-6 sticky top-24" style={{ borderColor: '#26D5FF' }}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-bold text-lg" style={{ color: '#110228' }}>Filters</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="hover:bg-transparent"
                                    style={{ color: '#26D5FF' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#1ea8d8'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#26D5FF'}
                                >
                                    Clear
                                </Button>
                            </div>
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search and Sort Bar */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-11 rounded-lg border-gray-200"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                        </button>
                                    )}
                                </div>

                                {/* Sort */}
                                {isMounted && (
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-full md:w-48 h-11 rounded-lg border-gray-200">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="featured">Featured</SelectItem>
                                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                                            <SelectItem value="rating">Highest Rated</SelectItem>
                                            <SelectItem value="newest">Newest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}

                                {/* Mobile Filter Button */}
                                {isMounted && (
                                    <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                                        <SheetTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="lg:hidden h-11 rounded-lg border-gray-200"
                                            >
                                                <SlidersHorizontal className="w-5 h-5 mr-2" />
                                                Filters
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="left" className="w-80">
                                            <SheetHeader>
                                                <SheetTitle>Filters</SheetTitle>
                                            </SheetHeader>
                                            <div className="mt-6">
                                                <FilterContent />
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                )}
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mb-6">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold" style={{ color: '#7C3AED' }}>{sortedProducts.length}</span> of{" "}
                                <span className="font-semibold" style={{ color: '#7C3AED' }}>{ALL_PRODUCTS.length}</span> products
                            </p>
                        </div>

                        {/* Product Grid */}
                        {sortedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sortedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border-2 p-12 text-center" style={{ borderColor: '#D946EF' }}>
                                <p className="text-lg mb-2" style={{ color: '#7C3AED' }}>No products found</p>
                                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search query</p>
                                <Button
                                    onClick={clearFilters}
                                    className="text-white hover:opacity-90"
                                    style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #D946EF 100%)' }}
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
