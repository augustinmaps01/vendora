import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">VENDORA</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Your one-stop destination for premium fashion and lifestyle products.
                            We bring you the latest trends with quality assurance.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Youtube className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/ecommerce/about" className="hover:text-primary transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link href="/ecommerce/contact" className="hover:text-primary transition-colors">Contact Us</Link>
                            </li>
                            <li>
                                <Link href="/ecommerce/faq" className="hover:text-primary transition-colors">FAQs</Link>
                            </li>
                            <li>
                                <Link href="/ecommerce/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
                            </li>
                            <li>
                                <Link href="/ecommerce/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Customer Service</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/ecommerce/orders" className="hover:text-primary transition-colors">Track Order</Link>
                            </li>
                            <li>
                                <Link href="/ecommerce/returns" className="hover:text-primary transition-colors">Returns & Exchanges</Link>
                            </li>
                            <li>
                                <Link href="/ecommerce/shipping" className="hover:text-primary transition-colors">Shipping Info</Link>
                            </li>
                            <li>
                                <Link href="/ecommerce/size-guide" className="hover:text-primary transition-colors">Size Guide</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Stay Updated</h4>
                        <p className="text-sm text-muted-foreground">
                            Subscribe to our newsletter for exclusive deals and updates.
                        </p>
                        <div className="flex gap-2">
                            <Input placeholder="Enter your email" className="bg-muted/50" />
                            <Button>Subscribe</Button>
                        </div>
                        <div className="space-y-2 pt-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>123 Fashion Street, NY 10001</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span>support@vendora.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Vendora. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <span>Visa</span>
                        <span>Mastercard</span>
                        <span>PayPal</span>
                        <span>Apple Pay</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
