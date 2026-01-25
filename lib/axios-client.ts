/**
 * Axios Client with JWT Token Management
 * Handles authentication, token refresh, and request/response interceptors
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { API_CONFIG, TOKEN_CONFIG } from '@/config/api.config'
import { API_ENDPOINTS } from '@/config/api-endpoints'

// Token Manager - handles all token operations
export const tokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null
    // Try to get from cookie first, then localStorage
    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('vendora_access_token='))
      ?.split('=')[1]
    return cookieToken || localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)
  },

  setAccessToken: (token: string): void => {
    if (typeof window === 'undefined') return
    // Store in both cookie and localStorage
    document.cookie = `vendora_access_token=${token}; path=/; max-age=86400; SameSite=Lax`
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, token)
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY)
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, token)
  },

  getUserType: (): 'admin' | 'vendor' | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_CONFIG.USER_TYPE_KEY) as 'admin' | 'vendor' | null
  },

  setUserType: (type: 'admin' | 'vendor'): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_CONFIG.USER_TYPE_KEY, type)
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return
    // Clear cookie
    document.cookie = 'vendora_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    // Clear localStorage
    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)
    localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY)
    localStorage.removeItem(TOKEN_CONFIG.USER_TYPE_KEY)
    localStorage.removeItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY)
  },

  setTokenExpiry: (expiresIn: number): void => {
    if (typeof window === 'undefined') return
    const expiry = Date.now() + (expiresIn * 1000)
    localStorage.setItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY, expiry.toString())
  },

  isTokenExpired: (): boolean => {
    if (typeof window === 'undefined') return true
    const expiry = localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY)
    if (!expiry) return true
    return Date.now() > Number(expiry)
  },
}

// Create Axios instance
const axiosClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Set to false for CORS to work without credentials
})

// Request Interceptor - Add JWT token to all requests
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        headers: config.headers,
      })
    }

    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Token refresh logic
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const AUTH_PATHS = [
  API_ENDPOINTS.ADMIN.LOGIN,
  API_ENDPOINTS.ADMIN.REGISTER,
  API_ENDPOINTS.ADMIN.VERIFY_2FA,
  API_ENDPOINTS.ADMIN.FORGOT_PASSWORD,
  API_ENDPOINTS.ADMIN.RESET_PASSWORD,
  API_ENDPOINTS.ADMIN.VERIFY_EMAIL,
  API_ENDPOINTS.ADMIN.RESEND_VERIFICATION,
  API_ENDPOINTS.VENDOR.LOGIN,
  API_ENDPOINTS.VENDOR.REGISTER,
  API_ENDPOINTS.VENDOR.VERIFY_2FA,
  API_ENDPOINTS.VENDOR.FORGOT_PASSWORD,
  API_ENDPOINTS.VENDOR.RESET_PASSWORD,
  API_ENDPOINTS.VENDOR.VERIFY_EMAIL,
  API_ENDPOINTS.VENDOR.RESEND_VERIFICATION,
]

const isAuthRequest = (url?: string): boolean => {
  if (!url) return false
  return AUTH_PATHS.some((path) => url.includes(path))
}

const resolveLoginPath = (userType?: 'admin' | 'vendor' | null): string => {
  if (userType === 'vendor') return '/pos/auth/login'
  if (userType === 'admin') return '/admin/auth/login'
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/pos')
      ? '/pos/auth/login'
      : '/admin/auth/login'
  }
  return '/admin/auth/login'
}

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// Response Interceptor - Handle token refresh and errors
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      })
    }

    return response
  },
  async (error: AxiosError<any>) => {
    const originalRequest: any = error.config

    if (error.response?.status === 401 && isAuthRequest(originalRequest?.url)) {
      return Promise.reject(error)
    }

    // Handle network errors (no response from server)
    if (!error.response) {
      console.error('❌ Network Error:', {
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        code: error.code,
      })

      // Return a more user-friendly error
      const networkError = new Error(
        'Unable to connect to the server. Please ensure the backend API is running at ' +
        (error.config?.baseURL || 'the configured URL') +
        '. Error: ' + error.message
      )
      return Promise.reject(networkError)
    }

    // If error is not 401, reject immediately
    if (error.response?.status !== 401) {
      console.error('❌ Response Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
      })
      return Promise.reject(error)
    }

    // If we've already tried to refresh, don't try again
    if (originalRequest._retry) {
      tokenManager.clearTokens()
      if (typeof window !== 'undefined') {
        const loginPath = resolveLoginPath(tokenManager.getUserType())
        window.location.href = loginPath
      }
      return Promise.reject(error)
    }

    // If refresh is in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return axiosClient(originalRequest)
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    }

    originalRequest._retry = true
    isRefreshing = true

    const userType = tokenManager.getUserType()

    if (!userType) {
      tokenManager.clearTokens()
      if (typeof window !== 'undefined') {
        window.location.href = resolveLoginPath(null)
      }
      return Promise.reject(error)
    }

    const refreshEndpoint = userType === 'admin'
      ? API_ENDPOINTS.ADMIN.REFRESH
      : API_ENDPOINTS.VENDOR.REFRESH

    try {
      console.log('🔄 Refreshing token...')

      const { data } = await axiosClient.post(refreshEndpoint)

      if (data.success && data.data.token) {
        console.log('✅ Token refreshed successfully')

        tokenManager.setAccessToken(data.data.token)

        if (data.data.expires_in) {
          tokenManager.setTokenExpiry(data.data.expires_in)
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.data.token}`
        }

        processQueue(null, data.data.token)
        return axiosClient(originalRequest)
      }
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError)

      processQueue(refreshError, null)
      tokenManager.clearTokens()

      if (typeof window !== 'undefined') {
        window.location.href = resolveLoginPath(userType)
      }

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }

    return Promise.reject(error)
  }
)

export default axiosClient
