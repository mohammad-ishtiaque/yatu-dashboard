import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { getDashboardStats, getGrowthData } from '@/lib/api/dashboard'
import type { DashboardStats, GrowthDataPoint } from '@/types'

// ─── useDashboardStats ────────────────────────────────────────────────────────
//
// This hook is the ONLY thing a component needs to get dashboard stats.
// It handles: loading, error, caching, background refetch, staleTime.
//
// INTERVIEW QUESTION: "What does staleTime do?"
// Answer: For staleTime ms after fetching, React Query serves from cache
// without making a network request. After staleTime, the cache is "stale"
// and React Query refetches in the background while still showing the cached
// data. The component never shows a loading spinner for stale-but-cached data.
//
// For dashboard stats: 2 minutes is reasonable — they don't change per-second.
// For a live driver map: you'd want staleTime: 0 (always refetch).
// ─────────────────────────────────────────────────────────────────────────────
export function useDashboardStats() {
  return useQuery<DashboardStats, Error>({
    queryKey: queryKeys.dashboard.stats(),
    queryFn:  getDashboardStats,
    staleTime: 2 * 60 * 1000,   // 2 minutes
  })
}

// ─── useGrowthData ────────────────────────────────────────────────────────────
// Year-parameterised — changing the year fetches and caches separately.
// User switches from 2024 → 2025 → back to 2024: third switch is instant
// from cache, no network request.
export function useGrowthData(year: number) {
  return useQuery<GrowthDataPoint[], Error>({
    queryKey: queryKeys.dashboard.growth(year),
    queryFn:  () => getGrowthData(year),
    staleTime: 5 * 60 * 1000,   // 5 minutes — historical data rarely changes
  })
}
