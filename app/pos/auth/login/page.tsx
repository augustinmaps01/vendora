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

      const result = await authService.pos.login(credentials)

      if (!result.success) {
        throw new Error(result.message || "Login failed")
      }

      if (result.data.requires_two_factor) {
        setRequires2FA(true)
        return
      }

      router.push("/pos/dashboard")
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string; errors?: { account_locked?: boolean; lockout_expiry?: string; requires_email_verification?: boolean } } }, message?: string }

      if (axiosError.response?.data) {
        const errorData = axiosError.response.data

        if (errorData.errors?.account_locked) {
          setAccountLocked(true)
          setLockoutTime(errorData.errors.lockout_expiry || null)
          setError(errorData.message || "Account is temporarily locked due to multiple failed login attempts")
          return
        }

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

      const result = await authService.pos.verify2FA({
        email,
        code: twoFactorCode,
        user_type: "vendor",
      })

      if (!result.success) {
        throw new Error(result.message || "Invalid verification code")
      }

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
                  type="password"
                  placeholder="Enter your password"
                  className="h-9 bg-gray-50 border-gray-200 focus:bg-white pr-10"
                  disabled={isLoading}
                />
                <Lock className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
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
