// entities/user/model/store.ts
import type { UserState } from '@/entities/user/model/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useUserStore = create<UserState>()(
    devtools(
        (set) => ({
            user: null,
            isAuth: !!localStorage.getItem('access_token'),
            isLoading: false,

            setUser: (user) =>
                set({
                    user,
                    isAuth: !!user
                }, false, 'user/setUser'),

            setTokens: (access, refresh) => {
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                set({ isAuth: true }, false, 'user/setTokens');
            },

            setIsLoading: (status) =>
                set({ isLoading: status }, false, 'user/setIsLoading'),

            logout: () => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                set({ user: null, isAuth: false }, false, 'user/logout');
            },
        }),
        { name: 'UserStore' }
    )
);