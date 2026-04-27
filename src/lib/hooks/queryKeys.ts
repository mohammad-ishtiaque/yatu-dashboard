import type { UserFilters, BikeFilters } from '@/types'
import type { RiderFilters } from '@/lib/api/riders'

export const queryKeys = {
  dashboard: {
    all:    ()             => ['dashboard']                      as const,
    stats:  ()             => ['dashboard', 'stats']            as const,
    growth: (year: number) => ['dashboard', 'growth', year]     as const,
  },

  users: {
    all:    ()                     => ['users']                       as const,
    lists:  ()                     => ['users', 'list']               as const,
    list:   (filters: UserFilters) => ['users', 'list', filters]      as const,
    detail: (id: string)           => ['users', 'detail', id]         as const,
  },

  riders: {
    all:    ()                   => ['riders']                       as const,
    lists:  ()                   => ['riders', 'list']               as const,
    list:   (f: RiderFilters)    => ['riders', 'list', f]            as const,
    detail: (id: string)         => ['riders', 'detail', id]         as const,
  },

  bookings: {
    all:  ()           => ['bookings']                        as const,
    list: (f: unknown) => ['bookings', 'list', f]            as const,
  },

  bikes: {
    all:    ()                   => ['bikes']                       as const,
    lists:  ()                   => ['bikes', 'list']               as const,
    list:   (f: BikeFilters)     => ['bikes', 'list', f]            as const,
    detail: (id: string)         => ['bikes', 'detail', id]         as const,
  },

  faq: {
    all:  () => ['faq']                                       as const,
    list: () => ['faq', 'list']                              as const,
  },

  content: {
    all:     ()                     => ['content']                          as const,
    page:    (type: string)         => ['content', 'page', type]            as const,
  },
}
