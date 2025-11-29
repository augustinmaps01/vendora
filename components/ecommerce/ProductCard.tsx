"use client"

import { Product, useCartStore } from "@/store/useCartStore"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductCardProps {
    product: Product & {
        badge?: string
        badgeType?: "hot" | "bestseller" | "discount"
        originalPrice?: number
        rating?: number
        reviewCount?: number
    }
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCartStore()

    // Generate badge styling based on type
    const getBadgeStyles = (type?: string) => {
        switch (type) {
            case "hot":
                return "bg-gradient-to-r from-red-500 to-orange-500 text-white"
            case "bestseller":
                return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
            case "discount":
                return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
            default:
                return "bg-gray-900 text-white"
        }
    }

    const productImage = product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"
    const rating = product.rating || 4.8
    const reviewCount = product.reviewCount || Math.floor(Math.random() * 300 + 50)

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                    src={productImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge */}
                {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                        <div className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm",
                            getBadgeStyles(product.badgeType)
                        )}>
                            {product.badge}
                        </div>
                    </div>
                )}

                {/* Quick View Overlay - appears on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-1 space-y-3">
                {/* Category */}
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{product.category}</p>

                {/* Product Name */}
                <h3 className="font-bold text-base text-gray-900 line-clamp-2 min-h-12 group-hover:text-gray-700 transition-colors">
                    {product.name}
                </h3>

                {/* Rating Row */}
                <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "w-3.5 h-3.5",
                                    i < Math.floor(rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-200 text-gray-200"
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-gray-600 text-xs font-medium">
                        {rating} ({reviewCount})
                    </span>
                </div>

                {/* Spacer to push price and button to bottom */}
                <div className="flex-1" />

                {/* Price Row */}
                <div className="flex items-baseline gap-2 pt-2 border-t border-gray-100">
                    <span className="text-2xl font-black text-gray-900">
                        ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through font-medium">
                            ${product.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <Button
                    onClick={() => addItem(product)}
                    className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all group/button mt-3"
                >
                    <ShoppingCart className="w-4 h-4 mr-2 group-hover/button:scale-110 transition-transform" />
                    Add to Cart
                </Button>
            </div>
        </div>
    )
}
