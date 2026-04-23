import type { LucideIcon } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils/formatters'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  iconBgColor: string   // e.g. 'bg-orange-100'
  iconColor: string     // e.g. 'text-orange-500'
  trend?: {
    value: number       // percentage change
    direction: 'up' | 'down'
  }
  isLoading?: boolean
}

// Skeleton — shown while data is fetching
// Matches the exact layout of the real card so there's no layout shift
function StatCardSkeleton() {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="skeleton w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-7 w-16" />
      </div>
    </div>
  )
}

export function StatCard({
  label, value, icon: Icon,
  iconBgColor, iconColor,
  trend, isLoading,
}: StatCardProps) {
  if (isLoading) return <StatCardSkeleton />

  return (
    <div className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow duration-200 animate-slide-in">
      {/* Icon container */}
      <div className={cn(
        'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
        iconBgColor
      )}>
        <Icon className={cn('w-5 h-5', iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900">
          {formatNumber(value)}
        </p>
        {trend && (
          <p className={cn(
            'text-xs font-medium mt-0.5',
            trend.direction === 'up' ? 'text-green-600' : 'text-red-500'
          )}>
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}% this month
          </p>
        )}
      </div>
    </div>
  )
}
