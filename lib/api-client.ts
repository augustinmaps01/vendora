/**
 * API Client Configuration
 *
 * Centralized Axios configuration for API calls to Laravel backend
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { env } from "@/config/env";
import { tokenManager } from "@/lib/axios-client";

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

/**
 * Create Axios instance with default configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.api.baseUrl,
    timeout: env.api.timeout,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: env.api.withCredentials,
  });

  // Request Interceptor
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Handle FormData - let axios set the Content-Type with proper boundary
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      // Add API version to URL if configured
      if (
        env.api.version &&
        config.url &&
        !config.url.includes(env.api.version)
      ) {
        config.url = `/${env.api.version}${config.url}`;
      }

      // Always log auth status for debugging
      if (process.env.NODE_ENV === "development") {
        console.log("📤 API Request:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 10)}...` : "none",
          data: config.data instanceof FormData ? "[FormData]" : config.data,
        });
      }

      return config;
    },
    (error) => {
      if (env.debug.enabled) {
        console.error("❌ Request Error:", error);
      }
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in debug mode
      if (env.debug.enabled) {
        console.log("📥 API Response:", {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }

      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // Log error in debug mode

      // Handle 401 Unauthorized - Token expired
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh token
          const newToken = await refreshAuthToken();
          if (newToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          clearAuthTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        const responseData = error.response?.data as any;
        console.error("Access forbidden:", {
          message: responseData?.message,
          error: responseData?.error,
          errors: responseData?.errors,
          fullResponse: responseData,
        });
      }

      // Handle 500 Server Error
      if (error.response?.status === 500) {
        if (typeof window !== "undefined") {
          console.error("Server error occurred");
        }
      }

      return Promise.reject(formatApiError(error));
    }
  );

  return client;
};

/**
 * Format API error for consistent error handling
 */
const formatApiError = (error: AxiosError): any => {
  const response = error.response?.data as any;
  const status = error.response?.status;

  // Provide more specific messages for common errors
  let message = response?.message || error.message || "An error occurred";

  if (status === 403) {
    message = response?.message || "You don't have permission to perform this action. Please check your account status.";
  } else if (status === 401) {
    message = "Your session has expired. Please log in again.";
  }

  // Return a more comprehensive error object that preserves axios structure
  return {
    message,
    status,
    errors: response?.errors,
    // Preserve original response structure for detailed debugging
    response: error.response ? {
      data: error.response.data,
      status: error.response.status,
      statusText: error.response.statusText,
      headers: error.response.headers,
    } : undefined,
    // Preserve the original error properties
    name: error.name,
    code: error.code,
    config: error.config,
  };
};

/**
 * Get auth token from storage
 */
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return tokenManager.getAccessToken() || localStorage.getItem(env.auth.tokenKey);
};

/**
 * Get refresh token from storage
 */
const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(env.auth.refreshTokenKey);
};

/**
 * Set auth tokens in storage
 */
export const setAuthTokens = (token: string, refreshToken?: string): void => {
  if (typeof window === "undefined") return;
  tokenManager.setAccessToken(token);
  localStorage.setItem(env.auth.tokenKey, token);
  if (refreshToken) {
    tokenManager.setRefreshToken(refreshToken);
    localStorage.setItem(env.auth.refreshTokenKey, refreshToken);
  }
};

/**
 * Clear auth tokens from storage
 */
export const clearAuthTokens = (): void => {
  if (typeof window === "undefined") return;
  tokenManager.clearTokens();
  localStorage.removeItem(env.auth.tokenKey);
  localStorage.removeItem(env.auth.refreshTokenKey);
};

/**
 * Refresh auth token
 */
const refreshAuthToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${env.api.baseUrl}/auth/refresh`, {
      refresh_token: refreshToken,
    });

    const { token, refresh_token } = response.data.data;
    setAuthTokens(token, refresh_token);
    return token;
  } catch (error) {
    return null;
  }
};

// Create and export the API client instance
export const apiClient = createApiClient();

/**
 * API Request Helper Functions
 */

export const api = {
  /**
   * GET request
   */
  get: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data.data as T;
  },

  /**
   * POST request
   */
  post: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  },

  /**
   * PUT request
   */
  put: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  },

  /**
   * PATCH request
   */
  patch: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  },

  /**
   * DELETE request
   */
  delete: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data.data as T;
  },

  /**
   * Upload file(s)
   */
  upload: async <T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    return response.data.data as T;
  },
};

export default api;
