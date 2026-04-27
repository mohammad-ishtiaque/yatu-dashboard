import { get, post, put, patch, del } from './client'
import type { Bike, BikeFilters, PaginatedResponse } from '@/types'
import { mockBikes } from '@/data/mock'

let bikeStore = [...mockBikes]

function mockDelay(ms = 350): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

export async function getBikes(filters: BikeFilters): Promise<PaginatedResponse<Bike>> {
  // ── REAL API: return get<PaginatedResponse<Bike>>('/bikes', filters as Record<string, unknown>)
  await mockDelay()

  let results = [...bikeStore]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    results = results.filter(b =>
      b.brand.toLowerCase().includes(q) ||
      b.model.toLowerCase().includes(q) ||
      b.plateNumber.toLowerCase().includes(q) ||
      b.assignedRider?.name.toLowerCase().includes(q)
    )
  }

  if (filters.status && filters.status !== 'all') {
    results = results.filter(b => b.status === filters.status)
  }

  const total      = results.length
  const totalPages = Math.max(1, Math.ceil(total / filters.limit))
  const start      = (filters.page - 1) * filters.limit
  const data       = results.slice(start, start + filters.limit)

  return { data, total, page: filters.page, limit: filters.limit, totalPages }
}

export async function getBikeById(id: string): Promise<Bike> {
  // ── REAL API: return get<Bike>(`/bikes/${id}`)
  await mockDelay(200)
  const bike = bikeStore.find(b => b.id === id)
  if (!bike) throw new Error(`Bike "${id}" not found`)
  return bike
}

export async function createBike(payload: Omit<Bike, 'id'>): Promise<Bike> {
  // ── REAL API: return post<Bike>('/bikes', payload)
  await mockDelay(200)
  const newBike: Bike = { id: `b${Date.now()}`, ...payload }
  bikeStore.push(newBike)
  return newBike
}

export async function updateBike(id: string, payload: Partial<Omit<Bike, 'id'>>): Promise<Bike> {
  // ── REAL API: return put<Bike>(`/bikes/${id}`, payload)
  await mockDelay(200)
  const idx = bikeStore.findIndex(b => b.id === id)
  if (idx === -1) throw new Error(`Bike "${id}" not found`)
  bikeStore[idx] = { ...bikeStore[idx], ...payload }
  return bikeStore[idx]
}

export async function deleteBike(id: string): Promise<void> {
  // ── REAL API: return del<void>(`/bikes/${id}`)
  await mockDelay(200)
  bikeStore = bikeStore.filter(b => b.id !== id)
}

export async function assignRiderToBike(
  bikeId: string,
  rider: { id: string; name: string; avatarUrl?: string } | null
): Promise<Bike> {
  // ── REAL API: return patch<Bike>(`/bikes/${bikeId}/assign`, { riderId: rider?.id ?? null })
  await mockDelay(200)
  const idx = bikeStore.findIndex(b => b.id === bikeId)
  if (idx === -1) throw new Error(`Bike "${bikeId}" not found`)
  bikeStore[idx] = { ...bikeStore[idx], assignedRider: rider }
  return bikeStore[idx]
}

// suppress unused import warnings
const _get = get; const _post = post; const _put = put; const _patch = patch; const _del = del
void _get; void _post; void _put; void _patch; void _del
