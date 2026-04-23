// Pure utility functions — no React, no side effects, easy to unit test

/**
 * Format ISO date string to human-readable
 * '2025-01-10' → 'Jan 10, 2025'
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format ISO datetime to relative time
 * '2025-01-28T14:15:00Z' → '2 hours ago'
 */
export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours   = Math.floor(diff / 3_600_000)
  const days    = Math.floor(diff / 86_400_000)

  if (minutes < 1)  return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24)   return `${hours}h ago`
  if (days < 7)     return `${days}d ago`
  return formatDate(iso)
}

/**
 * Format currency — fare, revenue
 * 45.5 → '$45.50'
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format large numbers with commas
 * 1576 → '1,576'
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

/**
 * Get initials from a full name for avatar fallback
 * 'Theodore Vasclub' → 'TV'
 * 'Amara' → 'A'
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')
}

/**
 * Truncate long strings for table cells
 * 'very long email address here' → 'very long email a...'
 */
export function truncate(str: string, maxLength = 30): string {
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str
}

/**
 * Build a cn() (classname) utility — merges Tailwind classes safely
 * Handles conditional classes without conflicts
 * e.g. cn('px-4', isActive && 'bg-red-500', 'text-sm')
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  // clsx handles conditionals, twMerge resolves Tailwind conflicts
  // e.g. cn('px-2 py-1', 'px-4') → 'py-1 px-4' (not 'px-2 py-1 px-4')
  return twMerge(clsx(inputs))
}
