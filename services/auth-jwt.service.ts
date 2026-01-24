/**
 * Centralized Authentication Service with JWT
 * All authentication API calls go through here
 * NO HARDCODED ENDPOINTS - uses centralized config
 */

import axiosClient, { tokenManager } from '@/lib/axios-client'
import { API_ENDPOINTS } from '@/config/api-endpoints'
import {
  AdminLoginCredentials,
  VendorLoginCredentials,
  AdminRegisterData,
  VendorRegisterData,
  AuthResponse,
  User,
  TwoFactorVerification,
  PasswordResetRequest,
  PasswordReset,
} from '@/types/auth'

// Response type for API calls
interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

interface PosAuthResponse extends AuthResponse {
  payment_url?: string
}

const normalizePosAuthResponse = (raw: unknown): ApiResponse<PosAuthResponse> => {
  if (raw && typeof raw === 'object') {
    const record = raw as Record<string, unknown>

    if ('success' in record && 'data' in record) {
      return {
        success: Boolean(record.success),
        message: typeof record.message === 'string' ? record.message : 'OK',
        data: record.data as PosAuthResponse,
      }
    }

    const message = typeof record.message === 'string' ? record.message : 'OK'
    const token = typeof record.token === 'string' ? record.token : ''
    const requiresTwoFactor =
      typeof record.requires_two_factor === 'boolean' ? record.requires_two_factor : undefined
    const requiresEmailVerification =
      typeof record.requires_email_verification === 'boolean'
        ? record.requires_email_verification
        : undefined

    return {
      success: Boolean(token || requiresTwoFactor || requiresEmailVerification),
      message,
      data: {
        user: (record.user ?? {}) as User,
        token,
        session_token:
          typeof record.session_token === 'string' ? record.session_token : '',
        refreshToken:
          typeof record.refreshToken === 'string' ? record.refreshToken : undefined,
        expires_in: typeof record.expires_in === 'number' ? record.expires_in : undefined,
        requires_two_factor: requiresTwoFactor,
        requires_email_verification: requiresEmailVerification,
        payment_url: typeof record.payment_url === 'string' ? record.payment_url : undefined,
      },
    }
  }

  return {
    success: false,
    message: 'Invalid response from server',
    data: {
      user: {} as User,
      token: '',
      session_token: '',
    },
  }
}

