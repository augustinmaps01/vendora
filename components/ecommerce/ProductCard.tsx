"use client"

import { Product, useCartStore } from "@/store/useCartStore"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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
        <div className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl active:scale-[0.98] transition-all duration-300 flex flex-col h-full">
            {/* Product Image */}
            <Link href={`/ecommerce/products/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-50 block">
                <Image
                    src={productImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge */}
                {product.badge && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                        <div className={cn(
                            "px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg backdrop-blur-sm",
                            getBadgeStyles(product.badgeType)
                        )}>
                            {product.badge}
                        </div>
                    </div>
                )}

                {/* Quick View Overlay - appears on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </Link>

            {/* Product Info */}
            <div className="p-3 sm:p-4 flex flex-col flex-1 space-y-2 sm:space-y-3">
                {/* Category */}
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide font-medium">{product.category}</p>

                {/* Product Name */}
                <Link href={`/ecommerce/products/${product.id}`}>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-2 min-h-10 sm:min-h-12 group-hover:text-gray-700 transition-colors leading-snug cursor-pointer">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating Row */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-sm">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "w-3 h-3 sm:w-3.5 sm:h-3.5",
                                    i < Math.floor(rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-200 text-gray-200"
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-gray-600 text-[10px] sm:text-xs font-medium hidden sm:inline">
                        {rating} ({reviewCount})
                    </span>
                    <span className="text-gray-600 text-[10px] font-medium sm:hidden">
                        {rating}
                    </span>
                </div>

                {/* Spacer to push price and button to bottom */}
                <div className="flex-1" />

                {/* Price Row */}
                <div className="flex items-baseline gap-1.5 sm:gap-2 pt-2 border-t border-gray-100">
                    <span className="text-lg sm:text-2xl font-black text-gray-900">
                        ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">
                            ${product.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <Button
                    onClick={() => {
                        addItem(product)
                        toast.success(
                            <div className="flex items-start gap-3">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    <Image
                                        src={productImage}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-900 line-clamp-1">Added to cart</p>
                                    <p className="text-xs text-gray-600 line-clamp-1">{product.name}</p>
                                </div>
                            </div>,
                            {
                                duration: 2000,
                                className: 'bg-white border border-gray-200 shadow-xl',
                                icon: <Check className="w-5 h-5 text-green-600" />,
                            }
                        )
                    }}
                    className="w-full h-9 sm:h-11 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all group/button mt-2 sm:mt-3"
                >
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 group-hover/button:scale-110 transition-transform" />
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                </Button>
            </div>
        </div>
    )
}
