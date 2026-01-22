"use client"

import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package, Shield, Headphones, Star, Badge } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"

export function Hero() {
    // Cast to any to avoid Embla plugin type mismatch across packages
    const plugin = useRef<any>(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )
    const [api, setApi] = useState<any>()
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (!api) return

        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    const slides = [
        {
            id: 1,
            badge: "New Arrivals",
            title: "Upgrade Your Everyday Essentials",
            subtitle: "Premium quality products at unbeatable prices. Save up to 40% on selected items.",
            bgGradient: "from-blue-50 via-indigo-50 to-purple-50",
            productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
            productName: "Premium Wireless Headphones",
            originalPrice: "$299.00",
            price: "$209.00",
            discount: "-30%",
            rating: 4.8,
            reviewCount: 256,
        },
        {
            id: 2,
            badge: "Limited Time Sale",
            title: "Style Meets Comfort",
            subtitle: "Discover the latest trends in fashion and lifestyle. Exclusive deals just for you.",
            bgGradient: "from-orange-50 via-amber-50 to-yellow-50",
            productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
            productName: "Ultra Comfort Running Shoes",
            originalPrice: "$159.00",
            price: "$119.00",
            discount: "-25%",
            rating: 4.9,
            reviewCount: 312,
        },
        {
            id: 3,
            badge: "Best Sellers",
            title: "Elevate Your Living Space",
            subtitle: "Transform your home with our curated collection of modern essentials.",
            bgGradient: "from-emerald-50 via-teal-50 to-cyan-50",
            productImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2058&auto=format&fit=crop",
            productName: "Minimalist Table Lamp",
            originalPrice: "$89.00",
            price: "$62.00",
            discount: "-30%",
            rating: 4.7,
            reviewCount: 184,
        },
    ]

    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white">
            <Carousel
                plugins={[plugin.current]}
                setApi={setApi}
                className="w-full"
                opts={{
                    loop: true,
                    align: "start",
                }}
            >
                <CarouselContent className="ml-0">
                    {slides.map((slide, index) => (
                        <CarouselItem key={slide.id} className="pl-0">
                            {/* Desktop Layout */}
                            <div className={`hidden lg:block relative bg-gradient-to-br ${slide.bgGradient} transition-all duration-700`}>
                                <div className="container mx-auto px-8 xl:px-12">
                                    <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px] py-16">
                                        {/* Left Content */}
                                        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
                                            {/* Badge */}
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
                                                <Badge className="w-4 h-4 text-gray-700" />
                                                <span className="text-sm font-semibold text-gray-700 tracking-wide">
                                                    {slide.badge}
                                                </span>
                                            </div>

                                            {/* Headline */}
                                            <h1 className="text-5xl xl:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                                                {slide.title}
                                            </h1>

                                            {/* Subheading */}
                                            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                                                {slide.subtitle}
                                            </p>

                                            {/* CTA Buttons */}
                                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                                <Link href="/ecommerce/products">
                                                    <Button
                                                        size="lg"
                                                        className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                                                    >
                                                        Shop Now
                                                        <ArrowRight className="ml-2 w-5 h-5" />
                                                    </Button>
                                                </Link>
                                                <Link href="/ecommerce/deals">
                                                    <Button
                                                        size="lg"
                                                        variant="outline"
                                                        className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-full px-8 h-12 text-base font-semibold transition-all"
                                                    >
                                                        View Deals
                                                    </Button>
                                                </Link>
                                            </div>

                                            {/* Trust Indicators */}
                                            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-200">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Package className="w-5 h-5 text-gray-700" />
                                                    <span className="font-medium">Free Shipping over $50</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Shield className="w-5 h-5 text-gray-700" />
                                                    <span className="font-medium">Secure Payments</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Headphones className="w-5 h-5 text-gray-700" />
                                                    <span className="font-medium">24/7 Support</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Product Showcase */}
                                        <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
                                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg ml-auto">
                                                {/* Discount Badge */}
                                                <div className="absolute top-6 right-6 z-10">
                                                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                                                        {slide.discount}
                                                    </div>
                                                </div>

                                                {/* Product Image */}
                                                <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden bg-gray-50">
                                                    <Image
                                                        src={slide.productImage}
                                                        alt={slide.productName}
                                                        fill
                                                        className="object-cover"
                                                        priority={index === 0}
                                                        quality={90}
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="space-y-3">
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {slide.productName}
                                                    </h3>

                                                    {/* Star Rating */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < Math.floor(slide.rating)
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "fill-gray-200 text-gray-200"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {slide.rating} ({slide.reviewCount} reviews)
                                                        </span>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-3xl font-bold text-gray-900">
                                                            {slide.price}
                                                        </span>
                                                        <span className="text-lg text-gray-400 line-through">
                                                            {slide.originalPrice}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Layout */}
                            <div className={`lg:hidden relative bg-gradient-to-br ${slide.bgGradient} pb-6 sm:pb-8`}>
                                <div className="container mx-auto px-4 sm:px-6">
                                    {/* Product Image */}
                                    <div className="relative w-full aspect-square max-w-sm mx-auto mb-6 sm:mb-8 pt-6 sm:pt-8">
                                        <div className="absolute top-8 sm:top-12 right-2 sm:right-4 z-10">
                                            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
                                                {slide.discount}
                                            </div>
                                        </div>
                                        <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-xl">
                                            <Image
                                                src={slide.productImage}
                                                alt={slide.productName}
                                                fill
                                                className="object-cover"
                                                priority={index === 0}
                                                quality={90}
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4 sm:space-y-6 text-center px-2">
                                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
                                            <Badge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                                            <span className="text-xs sm:text-sm font-semibold text-gray-700">
                                                {slide.badge}
                                            </span>
                                        </div>

                                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight px-2">
                                            {slide.title}
                                        </h1>

                                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-lg mx-auto">
                                            {slide.subtitle}
                                        </p>

                                        {/* Mobile CTA Buttons */}
                                        <div className="pt-2 sm:pt-4 space-y-3 sm:flex sm:flex-row sm:space-y-0 sm:gap-3 sm:justify-center">
                                            <Link href="/ecommerce/products" className="block sm:inline-block">
                                                <Button
                                                    size="lg"
                                                    className="w-full sm:w-auto sm:min-w-40 bg-gray-900 hover:bg-gray-800 text-white rounded-full h-12 sm:h-13 text-base font-semibold shadow-lg active:scale-95 transition-transform"
                                                >
                                                    Shop Now
                                                    <ArrowRight className="ml-2 w-5 h-5" />
                                                </Button>
                                            </Link>
                                            <Link href="/ecommerce/deals" className="hidden sm:inline-block">
                                                <Button
                                                    size="lg"
                                                    variant="outline"
                                                    className="w-full sm:w-auto sm:min-w-40 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-full h-12 sm:h-13 text-base font-semibold active:scale-95 transition-transform"
                                                >
                                                    View Deals
                                                </Button>
                                            </Link>
                                        </div>

                                        {/* Mobile Trust Indicators */}
                                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 text-xs sm:text-sm">
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <Package className="w-4 h-4 text-gray-700" />
                                                <span className="font-medium">Free Ship $50+</span>
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <Shield className="w-4 h-4 text-gray-700" />
                                                <span className="font-medium">Secure</span>
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <Headphones className="w-4 h-4 text-gray-700" />
                                                <span className="font-medium">24/7 Support</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Carousel Navigation */}
                <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 items-center gap-3 z-10">
                    <CarouselPrevious className="static translate-y-0 bg-white hover:bg-gray-100 border border-gray-300 text-gray-900 rounded-full h-10 w-10 shadow-md" />

                    {/* Pagination Dots */}
                    <div className="flex items-center gap-2 px-4">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={`transition-all duration-300 rounded-full ${current === index
                                        ? "w-8 h-2 bg-gray-900"
                                        : "w-2 h-2 bg-gray-400 hover:bg-gray-600"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    <CarouselNext className="static translate-y-0 bg-white hover:bg-gray-100 border border-gray-300 text-gray-900 rounded-full h-10 w-10 shadow-md" />
                </div>

                {/* Mobile Dots */}
                <div className="flex lg:hidden justify-center items-center gap-2 py-4 sm:py-6">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={`transition-all duration-300 rounded-full active:scale-90 ${current === index
                                    ? "w-8 h-2.5 bg-gray-900"
                                    : "w-2.5 h-2.5 bg-gray-400 hover:bg-gray-600"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </Carousel>
        </section>
    )
}
