import { get, post, patch, del } from './client'
import type { User, PaginatedResponse, UserFilters } from '@/types'
import { mockUsers } from '@/data/mock'

function mockDelay(ms = 400): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

// ─── List users with pagination + filters ─────────────────────────────────────
export async function getUsers(filters: UserFilters): Promise<PaginatedResponse<User>> {
  // ── REAL API: ──
  // return get<PaginatedResponse<User>>('/users', filters as Record<string, unknown>)

  // ── MOCK with client-side filter/paginate: ──
  await mockDelay()

  let results = [...mockUsers]

  // Apply search filter
  if (filters.search) {
    const q = filters.search.toLowerCase()
    results = results.filter(u =>
      u.name.toLowerCase().includes(q)  ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q)
    )
  }

  // Apply status filter
  if (filters.status && filters.status !== 'all') {
    results = results.filter(u => u.status === filters.status)
  }

  // Apply role filter
  if (filters.role && filters.role !== 'all') {
    results = results.filter(u => u.role === filters.role)
  }

  // Paginate
  const total      = results.length
  const totalPages = Math.ceil(total / filters.limit)
  const start      = (filters.page - 1) * filters.limit
  const data       = results.slice(start, start + filters.limit)

  return { data, total, page: filters.page, limit: filters.limit, totalPages }
}

// ─── Get single user by ID ────────────────────────────────────────────────────
export async function getUserById(id: string): Promise<User> {
  // ── REAL API: ──
  // return get<User>(`/users/${id}`)

  // ── MOCK: ──
  await mockDelay(200)
  const user = mockUsers.find(u => u.id === id)
  if (!user) throw new Error(`User with id "${id}" not found`)
  return user
}

// ─── Create user ──────────────────────────────────────────────────────────────
export async function createUser(payload: Omit<User, 'id' | 'joinedAt'>): Promise<User> {
  // ── REAL API: ──
  return post<User>('/users', payload)
}

// ─── Update user ──────────────────────────────────────────────────────────────
export async function updateUser(id: string, payload: Partial<User>): Promise<User> {
  // ── REAL API: ──
  return patch<User>(`/users/${id}`, payload)
}

// ─── Delete user ──────────────────────────────────────────────────────────────
export async function deleteUser(id: string): Promise<void> {
  // ── REAL API: ──
  return del<void>(`/users/${id}`)
}

// ─── Toggle user status ───────────────────────────────────────────────────────
// This is a common dashboard action — a dedicated endpoint is better than
// a generic PATCH because it enforces the allowed status transitions on the server.
export async function toggleUserStatus(id: string, status: User['status']): Promise<User> {
  // ── REAL API: ──
  return patch<User>(`/users/${id}/status`, { status })
}
