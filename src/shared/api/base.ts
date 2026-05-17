// shared/api/base.ts
import { API_BASE_URL } from '@/shared/lib/config';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            localStorage.getItem('refresh_token')
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const { data } = await axios.post<{ access: string }>(
                    `${API_BASE_URL}/auth/refresh`,
                    { refresh: refreshToken }
                );

                localStorage.setItem('access_token', data.access);
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return api(originalRequest);
            } catch {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return Promise.reject(new Error('Сессия истекла'));
            }
        }

        return Promise.reject(error);
    }
);