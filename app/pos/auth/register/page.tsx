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
import { Loader2, Building2, Mail, Lock, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import { VendorRegisterData } from "@/types/auth"
import { SubscriptionPlanSelector } from "@/components/auth/subscription-plan-selector"
import { authService } from "@/services/auth-jwt.service"

const registerSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function VendorRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1) // 1: Plan selection, 2: Account details, 3: Payment
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleNextStep = () => {
    if (step === 1 && !selectedPlan) {
      setError("Please select a subscription plan")
      return
    }
    setError(null)
    setStep((step + 1) as 2 | 3)
  }

  const handlePrevStep = () => {
    setError(null)
    setStep((step - 1) as 1 | 2)
  }

  const onSubmit = async (data: RegisterForm) => {
    if (!selectedPlan) {
      setError("Please select a subscription plan")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const registerData: VendorRegisterData = {
        ...data,
        subscription_plan: selectedPlan,
        user_type: "vendor",
      }

      // Use the authService which properly handles API calls
      const result = await authService.vendor.register(registerData)

      if (!result.success) {
        throw new Error(result.message || "Registration failed")
      }

      // Redirect to payment processor (Stripe/PayPal)
      if (result.data.payment_url) {
        // This would redirect to Stripe or PayPal checkout
        window.location.href = result.data.payment_url
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/pos/dashboard")
        }, 2000)
      }
    } catch (err) {
      // Handle API errors properly
      const errorMessage = (err as { response?: { data?: { message?: string } }, message?: string })?.response?.data?.message
        || (err as Error)?.message
        || "An error occurred during registration"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Registration Successful!</CardTitle>
            <CardDescription className="text-center">
              Your vendor account has been created successfully. We're setting up your store and subdomain. You'll receive a confirmation email shortly.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-sm text-center text-gray-600">
              Redirecting to dashboard...
            </p>
            <Button onClick={() => router.push("/pos/dashboard")} className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 py-3">
      <div className="w-full max-w-6xl mx-auto pb-20">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= s
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > s ? "bg-gradient-to-r from-emerald-500 to-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-20 mt-4 text-sm">
            <span className={step >= 1 ? "text-emerald-600 font-medium" : "text-gray-500"}>
              Choose Plan
            </span>
            <span className={step >= 2 ? "text-emerald-600 font-medium" : "text-gray-500"}>
              Account Details
            </span>
            <span className={step >= 3 ? "text-emerald-600 font-medium" : "text-gray-500"}>
              Payment
            </span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Plan Selection */}
        {step === 1 && (
          <>
            <div className="mb-24">
              <SubscriptionPlanSelector
                selectedPlan={selectedPlan}
                onSelectPlan={handlePlanSelection}
              />
            </div>

            {/* Sticky Navigation Buttons */}
            <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t shadow-lg">
              <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/pos/auth/login">
                  <Button variant="ghost">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
                <Button
                  onClick={handleNextStep}
                  className="bg-linear-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                  disabled={!selectedPlan}
                >
                  Continue
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Account Details */}
        {step === 2 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create Your Account</CardTitle>
              <CardDescription className="text-center">
                Enter your business details to get started
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...register("business_name")}
                      id="business_name"
                      type="text"
                      placeholder="Your Business Name"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.business_name && (
                    <p className="text-sm text-red-500">{errors.business_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="business@example.com"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...register("password")}
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Must contain at least 8 characters, one uppercase, one lowercase, and one number
                  </p>
                </div>

                <div className="space-y-2 py-5">
                  <Label htmlFor="password_confirmation">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...register("password_confirmation")}
                      id="password_confirmation"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.password_confirmation && (
                    <p className="text-sm text-red-500">{errors.password_confirmation.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="ghost" onClick={handlePrevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue to Payment
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Step 3: Payment - This would redirect to Stripe/PayPal */}
        {step === 3 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Processing...</CardTitle>
              <CardDescription className="text-center">
                Redirecting to secure payment processor
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}