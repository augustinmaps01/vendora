"use client"

import { useState, useEffect } from 'react'
import { dashboardService } from '@/services/dashboard.service'
import { db } from '@/lib/db'
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

const CACHE_KEY = 'dashboard-data'

/**
 * Custom hook to fetch all dashboard data with offline support
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
    const [isStale, setIsStale] = useState(false)
    const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                setLoading(true)
                setError(null)

                // Load from IndexedDB cache first (instant)
                const cacheKey = dateParams?.start_date
                    ? `${CACHE_KEY}-${dateParams.start_date}-${dateParams.end_date}`
                    : CACHE_KEY

                try {
                    const cached = await db.cachedData.get(cacheKey)
                    if (cached) {
                        const data = JSON.parse(cached.data)
                        if (data.kpis) setKpis(data.kpis)
                        if (data.salesTrend) setSalesTrend(data.salesTrend)
                        if (data.ordersByChannel) setOrdersByChannel(data.ordersByChannel)
                        if (data.paymentMethods) setPaymentMethods(data.paymentMethods)
                        if (data.topProducts) setTopProducts(data.topProducts)
                        if (data.inventoryHealth) setInventoryHealth(data.inventoryHealth)
                        if (data.recentActivity) setRecentActivity(data.recentActivity)
                        setLastSyncedAt(cached.lastSyncedAt)
                        setLoading(false)

                        // Check if stale (> 5 minutes)
                        const ageMs = Date.now() - new Date(cached.lastSyncedAt).getTime()
                        setIsStale(ageMs > 5 * 60 * 1000)
                    }
                } catch {
                    // IndexedDB may not be available
                }

                // Fetch all dashboard data in parallel from API
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
                setIsStale(false)
                setLastSyncedAt(new Date())

                // Cache to IndexedDB
                try {
                    await db.cachedData.put({
                        key: cacheKey,
                        data: JSON.stringify({
                            kpis: kpisData,
                            salesTrend: salesData,
                            ordersByChannel: ordersData,
                            paymentMethods: paymentsData,
                            topProducts: productsData,
                            inventoryHealth: inventoryData,
                            recentActivity: activityData,
                        }),
                        lastSyncedAt: new Date(),
                    })
                } catch {
                    // Cache failure is non-critical
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err)

                // Only show error if we have no cached data
                if (!kpis) {
                    let errorMessage = 'Failed to load dashboard data'
                    if (err instanceof Error) {
                        if (err.message.includes('timeout')) {
                            errorMessage = 'Request timed out. Please try again.'
                        } else if (err.message.includes('Network Error') || err.message.includes('Unable to connect') || (err as any).isOffline) {
                            errorMessage = 'Working offline. Showing cached data.'
                        }
                    }
                    setError(errorMessage)
                }
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
        isStale,
        lastSyncedAt,
    }
}
