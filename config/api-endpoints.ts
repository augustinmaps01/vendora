/**
 * Centralized API Endpoints
 * All API endpoints in one place - easy to maintain and update
 * NO HARDCODED ENDPOINTS IN COMPONENTS OR SERVICES
 */

export const API_ENDPOINTS = {
  // Admin Authentication Endpoints
  ADMIN: {
    REGISTER: '/admin/auth/register',
    LOGIN: '/admin/auth/login',
    LOGOUT: '/admin/auth/logout',
    REFRESH: '/admin/auth/refresh',
    ME: '/admin/auth/me',
    VERIFY_2FA: '/admin/auth/verify-2fa',
    FORGOT_PASSWORD: '/admin/auth/forgot-password',
    RESET_PASSWORD: '/admin/auth/reset-password',
    VERIFY_EMAIL: '/admin/auth/verify-email',
    RESEND_VERIFICATION: '/admin/auth/resend-verification',
  },

  // Vendor/POS Authentication Endpoints
  VENDOR: {
    REGISTER: '/vendor/auth/register',
    LOGIN: '/vendor/auth/login',
    LOGOUT: '/vendor/auth/logout',
    REFRESH: '/vendor/auth/refresh',
    ME: '/vendor/auth/me',
    VERIFY_2FA: '/vendor/auth/verify-2fa',
    FORGOT_PASSWORD: '/vendor/auth/forgot-password',
    RESET_PASSWORD: '/vendor/auth/reset-password',
    VERIFY_EMAIL: '/vendor/auth/verify-email',
    RESEND_VERIFICATION: '/vendor/auth/resend-verification',
  },

  // Payment Webhooks
  WEBHOOKS: {
    PAYMENT: '/webhooks/payment',
  },

  // Future endpoints can be added here
  // ADMIN_DASHBOARD: { ... },
  // VENDOR_PRODUCTS: { ... },
  // etc.
} as const

export type ApiEndpoint = typeof API_ENDPOINTS