// ─── User Types ──────────────────────────────────────────────────────────────
// String union > enum for status fields.
// Why: enums compile to JS objects with reverse mapping (extra bytes + confusion).
// String unions are purely a compile-time check — zero runtime cost.

export type UserStatus = 'active' | 'inactive' | 'suspended'
export type UserRole   = 'user' | 'rider' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  status: UserStatus
  role: UserRole
  joinedAt: string   // ISO 8601 — always store dates as strings from API
  avatarUrl?: string // optional — show initials fallback when absent
}

// ─── Rider Types ─────────────────────────────────────────────────────────────
export type RiderStatus = 'active' | 'inactive' | 'on_trip'

export interface Rider {
  id: string
  name: string
  email: string
  phone: string
  status: RiderStatus
  totalTrips: number
  rating: number
  joinedAt: string
  avatarUrl?: string
}

// ─── Bike Types ───────────────────────────────────────────────────────────────
export type BikeStatus = 'available' | 'in_use' | 'maintenance'

export interface Bike {
  id: string
  model: string
  plateNumber: string
  status: BikeStatus
  location: string
  lastServiceDate: string
}

// ─── Booking Types ────────────────────────────────────────────────────────────
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export interface Booking {
  id: string
  userId: string
  riderId: string
  bikeId: string
  status: BookingStatus
  pickupLocation: string
  dropoffLocation: string
  fare: number
  createdAt: string
  completedAt?: string
}

// ─── Dashboard Types ──────────────────────────────────────────────────────────
export interface DashboardStats {
  totalRiders: number
  totalUsers: number
  totalBikes: number
  activeUsers: number
  activeDrivers: number
}

export interface GrowthDataPoint {
  month: string
  users: number
  riders: number
}

// ─── API Response Wrapper ─────────────────────────────────────────────────────
// Every paginated list from the API is wrapped in this shape.
// Generic type T means: PaginatedResponse<User>, PaginatedResponse<Rider>, etc.
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  code: string
  statusCode: number
}

// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: UserRole
    avatarUrl?: string
  }
}

// ─── Filter/Query Types ───────────────────────────────────────────────────────
export interface PaginationParams {
  page: number
  limit: number
}

export interface UserFilters extends PaginationParams {
  search?: string
  status?: UserStatus | 'all'
  role?: UserRole | 'all'
}
