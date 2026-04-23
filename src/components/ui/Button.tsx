import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/formatters'

// ─── Variant + Size maps ──────────────────────────────────────────────────────
// Defining styles as a map (not inline conditionals) keeps the JSX clean
// and makes adding new variants a one-line change.

const VARIANTS = {
  primary:   'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/30',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500/20',
  outline:   'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500/20',
  danger:    'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500/20 border border-red-200',
  ghost:     'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500/20',
}

const SIZES = {
  sm:  'h-8  px-3 text-xs  gap-1.5',
  md:  'h-9  px-4 text-sm  gap-2',
  lg:  'h-11 px-6 text-sm  gap-2',
  icon:'h-9  w-9  text-sm',
}

// ─── Props ────────────────────────────────────────────────────────────────────
// Extends native ButtonHTMLAttributes so all HTML button props work:
// onClick, type, disabled, aria-*, etc.
// This is the correct pattern for component library primitives.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

// ─── forwardRef ───────────────────────────────────────────────────────────────
// INTERVIEW QUESTION: "Why use forwardRef on a Button component?"
// Answer: When you put a Button inside a Tooltip or Popover (from libraries like
// Radix UI), those components attach a ref to the Button to measure its position.
// Without forwardRef, the ref is silently dropped — no tooltip appears, no error.
// forwardRef passes the ref through to the underlying <button> element.
// Always use forwardRef on primitive UI components. It's cheap and avoids pain.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    className,
    disabled,
    children,
    ...rest
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles applied to every button
          'inline-flex items-center justify-center font-medium rounded-lg',
          'transition-all duration-150 focus:outline-none focus:ring-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Variant and size
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...rest}
      >
        {isLoading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : leftIcon
        }
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
