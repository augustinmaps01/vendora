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
     * Verify 2FA code
     */
    async verify2FA(data: TwoFactorVerification): Promise<ApiResponse<AuthResponse>> {
      const response = await axiosClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.VENDOR.VERIFY_2FA,
        data
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

    /**
     * Get current authenticated vendor user
     */
    async me(): Promise<User> {
      const response = await axiosClient.get<ApiResponse<{ user: User }>>(API_ENDPOINTS.VENDOR.ME)
      return response.data.data.user
    },

    /**
     * Request password reset
     */
    async forgotPassword(email: string): Promise<{ message: string }> {
      const response = await axiosClient.post<ApiResponse>(
        API_ENDPOINTS.VENDOR.FORGOT_PASSWORD,
        { email, user_type: 'vendor' }
      )
      return { message: response.data.message }
    },

    /**
     * Reset password with token
     */
    async resetPassword(data: PasswordReset): Promise<{ message: string }> {
      const response = await axiosClient.post<ApiResponse>(
        API_ENDPOINTS.VENDOR.RESET_PASSWORD,
        data
      )
      return { message: response.data.message }
    },

    /**
     * Verify email with token
     */
    async verifyEmail(token: string): Promise<{ message: string; user: User }> {
      const response = await axiosClient.post<ApiResponse<{ user: User }>>(
        API_ENDPOINTS.VENDOR.VERIFY_EMAIL,
        { token, user_type: 'vendor' }
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
        API_ENDPOINTS.VENDOR.RESEND_VERIFICATION
      )
      return { message: response.data.message }
    },
  },
}

// Export token manager for use in other parts of the app
export { tokenManager }