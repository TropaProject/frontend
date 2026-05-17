// features/auth/hooks/useAuth.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/shared/api/auth';
import { useUserStore } from '@/entities/user/model/store';
import type { LoginRequest, RegisterRequest } from '@/shared/api/auth/types';
import { userApi } from '@/shared/api/user';

export const useAuth = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { setTokens, setUser, logout: clearStore } = useUserStore();

    const loginMutation = useMutation({
        mutationFn: (data: LoginRequest) => authApi.login(data),
        onSuccess: async (response) => {
            const { access, refresh } = response.data;
            setTokens(access, refresh);

            const userResponse = await userApi.getMe();
            setUser(userResponse.data);

            navigate('/user/me');
        },
    });

    const registerMutation = useMutation({
        mutationFn: (data: RegisterRequest) => authApi.register(data),
        onSuccess: async (response) => {
            const { access, refresh } = response.data;
            setTokens(access, refresh);

            const userResponse = await userApi.getMe();
            setUser(userResponse.data);

            navigate('/user/me');
        },
    });

    const logout = () => {
        queryClient.clear();

        clearStore();
        navigate('/auth/login');
    };

    return {
        login: {
            mutate: loginMutation.mutate,
            isPending: loginMutation.isPending,
            error: loginMutation.error,
            isError: loginMutation.isError,
        },
        register: {
            mutate: registerMutation.mutate,
            isPending: registerMutation.isPending,
            error: registerMutation.error,
            isError: registerMutation.isError,
        },
        logout,
        isLoading: loginMutation.isPending || registerMutation.isPending,
    };
};
