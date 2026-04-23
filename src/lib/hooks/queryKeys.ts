// ─── Query Key Factory ────────────────────────────────────────────────────────
//
// INTERVIEW QUESTION: "Why centralise query keys instead of inline strings?"
//
// Answer: Query keys are how TanStack Query identifies cached data.
// If you write ['users', 'list'] in one place and ['users', 'list', filters]
// in another, invalidating 'users' won't clear both.
//
// The factory pattern solves this:
//   queryKeys.users.all()    → ['users']           (invalidates everything user-related)
//   queryKeys.users.list(f)  → ['users', 'list', f] (specific list with filters)
//   queryKeys.users.detail(id) → ['users', 'detail', '123']
//
// When you call: queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
// It clears ALL user queries (list + detail + any future queries) automatically.
// This is the correct way to invalidate after a mutation (create/update/delete).
//
// 'as const' — TypeScript treats the array as a readonly tuple, not string[].
// This gives you autocomplete and prevents accidental mutation of query keys.
// ─────────────────────────────────────────────────────────────────────────────

import type { UserFilters } from '@/types'
import type { RiderFilters } from '@/lib/api/riders'

export const queryKeys = {
  dashboard: {
    all:    ()         => ['dashboard']                        as const,
    stats:  ()         => ['dashboard', 'stats']              as const,
    growth: (year: number) => ['dashboard', 'growth', year]   as const,
  },

  users: {
    all:    ()                   => ['users']                         as const,
    lists:  ()                   => ['users', 'list']                 as const,
    list:   (filters: UserFilters) => ['users', 'list', filters]      as const,
    detail: (id: string)         => ['users', 'detail', id]           as const,
  },

  riders: {
    all:    ()                    => ['riders']                       as const,
    lists:  ()                    => ['riders', 'list']               as const,
    list:   (f: RiderFilters)     => ['riders', 'list', f]            as const,
    detail: (id: string)          => ['riders', 'detail', id]         as const,
  },

  bookings: {
    all:    ()         => ['bookings']                         as const,
    list:   (f: unknown) => ['bookings', 'list', f]           as const,
  },

  bikes: {
    all:  () => ['bikes']                                      as const,
    list: (f: unknown) => ['bikes', 'list', f]                as const,
  },
}
