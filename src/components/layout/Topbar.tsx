import {
  Bell, Search, X, CheckCheck,
  UserPlus, UserCheck, Calendar, CheckCircle, XCircle,
  Ban, Wrench, MessageSquare, FileText, AlertTriangle,
} from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import { useNotificationStore } from '@/lib/store/notificationStore'
import { Avatar } from '@/components/ui/Avatar'
import { NAVIGATION } from '@/constants/routes'
import { cn } from '@/lib/utils/formatters'
import type { Notification, NotificationType } from '@/types'

function usePageTitle(): string {
  const { pathname } = useLocation()
  const allItems = NAVIGATION.flatMap(g => g.items)
  const match    = allItems.find(item => item.path === pathname)
  return match?.label ?? 'Dashboard'
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs  < 24) return `${hrs}h ago`
  const ds = Math.floor(hrs / 24)
  if (ds   < 7)  return `${ds}d ago`
  return new Date(iso).toLocaleDateString()
}

const TYPE_CONFIG: Record<NotificationType, { icon: LucideIcon; color: string; bg: string }> = {
  new_user:          { icon: UserPlus,      color: 'text-green-600',  bg: 'bg-green-50'  },
  new_rider:         { icon: UserCheck,     color: 'text-blue-600',   bg: 'bg-blue-50'   },
  booking_created:   { icon: Calendar,      color: 'text-blue-600',   bg: 'bg-blue-50'   },
  booking_completed: { icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-50'  },
  booking_cancelled: { icon: XCircle,       color: 'text-red-600',    bg: 'bg-red-50'    },
  rider_suspended:   { icon: Ban,           color: 'text-orange-600', bg: 'bg-orange-50' },
  bike_maintenance:  { icon: Wrench,        color: 'text-yellow-600', bg: 'bg-yellow-50' },
  support_message:   { icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
  content_published: { icon: FileText,      color: 'text-gray-600',   bg: 'bg-gray-100'  },
  low_stock:         { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
}

function NotificationItem({ n, onRead }: { n: Notification; onRead: (id: string) => void }) {
  const { icon: Icon, color, bg } = TYPE_CONFIG[n.type]
  return (
    <button
      type="button"
      onClick={() => onRead(n.id)}
      className={cn(
        'w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors',
        !n.read && 'bg-red-50/40'
      )}
    >
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', bg)}>
        <Icon className={cn('w-4 h-4', color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm leading-snug', n.read ? 'text-gray-700' : 'text-gray-900 font-medium')}>
            {n.title}
          </p>
          {!n.read && (
            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1" />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
        <p className="text-[11px] text-gray-400 mt-1">{relativeTime(n.timestamp)}</p>
      </div>
    </button>
  )
}

export function Topbar() {
  const user      = useAuthStore((s) => s.user)
  const pageTitle = usePageTitle()
  const { notifications, markRead, markAllRead } = useNotificationStore()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <header
      className="fixed top-0 right-0 z-20 flex items-center px-6 bg-white border-b border-gray-100"
      style={{ left: 'var(--sidebar-width)', height: 'var(--topbar-height)' }}
    >
      {/* Page title */}
      <h1 className="text-base font-semibold text-gray-900 flex-shrink-0">{pageTitle}</h1>

      {/* Search bar */}
      <div className="flex-1 max-w-sm mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20
                       focus:border-red-400 transition-all"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-3">
        {/* Notification bell + dropdown */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen(v => !v)}
            className={cn(
              'relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors',
              open ? 'bg-gray-100' : 'hover:bg-gray-100'
            )}
          >
            <Bell className="w-5 h-5 text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center
                               bg-red-500 text-white text-[10px] font-bold rounded-full px-0.5 ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200
                            rounded-xl shadow-xl z-50 overflow-hidden">
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600
                                 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Notification list */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <NotificationItem key={n.id} n={n} onRead={markRead} />
                  ))
                )}
              </div>

              {/* Panel footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
                  <p className="text-[11px] text-gray-400 text-center">
                    Showing {notifications.length} most recent notifications
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* User info */}
        {user && (
          <div className="flex items-center gap-2.5">
            <Avatar name={user.name} src={user.avatarUrl} size="sm" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 leading-none">{user.name}</p>
              <p className="text-xs text-gray-500 leading-none mt-0.5 capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
