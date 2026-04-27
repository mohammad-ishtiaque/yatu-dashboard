import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { getFaqs, createFaq, updateFaq, deleteFaq } from '@/lib/api/faq'
import type { FAQ } from '@/types'

export function useFaqs() {
  return useQuery({
    queryKey: queryKeys.faq.list(),
    queryFn:  getFaqs,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateFaq() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Pick<FAQ, 'question' | 'answer'>) => createFaq(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faq.all() })
    },
  })
}

export function useUpdateFaq() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Pick<FAQ, 'question' | 'answer'> }) =>
      updateFaq(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faq.all() })
    },
  })
}

export function useDeleteFaq() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faq.all() })
    },
  })
}
