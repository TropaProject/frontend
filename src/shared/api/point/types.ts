// shared/api/point/types.ts
import type { ApiResponse } from "@/shared/api/types";

// GET /point/{id}/detail/
export interface PointDetailDTO {
    id: string;
    name: string;
    description: string;
    image_url: string | null;
    address: string | null;
    city: string;
    area: string | null;
    coordinates: {
        lat: number;
        lng: number;
    };
    average_visit_duration: number;
    average_cost: number | null;
    average_rating: number;
    reviews_count: number;
    tags: string[];
    interests: { id: string; label: string }[];
    moods: { id: string; label: string }[];
    best_visit_time: string[];
    working_hours: Record<string, string> | null;
    seasonality: {
        is_seasonal: boolean;
        months: number[];
    };
    analytics: {
        view_count: number;
        success_rate: number;
        last_viewed_at: string | null;
    };
    last_reviews: PointReviewDTO[];
}

export type PointDetailResponse = ApiResponse<PointDetailDTO>;

// GET /point/{id}/reviews/
export interface PointReviewDTO {
    user_id: number;
    username: string;
    rating: number;
    comment: string;
    created_at: string;
}

export interface PointReviewsResponseData {
    point_id: string;
    average_rating: number;
    reviews_count: number;
    page: number;
    page_size: number;
    total: number;
    reviews: PointReviewDTO[];
}

export type PointReviewsResponse = ApiResponse<PointReviewsResponseData>;

// POST /point/{id}/create-review/
export interface CreateReviewRequest {
    rating: number;
    comment?: string;
}

export interface CreateReviewResponse {
    status: "success";
    created: boolean;
}

// POST /point/{id}/favorite/
export type ToggleFavoriteResponse = { status: "added" } | { status: "removed" };

// POST /point/{id}/favorite/note/
export interface UpdateFavoriteNoteRequest {
    note: string;
}

export interface UpdateFavoriteNoteResponse {
    status: "success";
    note: string;
}

// GET /point/favorites/
export interface FavoritePointDTO {
    id: string;
    name: string;
    image_url: string | null;
    description: string;
    average_rating: number;
    reviews_count: number;
    working_hours: Record<string, string> | null;
    average_cost: number | null;
    city: string | null;
    coordinates: {
        lat: number;
        lng: number;
    };
    note: string;
    added_at: string;
}

export interface FavoritePointsResponse {
    status: "success";
    total_count: number;
    data: FavoritePointDTO[];
}