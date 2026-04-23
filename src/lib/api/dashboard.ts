import { get } from './client'
import type { DashboardStats, GrowthDataPoint } from '@/types'
import { mockDashboardStats, mockGrowthData } from '@/data/mock'

// ─── PATTERN: Mock-first API functions ───────────────────────────────────────
//
// Every function has two modes:
//   1. MOCK mode (current): returns mock data after a simulated delay
//   2. REAL mode (future): one comment swap — no component changes needed
//
// This pattern is called the "Repository Pattern" or "Data Access Layer".
// The hook doesn't know or care whether data came from mock or real API.
// That's the whole point — decoupled layers.
//
// To switch to real API: uncomment the real lines, delete the mock lines.
// The component and hook code stays identical.
// ─────────────────────────────────────────────────────────────────────────────

// Simulates realistic network delay in development
function mockDelay(ms = 400): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

// ─── Get dashboard statistics ─────────────────────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  // ── REAL API (uncomment when backend is ready): ──
  // return get<DashboardStats>('/dashboard/stats')

  // ── MOCK (remove when backend is ready): ──
  await mockDelay()
  return mockDashboardStats
}

// ─── Get user growth data for chart ──────────────────────────────────────────
export async function getGrowthData(year: number): Promise<GrowthDataPoint[]> {
  // ── REAL API: ──
  // return get<GrowthDataPoint[]>('/dashboard/growth', { year })

  // ── MOCK: ──
  await mockDelay(300)
  console.log(`Fetching growth data for year: ${year}`) // will be used
  return mockGrowthData
}
