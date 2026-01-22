"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Shield, Store, TrendingUp, Package, BarChart3, Lock, Mail } from "lucide-react"
import { VendorLoginCredentials } from "@/types/auth"
import { authService } from "@/services/auth-jwt.service"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function VendorLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requires2FA, setRequires2FA] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [accountLocked, setAccountLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError(null)
    setAccountLocked(false)

    try {
      const credentials: VendorLoginCredentials = {
        ...data,
        user_type: "vendor",
      }

      // Use authService which properly handles API calls
      const result = await authService.vendor.login(credentials)

      if (!result.success) {
        throw new Error(result.message || "Login failed")
      }

      if (result.data.requires_two_factor) {
        setRequires2FA(true)
        return
      }

      // Successful login - token is automatically stored by authService
      router.push("/pos/dashboard")
    } catch (err: unknown) {
      // Handle different error types
      const axiosError = err as { response?: { data?: { message?: string; errors?: { account_locked?: boolean; lockout_expiry?: string; requires_email_verification?: boolean } } }, message?: string }

      if (axiosError.response?.data) {
        const errorData = axiosError.response.data

        // Check for account locked
        if (errorData.errors?.account_locked) {
          setAccountLocked(true)
          setLockoutTime(errorData.errors.lockout_expiry || null)
          setError(errorData.message || "Account is temporarily locked due to multiple failed login attempts")
          return
        }

        // Check for email verification required
        if (errorData.errors?.requires_email_verification) {
          setError("Please verify your email before logging in. Check your inbox for the verification link.")
          return
        }

        setError(errorData.message || "Invalid email or password")
      } else {
        setError((err as Error)?.message || "An error occurred during login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const email = getValues("email")

      // TODO: Replace with actual API call
      const response = await fetch("/api/vendor/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: twoFactorCode,
          user_type: "vendor",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Invalid verification code")
      }

      // Successful 2FA verification
      router.push("/pos/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during verification")
    } finally {
      setIsLoading(false)
    }
  }

  if (requires2FA) {
    return (
      <div className="flex items-center justify-center bg-gray-50/50">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-purple-600" />
            </div>
            <CardTitle className="text-2xl text-center">Two-Factor Authentication</CardTitle>
            <CardDescription className="text-center">
              Enter the verification code from your authenticator app or email
            </CardDescription>
          </CardHeader>
          <form onSubmit={handle2FASubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  maxLength={6}
                  className="text-2xl tracking-widest text-center"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" size="lg" disabled={isLoading || twoFactorCode.length !== 6}>
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setRequires2FA(false)}
              >
                Back to Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative flex overflow-hidden bg-neutral-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* Main Container - 60/40 Split - Full Width */}
      <div className="relative z-10 flex flex-col w-full overflow-hidden bg-white lg:flex-row">

        {/* Left Section - Executive Branding (60%) */}
        <div className="lg:w-3/5 bg-gradient-to-br from-[#1a0f2e] via-[#241535] to-[#1a0f2e] relative overflow-hidden flex flex-col justify-between py-6 px-8 lg:py-10 lg:px-16 xl:px-20 text-white">

          {/* Abstract Geometric Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
          </div>

          {/* Abstract Dashboard Visualization Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top-right abstract chart lines */}

            {/* Bottom-left abstract grid boxes */}

            {/* Center abstract circle elements */}
          </div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="mb-6 lg:mb-8">
              <div className="inline-block">
                <Image
                  src="/logos/full logo-light.png"
                  alt="Vendora POS"
                  width={200}
                  height={58}
                  className="w-auto h-10 lg:h-12"
                  priority
                />
              </div>
            </div>

            {/* Executive Messaging */}
            <div className="max-w-2xl space-y-3">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight text-white">
                Command Your Business
              </h1>
              <p className="max-w-xl text-base font-normal leading-normal text-white/70 lg:text-lg">
                Centralized control for business owners and store managers. Monitor operations, analyze performance, and drive growth from a single platform.
              </p>
            </div>
          </div>

          {/* Executive Feature Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-3 py-4 lg:gap-4">
            <div className="p-3 border rounded-lg border-white/10 lg:p-4 backdrop-blur-sm bg-white/5">
              <BarChart3 className="w-6 h-6 mb-2 text-purple-400 lg:h-7 lg:w-7" />
              <h3 className="font-semibold text-white text-sm lg:text-base mb-0.5">Analytics Dashboard</h3>
              <p className="text-xs font-light text-white/50">Real-time insights</p>
            </div>
            <div className="p-3 border rounded-lg border-white/10 lg:p-4 backdrop-blur-sm bg-white/5">
              <TrendingUp className="w-6 h-6 mb-2 text-pink-400 lg:h-7 lg:w-7" />
              <h3 className="font-semibold text-white text-sm lg:text-base mb-0.5">Performance Metrics</h3>
              <p className="text-xs font-light text-white/50">Track growth</p>
            </div>
            <div className="p-3 border rounded-lg border-white/10 lg:p-4 backdrop-blur-sm bg-white/5">
              <Package className="w-6 h-6 mb-2 text-purple-300 lg:h-7 lg:w-7" />
              <h3 className="font-semibold text-white text-sm lg:text-base mb-0.5">Inventory Control</h3>
              <p className="text-xs font-light text-white/50">Complete oversight</p>
            </div>
            <div className="p-3 border rounded-lg border-white/10 lg:p-4 backdrop-blur-sm bg-white/5">
              <Store className="w-6 h-6 mb-2 text-pink-300 lg:h-7 lg:w-7" />
              <h3 className="font-semibold text-white text-sm lg:text-base mb-0.5">Multi-Store Management</h3>
              <p className="text-xs font-light text-white/50">Unified platform</p>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form (40%) */}
        <div className="relative flex items-center justify-center px-8 py-6 bg-white lg:w-2/5 lg:py-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-lg space-y-5">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">Vendor POS</h2>
              <p className="text-gray-600 mt-1.5 font-normal text-sm lg:text-base">Sign in to your management dashboard</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Error Message */}
              {error && (
                <Alert variant="destructive" className="border-red-300 bg-red-50/80 backdrop-blur-sm animate-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="font-medium text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {/* Account Locked Message */}
              {accountLocked && lockoutTime && (
                <Alert className="border-yellow-300 bg-yellow-50/80 backdrop-blur-sm animate-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <AlertDescription className="font-medium text-yellow-800">
                    Account locked until {new Date(lockoutTime).toLocaleTimeString()}. Please try again later.
                  </AlertDescription>
                </Alert>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <Input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="vendor@example.com"
                    className="pl-10 text-sm transition-all border-gray-200 h-11 bg-gray-50 focus:bg-white"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <Link
                    href="/pos/auth/forgot-password"
                    className="text-xs font-medium text-purple-600 hover:text-purple-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <Input
                    {...register("password")}
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 text-sm transition-all border-gray-200 h-11 bg-gray-50 focus:bg-white"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <label htmlFor="remember" className="text-xs font-medium text-gray-600 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              <Button
                type="submit"
                className="w-full font-semibold text-white transition-all bg-purple-600 shadow-lg h-11 hover:bg-purple-700 rounded-xl shadow-purple-500/20"
                disabled={isLoading || accountLocked}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 text-gray-500 bg-white">New to Vendora?</span>
              </div>
            </div>

            <div className="-mt-1 text-center">
              <Link href="/pos/auth/register" className="text-sm font-semibold text-purple-600 hover:text-purple-700">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute left-0 right-0 z-20 pointer-events-none bottom-2">
        <div className="w-full px-8 lg:px-16 xl:px-20">
          <div className="flex items-center justify-between">
            <p className="text-xs font-light text-gray-400">© 2026 Vendora POS. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-light text-gray-400">Enterprise-grade security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
