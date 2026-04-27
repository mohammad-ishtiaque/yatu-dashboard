import { get, put } from './client'
import type { ContentPage, ContentType } from '@/types'
import { mockContentPages } from '@/data/mock'

let contentStore = [...mockContentPages]

function mockDelay(ms = 300): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

export async function getContentPage(type: ContentType): Promise<ContentPage | null> {
  // ── REAL API: return get<ContentPage>(`/content/${type}`)
  await mockDelay()
  return contentStore.find(p => p.type === type) ?? null
}

export async function publishContentPage(
  type: ContentType,
  payload: { title: string; content: string }
): Promise<ContentPage> {
  // ── REAL API: return put<ContentPage>(`/content/${type}`, payload)
  await mockDelay(200)
  const now = new Date().toISOString()
  const existing = contentStore.find(p => p.type === type)
  if (existing) {
    const updated = { ...existing, ...payload, publishedAt: now, updatedAt: now }
    contentStore = contentStore.map(p => p.type === type ? updated : p)
    return updated
  }
  const newPage: ContentPage = {
    id: `cp${Date.now()}`,
    type,
    ...payload,
    publishedAt: now,
    updatedAt: now,
  }
  contentStore.push(newPage)
  return newPage
}

// suppress unused import warnings
const _get = get; const _put = put
void _get; void _put
