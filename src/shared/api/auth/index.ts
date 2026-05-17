import { api } from "@/shared/api/base";
import type {
    LoginRequest,
    LoginResponse,
    RefreshResponse,
    RegisterRequest,
    RegisterResponse,
} from "@/shared/api/auth/types";

export const authApi = {
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>('/auth/register', data);
        return response.data;
    },

    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    refresh: async (refresh: string): Promise<RefreshResponse> => {
        const response = await api.post<RefreshResponse>('/auth/refresh', { refresh });
        return response.data;
    },
};