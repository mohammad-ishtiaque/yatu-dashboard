import { cn } from '@/lib/utils/formatters'
import type { UserStatus, RiderStatus, BikeStatus, BookingStatus } from '@/types'

type AnyStatus = UserStatus | RiderStatus | BikeStatus | BookingStatus

// Map every possible status to a Tailwind color combo
// Adding a new status = add one entry here, component handles the rest
const STATUS_STYLES: Record<string, string> = {
  // User / Rider statuses
  active:      'bg-green-50 text-green-700 ring-1 ring-green-600/20',
  inactive:    'bg-gray-100 text-gray-600 ring-1 ring-gray-500/20',
  suspended:   'bg-red-50 text-red-700 ring-1 ring-red-600/20',
  on_trip:     'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
  // Bike statuses
  available:   'bg-green-50 text-green-700 ring-1 ring-green-600/20',
  in_use:      'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
  maintenance: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
  // Booking statuses
  pending:     'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
  confirmed:   'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
  in_progress: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20',
  completed:   'bg-green-50 text-green-700 ring-1 ring-green-600/20',
  cancelled:   'bg-gray-100 text-gray-600 ring-1 ring-gray-500/20',
}

const STATUS_LABELS: Record<string, string> = {
  on_trip:     'On Trip',
  in_use:      'In Use',
  in_progress: 'In Progress',
}

interface BadgeProps {
  status: AnyStatus
  className?: string
}

export function Badge({ status, className }: BadgeProps) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'
  const label = STATUS_LABELS[status] ?? status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      style,
      className
    )}>
      {label}
    </span>
  )
}
