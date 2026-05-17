import { useUserStore } from '@/entities/user/model/store'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
    const isAuth = useUserStore((state) => state.isAuth)

    if (!isAuth) {
        return <Navigate to="/auth/login" replace />
    }

    return <Outlet />
}