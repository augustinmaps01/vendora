"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Shield, Store } from "lucide-react"
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
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
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
                <AlertCircle className="h-4 w-4" />
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
                className="text-center text-2xl tracking-widest"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" size="lg" disabled={isLoading || twoFactorCode.length !== 6}>
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
  <div className="flex items-center justify-center">
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <Store className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">Vendor Portal</CardTitle>
        <CardDescription className="text-center">
          Sign in to manage your store and POS
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Account Locked Message */}
        {accountLocked && lockoutTime && (
          <div className="flex items-center gap-2 p-3 text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>Account locked until {new Date(lockoutTime).toLocaleTimeString()}. Please try again later.</span>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="vendor@example.com"
            autoComplete="email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password")}
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              disabled={isLoading}
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Link
            href="/pos/auth/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading || accountLocked}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </CardContent>
    <CardFooter className="flex flex-col space-y-4">
      <div className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/pos/auth/register" className="text-primary hover:underline font-medium">
          Create vendor account
        </Link>
      </div>
    </CardFooter>
  </Card>
  </div>
)

}