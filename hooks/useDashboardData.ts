"use client"

import { useState, useEffect } from 'react'
import { dashboardService } from '@/services/dashboard.service'
import type {
    DashboardKPIs,
    SalesTrend,
    OrdersByChannel,
    PaymentMethods,
    TopProducts,
    InventoryHealth,
    RecentActivity,
    DateRangeParams,
} from '@/types/dashboard'

/**
 * Custom hook to fetch all dashboard data
 */
export function useDashboardData(dateParams?: DateRangeParams) {
    const [kpis, setKpis] = useState<DashboardKPIs | null>(null)
    const [salesTrend, setSalesTrend] = useState<SalesTrend | null>(null)
    const [ordersByChannel, setOrdersByChannel] = useState<OrdersByChannel | null>(null)
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethods | null>(null)
    const [topProducts, setTopProducts] = useState<TopProducts | null>(null)
    const [inventoryHealth, setInventoryHealth] = useState<InventoryHealth | null>(null)
    const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                setLoading(true)
                setError(null)

                // Fetch all dashboard data in parallel
                const [
                    kpisData,
                    salesData,
                    ordersData,
                    paymentsData,
                    productsData,
                    inventoryData,
                    activityData,
                ] = await Promise.all([
                    dashboardService.getKPIs(dateParams),
                    dashboardService.getSalesTrend(dateParams),
                    dashboardService.getOrdersByChannel(dateParams),
                    dashboardService.getPaymentMethods(dateParams),
                    dashboardService.getTopProducts({ ...dateParams, limit: 5 }),
                    dashboardService.getInventoryHealth(),
                    dashboardService.getRecentActivity({ limit: 4 }),
                ])

                setKpis(kpisData)
                setSalesTrend(salesData)
                setOrdersByChannel(ordersData)
                setPaymentMethods(paymentsData)
                setTopProducts(productsData)
                setInventoryHealth(inventoryData)
                setRecentActivity(activityData)
            } catch (err) {
                console.error('Error fetching dashboard data:', err)

                // Provide more specific error messages
                let errorMessage = 'Failed to load dashboard data'

                if (err instanceof Error) {
                    if (err.message.includes('timeout')) {
                        errorMessage = 'Request timed out. The server is taking too long to respond. Please try again.'
                    } else if (err.message.includes('Network Error') || err.message.includes('Unable to connect')) {
                        errorMessage = 'Cannot connect to server. Please check your internet connection or contact support.'
                    }
                }

                setError(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [dateParams?.start_date, dateParams?.end_date])

    return {
        kpis,
        salesTrend,
        ordersByChannel,
        paymentMethods,
        topProducts,
        inventoryHealth,
        recentActivity,
        loading,
        error,
    }
}
