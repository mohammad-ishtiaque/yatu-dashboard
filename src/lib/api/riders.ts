import { get, patch } from './client'
import type { Rider, PaginatedResponse } from '@/types'
import { mockRiders } from '@/data/mock'

let riderStore = [...mockRiders]

function mockDelay(ms = 400): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

export interface RiderFilters {
  page: number
  limit: number
  search?: string
  status?: Rider['status'] | 'all'
}

export async function getRiders(filters: RiderFilters): Promise<PaginatedResponse<Rider>> {
  // ── REAL API: return get<PaginatedResponse<Rider>>('/riders', filters as Record<string, unknown>)
  await mockDelay()

  let results = [...riderStore]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    results = results.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(q)
    )
  }

  if (filters.status && filters.status !== 'all') {
    results = results.filter(r => r.status === filters.status)
  }

  const total      = results.length
  const totalPages = Math.max(1, Math.ceil(total / filters.limit))
  const start      = (filters.page - 1) * filters.limit
  const data       = results.slice(start, start + filters.limit)

  return { data, total, page: filters.page, limit: filters.limit, totalPages }
}

export async function getRiderById(id: string): Promise<Rider> {
  // ── REAL API: return get<Rider>(`/riders/${id}`)
  await mockDelay(200)
  const rider = riderStore.find(r => r.id === id)
  if (!rider) throw new Error(`Rider "${id}" not found`)
  return rider
}

export async function updateRiderStatus(id: string, status: Rider['status']): Promise<Rider> {
  // ── REAL API: return patch<Rider>(`/riders/${id}/status`, { status })
  await mockDelay(200)
  const idx = riderStore.findIndex(r => r.id === id)
  if (idx === -1) throw new Error(`Rider "${id}" not found`)
  riderStore[idx] = { ...riderStore[idx], status }
  return riderStore[idx]
}

export async function blockRider(id: string): Promise<Rider> {
  return updateRiderStatus(id, 'suspended')
}

export async function unblockRider(id: string): Promise<Rider> {
  return updateRiderStatus(id, 'active')
}

// suppress unused import warning
const _get = get; const _patch = patch
void _get; void _patch
