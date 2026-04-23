import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/formatters'

interface PaginationProps {
  page: number          // current page (1-indexed)
  totalPages: number
  total: number         // total record count
  limit: number         // records per page
  onPageChange: (page: number) => void
}

// ─── Page number generation ────────────────────────────────────────────────────
// For large page counts, show ellipsis: 1 ... 4 5 6 ... 20
// For small counts: show all pages
function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end   = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('...')
  pages.push(total)

  return pages
}

export function Pagination({
  page, totalPages, total, limit, onPageChange
}: PaginationProps) {
  if (totalPages <= 1) return null

  const start = (page - 1) * limit + 1
  const end   = Math.min(page * limit, total)
  const pages = getPageNumbers(page, totalPages)

  return (
    <div className="flex items-center justify-between px-5 py-3.5
                    border-t border-gray-100 bg-gray-50/50">
      {/* Record count label */}
      <p className="text-xs text-gray-500">
        Showing <span className="font-medium text-gray-700">{start}–{end}</span>{' '}
        of <span className="font-medium text-gray-700">{total}</span> results
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500
                     hover:bg-white hover:text-gray-900 hover:shadow-sm
                     disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`}
                  className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium transition-all',
                p === page
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm'
              )}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500
                     hover:bg-white hover:text-gray-900 hover:shadow-sm
                     disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
