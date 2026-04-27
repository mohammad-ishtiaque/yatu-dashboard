export type UserStatus = 'active' | 'inactive' | 'suspended'
export type UserRole   = 'user' | 'rider' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  status: UserStatus
  role: UserRole
  joinedAt: string
  avatarUrl?: string
}

// ─── Rider Types ─────────────────────────────────────────────────────────────
export type RiderStatus = 'active' | 'inactive' | 'on_trip' | 'suspended'

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
  vehicleType?: string
  licenseNumber?: string
  address?: string
}

// ─── Bike Types ───────────────────────────────────────────────────────────────
export type BikeStatus = 'available' | 'in_use' | 'maintenance'

export interface Bike {
  id: string
  brand: string
  model: string
  plateNumber: string
  color: string
  year?: number
  status: BikeStatus
  location: string
  lastServiceDate: string
  imageUrl?: string
  assignedRider?: { id: string; name: string; avatarUrl?: string } | null
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

// ─── FAQ Types ────────────────────────────────────────────────────────────────
export interface FAQ {
  id: string
  question: string
  answer: string
  createdAt: string
  updatedAt: string
}

// ─── Content Page Types (Privacy Policy, Terms & Conditions) ─────────────────
export type ContentType = 'privacy_policy' | 'terms_and_conditions'

export interface ContentPage {
  id: string
  type: ContentType
  title: string
  content: string  // HTML content from rich text editor
  publishedAt?: string
  updatedAt: string
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

// ─── Notification Types ───────────────────────────────────────────────────────
export type NotificationType =
  | 'new_user'
  | 'new_rider'
  | 'booking_created'
  | 'booking_completed'
  | 'booking_cancelled'
  | 'rider_suspended'
  | 'bike_maintenance'
  | 'support_message'
  | 'content_published'
  | 'low_stock'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
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

export interface BikeFilters extends PaginationParams {
  search?: string
  status?: BikeStatus | 'all'
}
