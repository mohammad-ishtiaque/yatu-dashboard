import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/formatters'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  footer?: ReactNode
}

const SIZE_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

// ─── INTERVIEW QUESTION: "How do you make a modal accessible?" ────────────────
// Answer:
// 1. role="dialog" + aria-modal="true" — tells screen readers it's a dialog
// 2. aria-labelledby pointing to the title — screen reader announces the title
// 3. Focus trap — Tab key cycles within the modal, not the page behind it
// 4. Escape key closes — standard keyboard UX expectation
// 5. Overlay click closes — mouse UX expectation
// 6. Scroll lock on body — prevents background content from scrolling
//
// A modal without these is accessible in Chrome but broken with keyboard
// and screen readers — which is an ADA/WCAG compliance issue.
// ─────────────────────────────────────────────────────────────────────────────

export function Modal({ isOpen, onClose, title, children, size = 'md', footer }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId   = `modal-title-${title.replace(/\s+/g, '-').toLowerCase()}`

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Focus the dialog when it opens
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative w-full bg-white rounded-xl shadow-2xl outline-none',
          'animate-slide-in',
          SIZE_MAP[size]
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 id={titleId} className="text-base font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg
                       text-gray-400 hover:text-gray-700 hover:bg-gray-100
                       transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 py-4
                          border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