export const authService = {
  /**
   * Admin Authentication Methods
   */
  admin: {
    /**
     * Register a new admin user
     */
    async register(data: AdminRegisterData): Promise<ApiResponse<AuthResponse>> {
      const response = await axiosClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.ADMIN.REGISTER,
        data
      )

      // Store token if registration is successful and returns a token
      if (response.data.success && response.data.data.token) {
        tokenManager.setAccessToken(response.data.data.token)
        tokenManager.setUserType('admin')

        if (response.data.data.expires_in) {
          tokenManager.setTokenExpiry(response.data.data.expires_in)
        }
      }

      return response.data
    },

    /**
     * Login admin user
     */
    async login(credentials: AdminLoginCredentials): Promise<ApiResponse<AuthResponse>> {
      const response = await axiosClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.ADMIN.LOGIN,
        credentials
      )

      if (response.data.success && response.data.data.token) {
        tokenManager.setAccessToken(response.data.data.token)
        tokenManager.setUserType('admin')

        if (response.data.data.expires_in) {
          tokenManager.setTokenExpiry(response.data.data.expires_in)
        }
      }

      return response.data
    },

    /**
     * Verify 2FA code
     */
    async verify2FA(data: TwoFactorVerification): Promise<ApiResponse<AuthResponse>> {
      const response = await axiosClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.ADMIN.VERIFY_2FA,
        data
      )

      if (response.data.success && response.data.data.token) {
        tokenManager.setAccessToken(response.data.data.token)
        tokenManager.setUserType('admin')

        if (response.data.data.expires_in) {
          tokenManager.setTokenExpiry(response.data.data.expires_in)
        }
      }

      return response.data
    },

    /**
     * Logout admin user
     */
    async logout(): Promise<void> {
      try {
        await axiosClient.post(API_ENDPOINTS.ADMIN.LOGOUT)
      } finally {
        tokenManager.clearTokens()
      }
    },

    /**
     * Get current authenticated admin user
     */
    async me(): Promise<User> {
      const response = await axiosClient.get<ApiResponse<{ user: User }>>(API_ENDPOINTS.ADMIN.ME)
      return response.data.data.user
    },

    /**
     * Request password reset
     */
    async forgotPassword(email: string): Promise<{ message: string }> {
      const response = await axiosClient.post<ApiResponse>(
        API_ENDPOINTS.ADMIN.FORGOT_PASSWORD,
        { email, user_type: 'admin' }
      )
      return { message: response.data.message }
    },

    /**
     * Reset password with token
     */
    async resetPassword(data: PasswordReset): Promise<{ message: string }> {
      const response = await axiosClient.post<ApiResponse>(
        API_ENDPOINTS.ADMIN.RESET_PASSWORD,
        data
      )
      return { message: response.data.message }
    },

    /**
     * Verify email with token
     */
    async verifyEmail(token: string): Promise<{ message: string; user: User }> {
      const response = await axiosClient.post<ApiResponse<{ user: User }>>(
        API_ENDPOINTS.ADMIN.VERIFY_EMAIL,
        { token, user_type: 'admin' }
      )
      return {
        message: response.data.message,
        user: response.data.data.user,
      }
    },

    /**
     * Resend email verification
     */
    async resendVerification(): Promise<{ message: string }> {
      const response = await axiosClient.post<ApiResponse>(
        API_ENDPOINTS.ADMIN.RESEND_VERIFICATION
      )
      return { message: response.data.message }
    },
  },

  /**
   * Vendor Authentication Methods
   */
  vendor: {
    /**
     * Register a new vendor
     */
    async register(data: VendorRegisterData): Promise<ApiResponse<{ user: User; payment_url?: string; message: string }>> {
      const response = await axiosClient.post<ApiResponse>(API_ENDPOINTS.VENDOR.REGISTER, data)
      return response.data
    },

    /**
     * Login vendor user
     */
    async login(credentials: VendorLoginCredentials): Promise<ApiResponse<AuthResponse>> {
      const response = await axiosClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.VENDOR.LOGIN,
        credentials
      )

      if (response.data.success && response.data.data.token) {
        tokenManager.setAccessToken(response.data.data.token)
        tokenManager.setUserType('vendor')

        if (response.data.data.expires_in) {
          tokenManager.setTokenExpiry(response.data.data.expires_in)
        }
      }

      return response.data
    },

    /**
     * Logout vendor user
     */
    async logout(): Promise<void> {
      try {
        await axiosClient.post(API_ENDPOINTS.VENDOR.LOGOUT)
      } finally {
        tokenManager.clearTokens()
      }
    },
  },

  /**
   * POS Authentication Methods
   */
  pos: {
    /**
     * Register a new POS vendor user
     */
    async register(data: VendorRegisterData): Promise<ApiResponse<PosAuthResponse>> {
      const response = await axiosClient.post(API_ENDPOINTS.VENDOR.REGISTER, data)
      const normalized = normalizePosAuthResponse(response.data)

      if (normalized.success && normalized.data.token) {
        tokenManager.setAccessToken(normalized.data.token)
        tokenManager.setUserType('vendor')

        if (normalized.data.expires_in) {
          tokenManager.setTokenExpiry(normalized.data.expires_in)
        }
      }

      return normalized
    },

    /**
     * Login POS vendor user
     */
    async login(credentials: VendorLoginCredentials): Promise<ApiResponse<PosAuthResponse>> {
      const response = await axiosClient.post(API_ENDPOINTS.VENDOR.LOGIN, credentials)
      const normalized = normalizePosAuthResponse(response.data)

      if (normalized.success && normalized.data.token) {
        tokenManager.setAccessToken(normalized.data.token)
        tokenManager.setUserType('vendor')

        if (normalized.data.expires_in) {
          tokenManager.setTokenExpiry(normalized.data.expires_in)
        }
      }

      return normalized
    },

    /**
     * Logout POS vendor user
     */
    async logout(): Promise<void> {
      try {
        await axiosClient.post(API_ENDPOINTS.VENDOR.LOGOUT)
      } finally {
        tokenManager.clearTokens()
      }
    },
  },
}

// Export token manager for use in other parts of the app
export { tokenManager }
