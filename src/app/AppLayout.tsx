// app/AppLayout.tsx
import { Outlet, useNavigate } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { useScrollToTop } from '@/shared/hooks/useScrollToTop'
import { useUserStore } from '@/entities/user/model/store'
import { useAuth } from '@/features/auth'

export const AppLayout = () => {
    useScrollToTop()
    const navigate = useNavigate()

    const { user, isAuth } = useUserStore()
    const { logout } = useAuth()

    const handleLogin = () => {
        navigate('/auth/login')
    }

    const handleRegister = () => {
        navigate('/auth/register')
    }

    const handleLogout = () => {
        logout()
    }

    return (
        <div className="flex min-h-screen flex-col max-w-[clamp(360px,100%,1280px)] mx-auto bg-background">
            <div className="mx-auto w-full desktop:px-10 z-1000 fixed max-w-[clamp(360px,100%,1280px)]">
                <Header
                    user={isAuth ? user : undefined}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                    onRegister={handleRegister}
                />
            </div>

            <div className='pt-10 min-h-dvh desktop:min-h-auto'>
                <Outlet />
            </div>

            <Footer />
        </div>
    )
}