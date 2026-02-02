"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Clock, Eye, EyeOff, Loader2, LogOut } from "lucide-react"
import { VendorLoginCredentials } from "@/types/auth"
import { authService } from "@/services/auth-jwt.service"
import { toast } from "sonner"

// Professional error messages for different scenarios
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: {
    title: "Incorrect email or password",
    description: "Please check your credentials and try again.",
  },
  ACCOUNT_LOCKED: {
    title: "Account temporarily locked",
    description: "Too many failed attempts. Please try again later.",
  },
  EMAIL_NOT_VERIFIED: {
    title: "Please verify your email first",
    description: "Check your inbox for the verification link.",
  },
  NETWORK_ERROR: {
    title: "Unable to connect to server",
    description: "Please check your internet connection.",
  },
  SERVER_ERROR: {
    title: "Service temporarily unavailable",
    description: "Please try again in a few moments.",
  },
  SESSION_EXPIRED: {
    title: "Session expired",
    description: "Please sign in again to continue.",
  },
  TWO_FACTOR_INVALID: {
    title: "Invalid verification code",
    description: "Please check the code and try again.",
  },
  DEFAULT: {
    title: "Unable to sign in",
    description: "Please try again or contact support.",
  },
} as const

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginForm = z.infer<typeof loginSchema>

function VendorLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/pos/dashboard'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{ title: string; description: string } | null>(null)
  const [requires2FA, setRequires2FA] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [accountLocked, setAccountLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  // Auto-dismiss error message after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Auto-dismiss account locked message after 3 seconds
  useEffect(() => {
    if (accountLocked) {
      const timer = setTimeout(() => {
        setAccountLocked(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [accountLocked])

  // Show logout success message if user just logged out
  useEffect(() => {
    const showLogout = sessionStorage.getItem('showLogout')
    if (showLogout) {
      sessionStorage.removeItem('showLogout')
      toast.success("Logged out successfully", {
        description: "You've been securely signed out. See you next time!",
        icon: <LogOut className="w-5 h-5 text-purple-600" />,
      })
    }
  }, [])

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

      const result = await authService.pos.login(credentials)

      if (!result.success) {
        throw new Error(result.message || "Login failed")
      }

      if (result.data.requires_two_factor) {
        setRequires2FA(true)
        toast.info("Two-Factor Authentication Required", {
          description: "Please enter the verification code sent to your device.",
          icon: <Shield className="w-5 h-5 text-purple-600" />,
        })
        return
      }

      // Set flag for welcome message on dashboard
      sessionStorage.setItem('showWelcome', 'true')

      // Show loading overlay and redirect immediately
      setIsNavigating(true)
      router.push(redirectTo)
    } catch (err: unknown) {
      const axiosError = err as {
        response?: {
          status?: number
          data?: {
            message?: string
            errors?: {
              account_locked?: boolean
              lockout_expiry?: string
              requires_email_verification?: boolean
            }
          }
        },
        message?: string,
        code?: string
      }

      // Handle network errors
      if (axiosError.code === 'ERR_NETWORK' || !axiosError.response) {
        setError(ERROR_MESSAGES.NETWORK_ERROR)
        return
      }

      // Handle server errors (5xx)
      if (axiosError.response?.status && axiosError.response.status >= 500) {
        setError(ERROR_MESSAGES.SERVER_ERROR)
        return
      }

      if (axiosError.response?.data) {
        const errorData = axiosError.response.data

        // Handle account locked
        if (errorData.errors?.account_locked) {
          setAccountLocked(true)
          setLockoutTime(errorData.errors.lockout_expiry || null)
          setError(ERROR_MESSAGES.ACCOUNT_LOCKED)
          return
        }

        // Handle email verification required
        if (errorData.errors?.requires_email_verification) {
          setError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED)
          return
        }

        // Handle invalid credentials (401)
        if (axiosError.response?.status === 401) {
          setError(ERROR_MESSAGES.INVALID_CREDENTIALS)
          return
        }

        // Default error with server message
        setError({
          title: ERROR_MESSAGES.DEFAULT.title,
          description: errorData.message || ERROR_MESSAGES.DEFAULT.description,
        })
      } else {
        setError(ERROR_MESSAGES.DEFAULT)
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

      const result = await authService.pos.verify2FA({
        email,
        code: twoFactorCode,
        user_type: "vendor",
      })

      if (!result.success) {
        throw new Error(result.message || "Invalid verification code")
      }

      // Set flag for welcome message on dashboard
      sessionStorage.setItem('showWelcome', 'true')

      // Show loading overlay and redirect immediately
      setIsNavigating(true)
      router.push(redirectTo)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.TWO_FACTOR_INVALID.description
      setError({
        title: ERROR_MESSAGES.TWO_FACTOR_INVALID.title,
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Beautiful branded loading overlay
  if (isNavigating) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-300" style={{ backgroundColor: '#110228' }}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col items-center gap-8 p-8">
          {/* Logo with pulse animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl animate-pulse" />
            <div className="relative flex items-center justify-center w-32 h-32 bg-white rounded-3xl shadow-2xl p-5">
              <Image
                src="/logos/logo.png"
                alt="Vendora"
                width={96}
                height={96}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Brand name */}
          <h1 className="text-4xl font-bold text-white tracking-wide">Vendora</h1>

          {/* Loading indicator */}
          <div className="flex flex-col items-center gap-4 mt-2">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
            <p className="text-purple-300 text-sm">Loading...</p>
          </div>
        </div>

        {/* CSS for loading progress animation */}
        <style jsx>{`
          @keyframes loading-progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    )
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
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-50 border-l-4 border-red-500 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                  <span className="text-red-700 text-sm">{error.title}</span>
                </div>
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Column - Image (60% width) */}
      <div className="relative w-full h-64 sm:h-80 lg:h-screen lg:w-3/5 bg-slate-900">
        <img
          src="/images/Login.jpg"
          alt="Login Background"
          className="absolute inset-0 w-full h-full object-cover object-left"
        />
      </div>

      {/* Right Column - Login Form (40% width) */}
      <div className="w-full lg:w-2/5 lg:h-screen flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900">Login to your account</h2>
            <p className="text-gray-500 mt-2 text-sm">Sign in to your management dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Error Message */}
            {error && !accountLocked && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-50 border-l-4 border-red-500 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                <span className="text-red-700 text-sm">{error.title}</span>
              </div>
            )}

            {/* Account Locked Message */}
            {accountLocked && lockoutTime && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-50 border-l-4 border-amber-500 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="text-amber-700 text-sm">
                  Account locked until {new Date(lockoutTime).toLocaleTimeString()}
                </span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="vendor@example.com"
                className="h-9 bg-gray-50 border-gray-200 focus:bg-white"
                disabled={isLoading}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              </div>
              <div className="relative">
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-9 bg-gray-50 border-gray-200 focus:bg-white pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              <div className="flex justify-end pt-1">
                <Link
                  href="/pos/auth/forgot-password"
                  className="text-xs font-medium text-purple-600 hover:text-purple-700"
                >
                  Forgot password?
                </Link>
              </div>
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
              className="w-full font-bold text-white transition-all bg-purple-600 h-11 hover:bg-purple-700 rounded-lg"
              disabled={isLoading || accountLocked}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 text-gray-400 bg-white">OR</span>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              Don't have an account? <Link href="/pos/auth/register" className="font-medium text-purple-600 hover:text-purple-700">Create an account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function VendorLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-magenta-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    }>
      <VendorLoginContent />
    </Suspense>
  )
}
