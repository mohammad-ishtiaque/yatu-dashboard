import { get, post, put, del } from './client'
import type { FAQ } from '@/types'
import { mockFaqs } from '@/data/mock'

let faqStore = [...mockFaqs]

function mockDelay(ms = 300): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

export async function getFaqs(): Promise<FAQ[]> {
  // ── REAL API: return get<FAQ[]>('/faqs')
  await mockDelay()
  return [...faqStore]
}

export async function createFaq(payload: Pick<FAQ, 'question' | 'answer'>): Promise<FAQ> {
  // ── REAL API: return post<FAQ>('/faqs', payload)
  await mockDelay(200)
  const now = new Date().toISOString().split('T')[0]
  const newFaq: FAQ = {
    id: `faq${Date.now()}`,
    question: payload.question,
    answer: payload.answer,
    createdAt: now,
    updatedAt: now,
  }
  faqStore.push(newFaq)
  return newFaq
}

export async function updateFaq(id: string, payload: Pick<FAQ, 'question' | 'answer'>): Promise<FAQ> {
  // ── REAL API: return put<FAQ>(`/faqs/${id}`, payload)
  await mockDelay(200)
  const idx = faqStore.findIndex(f => f.id === id)
  if (idx === -1) throw new Error(`FAQ "${id}" not found`)
  const updated = { ...faqStore[idx], ...payload, updatedAt: new Date().toISOString().split('T')[0] }
  faqStore[idx] = updated
  return updated
}

export async function deleteFaq(id: string): Promise<void> {
  // ── REAL API: return del<void>(`/faqs/${id}`)
  await mockDelay(200)
  faqStore = faqStore.filter(f => f.id !== id)
}

// suppress unused import warnings
const _get = get; const _post = post; const _put = put; const _del = del
void _get; void _post; void _put; void _del
