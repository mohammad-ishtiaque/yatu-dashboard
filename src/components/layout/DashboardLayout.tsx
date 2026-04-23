import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/lib/store/authStore'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { ROUTES } from '@/constants/routes'

// ─── ProtectedRoute ────────────────────────────────────────────────────────────
// Guards all dashboard routes. If no token → redirect to login.
// Why here and not in each page? → DRY. One guard, all pages protected.
// React Router v6 uses <Outlet /> — children render inside this component.
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    // replace: true → Login page won't be in browser history
    // So pressing Back after login doesn't go back to Login
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}

// ─── DashboardLayout ──────────────────────────────────────────────────────────
// The persistent shell: Sidebar + Topbar stay mounted while only <Outlet />
// (page content) swaps on navigation. This is what prevents sidebar flicker.
export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      {/* Main content area — offset by sidebar width and topbar height */}
      <main
        className="min-h-screen"
        style={{
          paddingLeft:  'var(--sidebar-width)',
          paddingTop:   'var(--topbar-height)',
        }}
      >
        <div className="p-6 animate-fade-in">
          {/* Outlet renders the matched child route's page component */}
          <Outlet />
        </div>
      </main>
    </div>
  )
}
