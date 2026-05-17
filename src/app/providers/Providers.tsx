import { AuthProvider } from '@/app/providers/AuthProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'

interface ProvidersProps {
    children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 5 * 60 * 1000,
                    retry: 1,
                    refetchOnWindowFocus: false,
                },
            },
        })
    )

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </QueryClientProvider>
    )
}