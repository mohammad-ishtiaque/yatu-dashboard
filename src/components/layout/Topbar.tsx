import { Bell, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@/lib/store/authStore'
import { Avatar } from '@/components/ui/Avatar'
import { NAVIGATION } from '@/constants/routes'

// Derive page title from current URL — no prop drilling needed
function usePageTitle(): string {
  const { pathname } = useLocation()

  // Flatten all nav items and find a match
  const allItems = NAVIGATION.flatMap(g => g.items)
  const match    = allItems.find(item => item.path === pathname)
  return match?.label ?? 'Dashboard'
}

export function Topbar() {
  const user      = useAuthStore((s) => s.user)
  const pageTitle = usePageTitle()

  return (
    <header
      className="fixed top-0 right-0 z-20 flex items-center px-6 bg-white border-b border-gray-100"
      style={{
        left:   'var(--sidebar-width)',
        height: 'var(--topbar-height)',
      }}
    >
      {/* Page title */}
      <h1 className="text-base font-semibold text-gray-900 flex-shrink-0">
        {pageTitle}
      </h1>

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
        {/* Notification bell */}
        <button className="relative w-9 h-9 flex items-center justify-center
                           rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500
                           rounded-full ring-2 ring-white" />
        </button>

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
