import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import {
  getUsers, getUserById, updateUser,
  deleteUser, toggleUserStatus,
} from '@/lib/api/users'
import type { UserFilters, User } from '@/types'

// ─── useUsers — paginated list with filters ───────────────────────────────────
export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn:  () => getUsers(filters),
    // placeholderData: keep showing previous page while next page loads.
    // This eliminates the loading flash when paginating — feels instant.
    // Without it: page 1 → spinner → page 2. With it: page 1 → dimmed → page 2.
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,  // 30 seconds — user lists change more often than stats
  })
}

// ─── useUser — single user detail ────────────────────────────────────────────
export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn:  () => getUserById(id),
    // enabled: false if id is empty — prevents the query from running
    // with an invalid ID. Common pattern for conditional queries.
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  })
}

// ─── useUpdateUser — mutation with optimistic cache update ────────────────────
//
// INTERVIEW QUESTION: "What is cache invalidation and why does it matter?"
//
// Answer: After you update a user, the cache still holds the OLD user data.
// If you navigate back to the user list, you'd see stale data.
// invalidateQueries marks those cache entries as stale → React Query
// automatically refetches them in the background → UI stays fresh.
//
// Pattern: mutate → on success → invalidate affected queries.
// ─────────────────────────────────────────────────────────────────────────────
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<User> }) =>
      updateUser(id, payload),

    onSuccess: (updatedUser) => {
      // 1. Update this specific user's detail cache immediately (no refetch needed)
      queryClient.setQueryData(
        queryKeys.users.detail(updatedUser.id),
        updatedUser
      )
      // 2. Invalidate the user LIST so it refetches with updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
  })
}

// ─── useDeleteUser ────────────────────────────────────────────────────────────
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      // Invalidate ALL user queries — list + any cached details
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
    },
  })
}

// ─── useToggleUserStatus ──────────────────────────────────────────────────────
export function useToggleUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: User['status'] }) =>
      toggleUserStatus(id, status),

    onSuccess: (updatedUser) => {
      // Update detail cache
      queryClient.setQueryData(
        queryKeys.users.detail(updatedUser.id),
        updatedUser
      )
      // Invalidate list (status change affects filters)
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
  })
}
