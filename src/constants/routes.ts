// ─── Route Constants ───────────────────────────────────────────────────────────
// Why constants instead of hardcoded strings?
// If you rename '/users' to '/members' across 20 files = 20 changes + bugs.
// With constants = 1 change here, everything updates automatically.

export const ROUTES = {
  LOGIN:    '/login',
  DASHBOARD: '/dashboard',
  USERS:    '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,
  RIDERS:   '/riders',
  BOOKINGS: '/bookings',
  BIKES:    '/bikes',
  PROFILE:  '/profile',
  SETTINGS: '/settings',
} as const

// ─── Navigation Items ──────────────────────────────────────────────────────────
// Sidebar is data-driven, not hardcoded JSX.
// To add a new page: add one entry here. Nothing else changes.
// This is the "Open/Closed Principle" — open for extension, closed for modification.

export interface NavItem {
  label: string
  path: string
  icon: string   // Lucide icon name — resolved in Sidebar component
  badge?: number // optional count badge (e.g. pending bookings)
}

export interface NavGroup {
  title?: string  // section heading, optional
  items: NavItem[]
}

export const NAVIGATION: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard',  path: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users',           path: ROUTES.USERS,    icon: 'Users' },
      { label: 'Riders',          path: ROUTES.RIDERS,   icon: 'Bike' },
      { label: 'Bookings',        path: ROUTES.BOOKINGS, icon: 'CalendarCheck' },
      { label: 'Bike Management', path: ROUTES.BIKES,    icon: 'Wrench' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile Settings', path: ROUTES.PROFILE,  icon: 'Settings' },
      { label: 'Support',          path: '/support',       icon: 'HelpCircle' },
      { label: 'Privacy Policy',   path: '/privacy',       icon: 'Shield' },
    ],
  },
]
