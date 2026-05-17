// shared/api/point/index.ts
import { api } from "@/shared/api/base";
import type {
    PointDetailResponse,
    PointReviewsResponse,
    CreateReviewRequest,
    CreateReviewResponse,
    ToggleFavoriteResponse,
    UpdateFavoriteNoteRequest,
    UpdateFavoriteNoteResponse,
    FavoritePointsResponse,
} from "@/shared/api/point/types";

export const pointApi = {
    getDetail: async (pointId: string): Promise<PointDetailResponse> => {
        const response = await api.get<PointDetailResponse>(`/point/${pointId}/detail/`);
        return response.data;
    },

    getReviews: async (pointId: string, page = 1): Promise<PointReviewsResponse> => {
        const response = await api.get<PointReviewsResponse>(
            `/point/${pointId}/reviews/?page=${page}`
        );
        return response.data;
    },

    createReview: async (pointId: string, data: CreateReviewRequest): Promise<CreateReviewResponse> => {
        const response = await api.post<CreateReviewResponse>(
            `/point/${pointId}/create-review/`,
            data
        );
        return response.data;
    },

    toggleFavorite: async (pointId: string): Promise<ToggleFavoriteResponse> => {
        const response = await api.post<ToggleFavoriteResponse>(
            `/point/${pointId}/favorite/`
        );
        return response.data;
    },

    updateFavoriteNote: async (pointId: string, data: UpdateFavoriteNoteRequest): Promise<UpdateFavoriteNoteResponse> => {
        const response = await api.post<UpdateFavoriteNoteResponse>(
            `/point/${pointId}/favorite/note/`,
            data
        );
        return response.data;
    },

    getFavorites: async (params?: {
        limit?: number;
        offset?: number;
    }): Promise<FavoritePointsResponse> => {
        const query = new URLSearchParams();
        if (params?.limit) query.set("limit", String(params.limit));
        if (params?.offset) query.set("offset", String(params.offset));

        const response = await api.get<FavoritePointsResponse>(
            `/point/favorites/?${query.toString()}`
        );
        return response.data;
    },
};