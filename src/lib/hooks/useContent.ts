import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { getContentPage, publishContentPage } from '@/lib/api/content'
import type { ContentType } from '@/types'

export function useContentPage(type: ContentType) {
  return useQuery({
    queryKey: queryKeys.content.page(type),
    queryFn:  () => getContentPage(type),
    staleTime: 10 * 60 * 1000,
  })
}

export function usePublishContent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      type,
      payload,
    }: {
      type: ContentType
      payload: { title: string; content: string }
    }) => publishContentPage(type, payload),
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.page(type) })
    },
  })
}
