// app/AppLayout.tsx
import { Outlet, useNavigate } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { useScrollToTop } from '@/shared/hooks/useScrollToTop'
import { useUserStore } from '@/entities/user/model/store'
import { useAuth } from '@/features/auth'
import { createPortal } from 'react-dom'

export const AppLayout = () => {
    useScrollToTop()
    const navigate = useNavigate()
    const { user, isAuth } = useUserStore()
    const { logout } = useAuth()

    const handleLogin = () => navigate('/auth/login')
    const handleRegister = () => navigate('/auth/register')
    const handleLogout = () => logout()

    const headerContent = (
        <div className="fixed top-0 left-0 right-0 z-[10000] w-full flex justify-center">
            <div className="w-full max-w-[clamp(360px,100%,1280px)] desktop:px-10">
                <Header
                    user={isAuth ? user : undefined}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                    onRegister={handleRegister}
                />
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen relative flex-col max-w-[clamp(360px,100%,1280px)] mx-auto bg-background">
            {createPortal(headerContent, document.body)}
            
            <div className='pt-10'>
                <Outlet />
            </div>

            <Footer/>
        </div>
    )
}