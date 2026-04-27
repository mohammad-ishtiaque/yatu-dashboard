import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProtectedRoute, DashboardLayout } from '@/components/layout/DashboardLayout'
import { ROUTES } from '@/constants/routes'
import { lazy, Suspense } from 'react'

const LoginPage          = lazy(() => import('@/pages/auth/LoginPage'))
const OverviewPage       = lazy(() => import('@/pages/dashboard/OverviewPage'))
const UsersPage          = lazy(() => import('@/pages/users/UsersPage'))
const UserDetailPage     = lazy(() => import('@/pages/users/UserDetailPage'))
const RidersPage         = lazy(() => import('@/pages/riders/RidersPage'))
const RiderDetailPage    = lazy(() => import('@/pages/riders/RiderDetailPage'))
const BookingsPage       = lazy(() => import('@/pages/bookings/BookingsPage'))
const BikesPage          = lazy(() => import('@/pages/bikes/BikesPage'))
const FaqPage            = lazy(() => import('@/pages/faq/FaqPage'))
const PrivacyPolicyPage  = lazy(() => import('@/pages/content/PrivacyPolicyPage'))
const TermsPage          = lazy(() => import('@/pages/content/TermsPage'))
const ProfilePage        = lazy(() => import('@/pages/profile/ProfilePage'))
const SupportPage        = lazy(() => import('@/pages/support/SupportPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1, refetchOnWindowFocus: false },
  },
})

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: <S><LoginPage /></S> },
  {
    element: <ProtectedRoute />,
    children: [{
      element: <DashboardLayout />,
      children: [
        { index: true,                  element: <Navigate to={ROUTES.DASHBOARD} replace /> },
        { path: ROUTES.DASHBOARD,       element: <S><OverviewPage /></S> },
        { path: ROUTES.USERS,           element: <S><UsersPage /></S> },
        { path: '/users/:id',           element: <S><UserDetailPage /></S> },
        { path: ROUTES.RIDERS,          element: <S><RidersPage /></S> },
        { path: '/riders/:id',          element: <S><RiderDetailPage /></S> },
        { path: ROUTES.BOOKINGS,        element: <S><BookingsPage /></S> },
        { path: ROUTES.BIKES,           element: <S><BikesPage /></S> },
        { path: ROUTES.FAQ,             element: <S><FaqPage /></S> },
        { path: ROUTES.PRIVACY,         element: <S><PrivacyPolicyPage /></S> },
        { path: ROUTES.TERMS,           element: <S><TermsPage /></S> },
        { path: ROUTES.PROFILE,         element: <S><ProfilePage /></S> },
        { path: ROUTES.SUPPORT,         element: <S><SupportPage /></S> },
      ],
    }],
  },
  { path: '*', element: <Navigate to={ROUTES.DASHBOARD} replace /> },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
