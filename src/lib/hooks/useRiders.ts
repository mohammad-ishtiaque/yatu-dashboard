import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import {
  getRiders, getRiderById,
  updateRiderStatus, blockRider, unblockRider,
} from '@/lib/api/riders'
import type { RiderFilters } from '@/lib/api/riders'
import type { Rider } from '@/types'

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

export function useUpdateRiderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Rider['status'] }) =>
      updateRiderStatus(id, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.riders.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: queryKeys.riders.lists() })
    },
  })
}

export function useBlockRider() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => blockRider(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.riders.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: queryKeys.riders.lists() })
    },
  })
}

export function useUnblockRider() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unblockRider(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.riders.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: queryKeys.riders.lists() })
    },
  })
}
