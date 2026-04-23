import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { getRiders, getRiderById } from '@/lib/api/riders'
import type { RiderFilters } from '@/lib/api/riders'

export function useRiders(filters: RiderFilters) {
  return useQuery({
    queryKey: queryKeys.riders.list(filters),
    queryFn:  () => getRiders(filters),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  })
}

export function useRider(id: string) {
  return useQuery({
    queryKey: queryKeys.riders.detail(id),
    queryFn:  () => getRiderById(id),
    enabled:  Boolean(id),
    staleTime: 60 * 1000,
  })
}
