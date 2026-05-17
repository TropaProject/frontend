// shared/api/user/types.ts
import type { ApiResponse } from "@/shared/api/types";

export interface UserDTO {
    id: number;
    email: string;
    username: string;
    date_joined: string;
    avatar?: string | null;
}

export type UserResponse = ApiResponse<UserDTO>;

export interface UserStatistics {
    total_routes: number;
    completed_routes: number;
    active_routes: number;
    total_duration_minutes: number;
    total_distance_km: number;
    total_cost: number;
    unique_places: number;
    favourite_city: string | null;
    last_activity: string | null;
}

export type UserStatisticsResponse = ApiResponse<UserStatistics>;

export type RouteStatus = "going" | "done" | "cancelled";

export interface RouteListItem {
    route_id: string;
    title?: string | null;
    description: string | null;
    total_duration: number;
    total_cost: number | null;
    status: RouteStatus;
    is_public?: boolean;
    public_uses_count?: number;
    original_route_id?: string | null;
    created_at: string;
    updated_at: string | null;
    city?: string | null;
    image?: string | null;
    tag?: string | null;
    interest?: string | null;
    best_visit_time?: string | null;
}

export interface UserRoutesListResponse {
    status: "success";
    total_count: number;
    data: RouteListItem[];
}