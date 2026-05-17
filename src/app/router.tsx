// app/router.tsx
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { PageLoader } from '@/shared/components/ui/loaders/PageLoader'
import { AppLayout } from '@/app/AppLayout'
import HomePage from '@/pages/home'
import { ProtectedRoute } from '@/widgets/ProtectedRoute'
import PublicProfilePage from '@/pages/user/public-profile'
import UserProfilePage from '@/pages/user/profile'

const RouteDetailsPage = lazy(() => import('@/pages/route'))
const CreateRoutePage = lazy(() => import('@/pages/create-route'))
const PlacePage = lazy(() => import('@/pages/place'))
const FAQPage = lazy(() => import('@/pages/faq'))

const AuthPage = lazy(() => import('@/pages/auth'))
const LoginPage = lazy(() => import('@/pages/auth/login'))
const RegisterPage = lazy(() => import('@/pages/auth/register'))

const UserLayout = lazy(() => import('@/pages/user/ui/UserLayout').then(m => ({ default: m.UserLayout })))
const UserRoutesPage = lazy(() => import('@/pages/user/routes'))
const UserFavouritePlacesPage = lazy(() => import('@/pages/user/favourite-places'))
const UserStatsPage = lazy(() => import('@/pages/user/stats'))
const UserSettingsPage = lazy(() => import('@/pages/user/settings'))
const PrivacyPolicyPage = lazy(() => import('@/pages/privacy-policy'))
const LegalPage = lazy(() => import('@/pages/legal'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))


export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <Outlet />
                    </Suspense>
                ),
                children: [
                    { index: true, element: <HomePage /> },
                    { path: 'place/:id', element: <PlacePage /> },
                    { path: 'faq', element: <FAQPage /> },

                    {
                        path: 'auth',
                        children: [
                            { index: true, element: <AuthPage /> },
                            { path: 'login', element: <LoginPage /> },
                            { path: 'register', element: <RegisterPage /> },
                        ]
                    },

                    {
                        element: <ProtectedRoute />,
                        children: [
                            { path: 'route/:id', element: <RouteDetailsPage /> },
                            { path: 'route/create', element: <CreateRoutePage /> },
                        ]
                    },

                    {
                        path: 'user',
                        element: <UserLayout />,
                        children: [
                            { path: '', element: <Navigate to="me" replace /> },

                            // Защищенные
                            {
                                element: <ProtectedRoute />,
                                children: [
                                    { path: 'me', element: <UserProfilePage /> },
                                    { path: 'routes', element: <UserRoutesPage /> },
                                    { path: 'favourite-places', element: <UserFavouritePlacesPage /> },
                                    { path: 'stats', element: <UserStatsPage /> },
                                    { path: 'settings', element: <UserSettingsPage /> },
                                    { path: ':id', element: <PublicProfilePage /> },

                                ]
                            },

                        ]
                    },
                    { path: 'privacy', element: <PrivacyPolicyPage /> },
                    { path: 'legal', element: <LegalPage /> },
                    { path: '*', element: <NotFoundPage /> },
                ]
            }
        ],
    },
])