import { getInitials, cn } from '@/lib/utils/formatters'

interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Size map — one place to change all avatar sizes
const SIZE = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

// Color map based on first letter — makes avatars distinct per user
// Same person always gets the same color (deterministic)
const COLORS = [
  'bg-red-100 text-red-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
]

function getColorForName(name: string): string {
  // Simple hash: sum of char codes modulo number of colors
  // Deterministic: same name → same color, always
  const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return COLORS[sum % COLORS.length]
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const sizeClass  = SIZE[size]
  const colorClass = getColorForName(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover flex-shrink-0',
          sizeClass,
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold flex-shrink-0',
        sizeClass,
        colorClass,
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  )
}
