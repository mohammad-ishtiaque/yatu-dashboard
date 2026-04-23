import { NavLink, useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { NAVIGATION, ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/lib/store/authStore'
import { cn } from '@/lib/utils/formatters'

// ─── Dynamic icon resolution ───────────────────────────────────────────────────
// Icons are stored as strings in the nav config ('LayoutDashboard', 'Users', etc.)
// This resolves the string to the actual Lucide component at render time.
// Why? So the nav config is plain data (easy to store in DB or CMS later).
function resolveIcon(name: string): LucideIcon {
  const icon = (Icons as Record<string, unknown>)[name]
  return (icon as LucideIcon) ?? Icons.Circle
}

export function Sidebar() {
  const navigate  = useNavigate()
  const logout    = useAuthStore((s) => s.logout)

  function handleLogout() {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <aside
      className="fixed top-0 left-0 h-full flex flex-col z-30"
      style={{ width: 'var(--sidebar-width)', background: '#1A1A2E' }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center px-6 border-b border-white/5"
           style={{ height: 'var(--topbar-height)' }}>
        <span className="text-2xl font-bold tracking-widest"
              style={{ color: '#E53935' }}>
          YETU
        </span>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {NAVIGATION.map((group, gi) => (
          <div key={gi} className="mb-4">
            {/* Section heading */}
            {group.title && (
              <p className="px-6 mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {group.title}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = resolveIcon(item.icon)
              return (
                // NavLink from react-router automatically applies active class
                // when the current URL matches the 'to' path.
                // This is why we don't need isActive state manually.
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn('nav-item', isActive && 'active')
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold
                                     px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Icons.LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}
