export const ROUTES = {
  LOGIN:         '/login',
  DASHBOARD:     '/dashboard',
  USERS:         '/users',
  USER_DETAIL:   (id: string) => `/users/${id}`,
  RIDERS:        '/riders',
  RIDER_DETAIL:  (id: string) => `/riders/${id}`,
  BOOKINGS:      '/bookings',
  BIKES:         '/bikes',
  BIKE_DETAIL:   (id: string) => `/bikes/${id}`,
  FAQ:           '/faq',
  PRIVACY:       '/privacy',
  TERMS:         '/terms',
  PROFILE:       '/profile',
  SUPPORT:       '/support',
} as const

export interface NavItem {
  label: string
  path: string
  icon: string
  badge?: number
}

export interface NavGroup {
  title?: string
  items: NavItem[]
}

export const NAVIGATION: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'User',            path: ROUTES.USERS,    icon: 'Users' },
      { label: 'Rider',           path: ROUTES.RIDERS,   icon: 'Bike' },
      { label: 'Bookings',        path: ROUTES.BOOKINGS, icon: 'CalendarCheck' },
      { label: 'Bike Management', path: ROUTES.BIKES,    icon: 'Wrench' },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Profile Setting', path: ROUTES.PROFILE,  icon: 'Settings' },
      { label: 'FAQ',             path: ROUTES.FAQ,      icon: 'HelpCircle' },
      { label: 'Privacy Policy',  path: ROUTES.PRIVACY,  icon: 'Shield' },
      { label: 'Support',         path: ROUTES.SUPPORT,  icon: 'HeadphonesIcon' },
      { label: 'Terms & condition', path: ROUTES.TERMS,  icon: 'FileText' },
    ],
  },
]
