import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProtectedRoute, DashboardLayout } from '@/components/layout/DashboardLayout'
import { ROUTES } from '@/constants/routes'
import { lazy, Suspense } from 'react'

const LoginPage      = lazy(() => import('@/pages/auth/LoginPage'))
const OverviewPage   = lazy(() => import('@/pages/dashboard/OverviewPage'))
const UsersPage      = lazy(() => import('@/pages/users/UsersPage'))
const UserDetailPage = lazy(() => import('@/pages/users/UserDetailPage'))
const RidersPage     = lazy(() => import('@/pages/riders/RidersPage'))
const BookingsPage   = lazy(() => import('@/pages/bookings/BookingsPage'))
const BikesPage      = lazy(() => import('@/pages/bikes/BikesPage'))

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

const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
  {
    element: <ProtectedRoute />,
    children: [{
      element: <DashboardLayout />,
      children: [
        { index: true,              element: <Navigate to={ROUTES.DASHBOARD} replace /> },
        { path: ROUTES.DASHBOARD,   element: <Suspense fallback={<PageLoader />}><OverviewPage /></Suspense> },
        { path: ROUTES.USERS,       element: <Suspense fallback={<PageLoader />}><UsersPage /></Suspense> },
        { path: '/users/:id',       element: <Suspense fallback={<PageLoader />}><UserDetailPage /></Suspense> },
        { path: ROUTES.RIDERS,      element: <Suspense fallback={<PageLoader />}><RidersPage /></Suspense> },
        { path: ROUTES.BOOKINGS,    element: <Suspense fallback={<PageLoader />}><BookingsPage /></Suspense> },
        { path: ROUTES.BIKES,       element: <Suspense fallback={<PageLoader />}><BikesPage /></Suspense> },
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
