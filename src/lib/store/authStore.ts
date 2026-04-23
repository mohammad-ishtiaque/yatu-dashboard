import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/types'

// ─── Shape of auth state ───────────────────────────────────────────────────────
interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean

  // Actions — functions that mutate state
  login: (token: string, user: AuthUser) => void
  logout: () => void
  updateUser: (updates: Partial<AuthUser>) => void
}

// ─── Why Zustand over Redux? ───────────────────────────────────────────────────
// Redux needs: action types, action creators, reducers, selectors, Provider.
// Zustand needs: create() + a shape. That's it.
// For auth state (1-2 fields), Redux is 10x the boilerplate with 0x the benefit.
// Use Redux when you have complex state machines with many interconnected slices.

// ─── Why persist middleware? ───────────────────────────────────────────────────
// Without persist: user refreshes page → state resets → logged out → bad UX.
// With persist: state is saved to localStorage → survives refresh → stays logged in.
// The token in localStorage is the same pattern used by every major SPA.

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => set({
        token,
        user,
        isAuthenticated: true,
      }),

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false })
        // When we add real API: cancel all pending requests here
      },

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
    }),
    {
      name: 'yetu-auth', // localStorage key
      // Only persist these fields — never persist derived/computed state
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
