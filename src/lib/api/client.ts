import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { logger } from '@/lib/utils/logger'

// ─── Why a custom Axios instance instead of fetch? ────────────────────────────
//
// fetch() is fine for simple calls. But at scale you need:
//   1. Auth header injected automatically on every request
//   2. Global 401 handling (redirect to login without touching each call)
//   3. Structured error objects (not raw Response objects)
//   4. Request/response logging for debugging
//   5. Timeout — fetch() hangs forever by default
//   6. Request cancellation via AbortController (handled by TanStack Query)
//
// All of this would be copy-pasted into every fetch() call.
// Axios interceptors centralise it in one place.
//
// INTERVIEW QUESTION: "Why interceptors instead of a wrapper function?"
// Answer: A wrapper function only covers calls you write yourself.
// An interceptor covers ALL calls including third-party code that uses
// the same instance. It's also easier to compose — add/remove behaviours
// without touching call sites.
// ─────────────────────────────────────────────────────────────────────────────

// ─── API Error shape ──────────────────────────────────────────────────────────
// We define our own error class so callers can do:
//   catch (err) { if (err instanceof ApiError) { ... } }
// instead of checking raw HTTP status codes everywhere.
export class ApiError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly originalError?: AxiosError
  ) {
    super(message)
    this.name = 'ApiError'
    // Preserve the prototype chain — required when extending built-in classes
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

// ─── Create the Axios instance ────────────────────────────────────────────────
export const apiClient = axios.create({
  // import.meta.env.VITE_API_URL is replaced at build time by Vite
  // In dev: reads from .env.local
  // In prod: reads from the environment variable set during deployment
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',

  timeout: 15_000, // 15 seconds — fail fast rather than hang

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ─── REQUEST Interceptor ──────────────────────────────────────────────────────
// Runs before every request is sent.
// Responsibilities: attach auth token, log outgoing request.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Read token from localStorage directly here — NOT from Zustand store.
    // Why? Zustand's getState() works fine, but creates a dependency between
    // the HTTP layer and the state layer. Reading from localStorage keeps
    // the API client stateless and independently testable.
    const raw = localStorage.getItem('yetu-auth')
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { state?: { token?: string } }
        const token = parsed?.state?.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch {
        // Malformed localStorage — ignore, will fail auth on server
      }
    }

    logger.debug('→ API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
    })

    return config
  },
  (error: AxiosError) => {
    logger.error('Request setup failed', { error: error.message })
    return Promise.reject(error)
  }
)

// ─── RESPONSE Interceptor ─────────────────────────────────────────────────────
// Runs after every response (success or error).
// Responsibilities: log response, transform errors into ApiError instances,
// handle 401 (token expired) globally.
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.debug('← API Response', {
      status: response.status,
      url: response.config.url,
    })
    // Return response as-is — individual API functions extract .data
    return response
  },
  (error: AxiosError) => {
    const status = error.response?.status ?? 0
    const data   = error.response?.data as Record<string, unknown> | undefined

    logger.error('← API Error', {
      status,
      url: error.config?.url,
      message: error.message,
      data,
    })

    // ── 401: Token expired or invalid ────────────────────────────────────────
    // Clear auth state and redirect to login.
    // We do this here so NO individual page needs to handle it.
    if (status === 401) {
      localStorage.removeItem('yetu-auth')
      // Use window.location instead of React Router here because this
      // interceptor lives outside the React tree — no access to hooks.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // ── Transform into ApiError ───────────────────────────────────────────────
    // All API errors now have a consistent shape regardless of backend format.
    const message = (
      (data?.message as string) ||
      (data?.error   as string) ||
      error.message             ||
      'An unexpected error occurred'
    )

    const code = (data?.code as string) || `HTTP_${status}`

    return Promise.reject(new ApiError(message, status, code, error))
  }
)

// ─── Convenience wrappers ─────────────────────────────────────────────────────
// These let API functions look like:
//   const user = await get<User>('/users/1')
// instead of:
//   const { data } = await apiClient.get<User>('/users/1')
//
// The generic <T> tells TypeScript what shape the response will be.
// This propagates type safety all the way from API → hook → component.

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await apiClient.get<T>(url, { params })
  return data
}

export async function post<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await apiClient.post<T>(url, body)
  return data
}

export async function put<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await apiClient.put<T>(url, body)
  return data
}

export async function patch<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await apiClient.patch<T>(url, body)
  return data
}

export async function del<T>(url: string): Promise<T> {
  const { data } = await apiClient.delete<T>(url)
  return data
}
