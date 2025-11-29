import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = [
  '/pos/auth/login',
  '/pos/auth/register',
  '/pos/auth/forgot-password',
  '/pos/auth/reset-password',
  '/pos/auth/verify-email',
  '/admin/auth/login',
  '/admin/auth/register',
  '/admin/auth/forgot-password',
  '/admin/auth/reset-password',
  '/admin/auth/verify-email',
]

// Define protected route prefixes
const protectedPrefixes = [
  '/pos/dashboard',
  '/pos/sales',
  '/pos/products',
  '/pos/customers',
  '/pos/inventory',
  '/pos/categories',
  '/pos/reports',
  '/pos/invoices',
  '/pos/payments',
  '/pos/settings',
  '/admin/dashboard',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path is a protected route
  const isProtectedRoute = protectedPrefixes.some(prefix =>
    pathname.startsWith(prefix)
  )

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Get auth token from cookies or localStorage (we'll check via headers)
  const token = request.cookies.get('vendora_access_token')?.value

  // If it's a protected route and user is not authenticated, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = pathname.startsWith('/admin')
      ? '/admin/auth/login'
      : '/pos/auth/login'

    return NextResponse.redirect(new URL(loginUrl, request.url))
  }

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (isPublicRoute && token) {
    const dashboardUrl = pathname.startsWith('/admin')
      ? '/admin/dashboard'
      : '/pos/dashboard'

    return NextResponse.redirect(new URL(dashboardUrl, request.url))
  }

  return NextResponse.next()
}

// Configure which routes should be checked by the middleware
export const config = {
  matcher: [
    '/pos/:path*',
    '/admin/:path*',
  ],
}
