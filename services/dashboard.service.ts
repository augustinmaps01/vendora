import axiosClient from '@/lib/axios-client'
import { AxiosError } from 'axios'
import type {
    DashboardKPIs,
    SalesTrend,
    OrdersByChannel,
    PaymentMethods,
    TopProducts,
    InventoryHealth,
    RecentActivity,
    DateRangeParams,
    InventoryItem,
} from '@/types/dashboard'

// Standard API Response wrapper
interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

/**
 * Retry helper with exponential backoff
 * Useful for handling temporary network issues or timeouts
 */
async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries = 2,
    delay = 1000
): Promise<T> {
    try {
        return await fn()
    } catch (error) {
        if (retries === 0) throw error

        // Only retry on network errors or timeouts
        if (error instanceof AxiosError) {
            const isRetryable =
                !error.response || // Network error
                error.code === 'ECONNABORTED' || // Timeout
                error.message.includes('timeout')

            if (!isRetryable) throw error
        }

        console.log(`⚠️ Request failed, retrying in ${delay}ms... (${retries} retries left)`)
        await new Promise(resolve => setTimeout(resolve, delay))
        return retryWithBackoff(fn, retries - 1, delay * 2) // Exponential backoff
    }
}

/**
 * Dashboard API Service
 * Provides methods to fetch dashboard data from the API
 * Uses centralized axiosClient for consistent auth token management (vendora_access_token)
 */
export const dashboardService = {
    /**
     * Get KPI metrics (Total Sales, Orders, Revenue, etc.)
     */
    async getKPIs(params?: DateRangeParams): Promise<DashboardKPIs> {
        return retryWithBackoff(async () => {
            const { data } = await axiosClient.get<ApiResponse<DashboardKPIs>>('/dashboard/kpis', {
                params,
                timeout: 90000 // Extended timeout for analytics
            })
            return data.data
        })
    },

    /**
     * Get sales trend over time (POS vs Online)
     * With retry logic and extended timeout for analytics
     */
    async getSalesTrend(params?: DateRangeParams): Promise<SalesTrend> {
        return retryWithBackoff(async () => {
            const { data } = await axiosClient.get<ApiResponse<SalesTrend>>('/dashboard/sales-trend', {
                params,
                timeout: 90000 // 90s timeout for analytics endpoint
            })
            return data.data
        })
    },

    /**
     * Get orders distribution by channel
     */
    async getOrdersByChannel(params?: DateRangeParams): Promise<OrdersByChannel> {
        return retryWithBackoff(async () => {
            const { data } = await axiosClient.get<ApiResponse<OrdersByChannel>>('/dashboard/orders-by-channel', {
                params,
                timeout: 90000 // Extended timeout for analytics
            })
            return data.data
        })
    },

    /**
     * Get payment methods distribution
     */
    async getPaymentMethods(params?: DateRangeParams): Promise<PaymentMethods> {
        return retryWithBackoff(async () => {
            const { data } = await axiosClient.get<ApiResponse<PaymentMethods>>('/dashboard/payment-methods', {
                params,
                timeout: 90000 // Extended timeout for analytics
            })
            return data.data
        })
    },

    /**
     * Get top selling products
     */
    async getTopProducts(params?: DateRangeParams & { limit?: number }): Promise<TopProducts> {
        return retryWithBackoff(async () => {
            const { data } = await axiosClient.get<ApiResponse<TopProducts>>('/dashboard/top-products', {
                params,
                timeout: 90000 // Extended timeout for analytics
            })
            return data.data
        })
    },

    /**
     * Get inventory health breakdown
     */
    async getInventoryHealth(): Promise<InventoryHealth> {
        const { data } = await axiosClient.get<ApiResponse<InventoryHealth>>('/dashboard/inventory-health')
        return data.data
    },

    /**
     * Get recent activity feed
     */
    async getRecentActivity(params?: { limit?: number }): Promise<RecentActivity> {
        const { data } = await axiosClient.get<ApiResponse<RecentActivity>>('/dashboard/recent-activity', { params })
        return data.data
    },

    /**
     * Get low stock items
     * Uses product list with stock sorting since specific endpoint might not exist
     */
    async getLowStock(): Promise<InventoryItem[]> {
        // Fetch products sorted by lowest stock first
        // We use the same endpoint logic as we did in inventory service
        // Since we are inside dashboard service which uses axiosClient (centralized), 
        // we need to adapt the call slightly if we want to call /products which is a general endpoint
        // But to keep it efficient and consolidated, implementing it here is fine.

        // Note: axiosClient baseURL is configured, so we just pass the path
        const { data } = await axiosClient.get<any>('/products', {
            params: {
                sort: 'stock',
                direction: 'asc',
                per_page: 50
            }
        })

        const products = Array.isArray(data.data) ? data.data : []

        // Filter to strictly low stock items
        return products.filter((item: any) =>
            (item.is_low_stock) ||
            (item.stock <= (item.min_stock || 5)) ||
            (item.stock === 0)
        )
    },
}
