"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/ecommerce/ProductCard"
import { useCartStore } from "@/store/cartStore"
import {
    Star,
    ShoppingCart,
    Heart,
    Share2,
    Truck,
    Shield,
    RotateCcw,
    ChevronRight,
    Check,
    Store,
    MessageCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock product data (in real app, fetch from API)
const PRODUCT_DATA: Record<string, any> = {
    "1": {
        id: "1",
        name: "Premium Wireless Headphones",
        price: 89.00,
        originalPrice: 119.00,
        category: "Electronics",
        vendor: "TechHub",
        rating: 4.9,
        reviewCount: 240,
        inStock: true,
        stockCount: 45,
        images: [
            "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=1600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1586953208448-11a9c0c9c641?q=80&w=1600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1505685296765-3a2736de412f?q=80&w=1600&auto=format&fit=crop"
        ],
        description: "Experience premium sound quality with our wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers, travelers, and professionals.",
        features: [
            "Active Noise Cancellation (ANC)",
            "30-hour battery life",
            "Bluetooth 5.0 connectivity",
            "Comfortable over-ear design",
            "Built-in microphone for calls",
            "Foldable design with carrying case"
        ],
        specifications: {
            "Brand": "TechHub",
            "Model": "WH-1000XM5",
            "Color": "Black",
            "Connectivity": "Bluetooth 5.0, 3.5mm jack",
            "Battery Life": "30 hours",
            "Weight": "250g",
            "Warranty": "1 year"
        }
    }
}

// Mock reviews
const REVIEWS = [
    {
        id: "r1",
        author: "Sarah Johnson",
        rating: 5,
        date: "2 days ago",
        verified: true,
        comment: "Absolutely love these headphones! The sound quality is incredible and the noise cancellation works perfectly. Worth every penny.",
        helpful: 24
    },
    {
        id: "r2",
        author: "Mike Chen",
        rating: 5,
        date: "1 week ago",
        verified: true,
        comment: "Best headphones I've ever owned. Battery lasts forever and they're super comfortable for long sessions.",
        helpful: 18
    },
    {
        id: "r3",
        author: "Emily Davis",
        rating: 4,
        date: "2 weeks ago",
        verified: true,
        comment: "Great headphones overall. Only minor complaint is they can feel a bit heavy after several hours of use.",
        helpful: 12
    }
]

// Mock related products
const RELATED_PRODUCTS = [
    {
        id: "2",
        name: "Wireless Earbuds Pro",
        price: 149.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1200&auto=format&fit=crop",
        rating: 4.8,
        reviewCount: 189,
        badge: "Best Seller",
        badgeType: "bestseller" as const
    },
    {
        id: "3",
        name: "USB-C Charging Cable",
        price: 19.00,
        originalPrice: 29.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1582719478145-bd0256a5e1eb?q=80&w=1200&auto=format&fit=crop",
        badge: "34% OFF",
        badgeType: "discount" as const,
        rating: 4.7,
        reviewCount: 456
    },
    {
        id: "4",
        name: "Headphone Stand",
        price: 25.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1612731486606-9d94c0c0be5b?q=80&w=1200&auto=format&fit=crop",
        rating: 4.6,
        reviewCount: 123
    },
    {
        id: "5",
        name: "Audio Adapter Kit",
        price: 15.00,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
        rating: 4.5,
        reviewCount: 89
    }
]

export default function ProductDetailPage() {
    const params = useParams()
    const productId = params.id as string
    const product = PRODUCT_DATA[productId] || PRODUCT_DATA["1"]
    const { addItem } = useCartStore()

    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [isWishlisted, setIsWishlisted] = useState(false)

    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

    const handleAddToCart = () => {
        addItem({ ...product, quantity })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/ecommerce" className="hover:text-gray-900">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/ecommerce/products" className="hover:text-gray-900">Products</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href={`/ecommerce/products?category=${product.category}`} className="hover:text-gray-900">{product.category}</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 font-medium">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                            <Image
                                src={product.images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                            {discount > 0 && (
                                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 text-sm font-bold">
                                    {discount}% OFF
                                </Badge>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        <div className="grid grid-cols-4 gap-3">
                            {product.images.map((image: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={cn(
                                        "relative aspect-square bg-white rounded-lg border-2 overflow-hidden transition-all",
                                        selectedImage === index
                                            ? "border-gray-900 shadow-md"
                                            : "border-gray-200 hover:border-gray-400"
                                    )}
                                >
                                    <Image
                                        src={image}
                                        alt={`${product.name} - View ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Vendor Badge */}
                        <Link href={`/ecommerce/vendor/${product.vendor}`}>
                            <Badge variant="secondary" className="mb-2 flex items-center gap-2 w-fit hover:bg-gray-200 transition-colors cursor-pointer">
                                <Store className="w-3 h-3" />
                                {product.vendor}
                            </Badge>
                        </Link>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "w-5 h-5",
                                            i < Math.floor(product.rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "fill-gray-200 text-gray-200"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-900 font-semibold">{product.rating}</span>
                            <span className="text-gray-500">({product.reviewCount} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-gray-900">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="text-2xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                            )}
                        </div>

                        {/* Stock Status */}
                        {product.inStock ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <Check className="w-5 h-5" />
                                <span className="font-semibold">In Stock ({product.stockCount} available)</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-red-600">
                                <span className="font-semibold">Out of Stock</span>
                            </div>
                        )}

                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed">{product.description}</p>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-gray-900">Quantity:</span>
                            <div className="flex items-center gap-3 border-2 border-gray-200 rounded-lg px-4 py-2">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="text-gray-600 hover:text-gray-900 font-bold text-lg"
                                >
                                    -
                                </button>
                                <span className="font-bold text-gray-900 w-8 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                                    className="text-gray-600 hover:text-gray-900 font-bold text-lg"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className="flex-1 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold text-base shadow-md hover:shadow-xl transition-all"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Add to Cart
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={cn(
                                    "h-14 px-6 rounded-lg border-2 font-bold transition-all",
                                    isWishlisted
                                        ? "border-red-500 text-red-500 bg-red-50"
                                        : "border-gray-900 text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                <Heart className={cn("w-5 h-5", isWishlisted && "fill-red-500")} />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-6 rounded-lg border-2 border-gray-900 text-gray-900 hover:bg-gray-100 font-bold"
                            >
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Features */}
                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                Why Buy From Us
                            </h3>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Truck className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium text-gray-700">Free Shipping</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium text-gray-700">Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <RotateCcw className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium text-gray-700">30-Day Returns</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Tabs: Details, Specs, Reviews */}
                <Card className="p-8 mb-16">
                    <Tabs defaultValue="details">
                        <TabsList className="w-full sm:w-auto mb-6">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="specs">Specifications</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Product Details</h3>
                                <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                                <h4 className="font-bold text-gray-900 mb-3">Key Features:</h4>
                                <ul className="space-y-2">
                                    {product.features.map((feature: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3 text-gray-600">
                                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </TabsContent>

                        <TabsContent value="specs">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Specifications</h3>
                                <div className="space-y-3">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex py-3 border-b border-gray-200 last:border-0">
                                            <span className="font-semibold text-gray-900 w-48">{key}</span>
                                            <span className="text-gray-600">{value as string}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4" />
                                        Write a Review
                                    </Button>
                                </div>

                                {REVIEWS.map((review) => (
                                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-bold text-gray-900">{review.author}</span>
                                                    {review.verified && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            <Check className="w-3 h-3 mr-1" />
                                                            Verified Purchase
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={cn(
                                                                    "w-4 h-4",
                                                                    i < review.rating
                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                        : "fill-gray-200 text-gray-200"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-500">{review.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mb-3">{review.comment}</p>
                                        <button className="text-sm text-gray-500 hover:text-gray-700">
                                            Helpful ({review.helpful})
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </Card>

                {/* Related Products */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">You May Also Like</h2>
                            <p className="text-gray-600">Similar products from this category</p>
                        </div>
                        <Link href="/ecommerce/products">
                            <Button variant="ghost" className="hidden md:flex items-center gap-2">
                                View all
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {RELATED_PRODUCTS.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
