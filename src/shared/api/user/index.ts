// shared/api/user/index.ts
import { api } from "@/shared/api/base";
import type {
    UserResponse,
    UserStatisticsResponse,
    UserRoutesListResponse,
    RouteStatus,
    PublicUserResponse,
} from "@/shared/api/user/types";

export const userApi = {
    getMe: async (): Promise<UserResponse> => {
        const response = await api.get<UserResponse>("/user");
        return response.data;
    },

    getStatistics: async (): Promise<UserStatisticsResponse> => {
        const response = await api.get<UserStatisticsResponse>("/user/statistic/");
        return response.data;
    },

    getRoutes: async (params?: {
        status?: RouteStatus;
        public_only?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<UserRoutesListResponse> => {
        const query = new URLSearchParams();
        if (params?.status) query.set("status", params.status);
        if (params?.public_only !== undefined) query.set("public_only", String(params.public_only));
        if (params?.limit) query.set("limit", String(params.limit));
        if (params?.offset) query.set("offset", String(params.offset));

        const response = await api.get<UserRoutesListResponse>(
            `/user/list/?${query.toString()}`
        );
        return response.data;
    },

    getUserById: async (userId: number): Promise<PublicUserResponse> => {
        const response = await api.get<PublicUserResponse>(`/user/${userId}/`);
        return response.data;
    },
};