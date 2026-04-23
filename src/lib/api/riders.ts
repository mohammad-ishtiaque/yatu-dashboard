import { get, patch } from './client'
import type { Rider, PaginatedResponse } from '@/types'
import { mockRiders } from '@/data/mock'

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
  // ── REAL API: ──
  // return get<PaginatedResponse<Rider>>('/riders', filters as Record<string, unknown>)

  await mockDelay()

  let results = [...mockRiders]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    results = results.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q)
    )
  }

  if (filters.status && filters.status !== 'all') {
    results = results.filter(r => r.status === filters.status)
  }

  const total      = results.length
  const totalPages = Math.ceil(total / filters.limit)
  const start      = (filters.page - 1) * filters.limit
  const data       = results.slice(start, start + filters.limit)

  return { data, total, page: filters.page, limit: filters.limit, totalPages }
}

export async function getRiderById(id: string): Promise<Rider> {
  // ── REAL API: ──
  // return get<Rider>(`/riders/${id}`)

  await mockDelay(200)
  const rider = mockRiders.find(r => r.id === id)
  if (!rider) throw new Error(`Rider "${id}" not found`)
  return rider
}

export async function updateRiderStatus(id: string, status: Rider['status']): Promise<Rider> {
  return patch<Rider>(`/riders/${id}/status`, { status })
}

// suppress unused import warning for now
const _get = get
void _get
