import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import {
  getBikes, getBikeById, createBike,
  updateBike, deleteBike, assignRiderToBike,
} from '@/lib/api/bikes'
import type { Bike, BikeFilters } from '@/types'

export function useBikes(filters: BikeFilters) {
  return useQuery({
    queryKey: queryKeys.bikes.list(filters),
    queryFn:  () => getBikes(filters),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  })
}

export function useBike(id: string) {
  return useQuery({
    queryKey: queryKeys.bikes.detail(id),
    queryFn:  () => getBikeById(id),
    enabled:  Boolean(id),
    staleTime: 60 * 1000,
  })
}

export function useCreateBike() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Omit<Bike, 'id'>) => createBike(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bikes.all() })
    },
  })
}

export function useUpdateBike() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Omit<Bike, 'id'>> }) =>
      updateBike(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.bikes.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: queryKeys.bikes.lists() })
    },
  })
}

export function useDeleteBike() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bikes.all() })
    },
  })
}

export function useAssignRider() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      bikeId,
      rider,
    }: {
      bikeId: string
      rider: { id: string; name: string; avatarUrl?: string } | null
    }) => assignRiderToBike(bikeId, rider),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.bikes.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: queryKeys.bikes.lists() })
    },
  })
}
