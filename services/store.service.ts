/**
 * Store Service
 *
 * Handles all store-related API calls
 */

import api from "@/lib/api-client"
import { endpoints } from "@/lib/api-endpoints"

/**
 * Store data from API
 */
export interface ApiStore {
    id: number
    name: string
    address?: string
    is_active: boolean
    created_at?: string
    updated_at?: string
}

/**
 * Store payload for creating/updating
 */
export interface StorePayload {
    name: string
    address?: string
    is_active?: boolean
}

/**
 * Store list response
 */
export interface StoreListResponse {
    data: ApiStore[]
}

export const storeService = {
    /**
     * Get all stores
     * GET /api/stores
     */
    getAll: async (): Promise<StoreListResponse> => {
        return api.get<StoreListResponse>(endpoints.stores.list())
    },

    /**
     * Get single store by ID
     * GET /api/stores/{store}
     */
    getById: async (id: string | number): Promise<ApiStore> => {
        return api.get<ApiStore>(endpoints.stores.get(id))
    },

    /**
     * Create new store
     * POST /api/stores
     */
    create: async (data: StorePayload): Promise<ApiStore> => {
        return api.post<ApiStore>(endpoints.stores.create(), data)
    },

    /**
     * Update existing store
     * PATCH /api/stores/{store}
     */
    update: async (id: string | number, data: Partial<StorePayload>): Promise<ApiStore> => {
        return api.patch<ApiStore>(endpoints.stores.update(id), data)
    },

    /**
     * Delete store
     * DELETE /api/stores/{store}
     */
    delete: async (id: string | number): Promise<void> => {
        return api.delete(endpoints.stores.delete(id))
    },
}
