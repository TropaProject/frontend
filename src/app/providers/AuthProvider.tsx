import { useEffect, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useUserStore } from '@/entities/user/model/store'
import { userApi } from '@/shared/api/user'

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { setUser, logout, isAuth } = useUserStore()

    const { data, isError } = useQuery({
        queryKey: ['user', 'me'],
        queryFn: () => userApi.getMe(),
        enabled: isAuth,
        retry: false,
        staleTime: 5 * 60 * 1000,
    })

    useEffect(() => {
        if (data) {
            setUser(data.data)
        }
    }, [data, setUser])

    useEffect(() => {
        if (isError) {
            logout()
        }
    }, [isError, logout])

    return <>{children}</>
}