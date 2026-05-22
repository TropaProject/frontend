// shared/api/route/types.ts
import type { User } from "@/entities/user/model/types";
import type { ApiResponse } from "@/shared/api/types";
import type { RouteListItem } from "@/shared/api/user/types";

export interface RoutePointDTO {
    id: string;
    name: string;
    description: string;
    average_rating: number;
    reviews_count: number;
    image_url: string | null;
    coordinates: { lat: number; lng: number };
    working_hours: Record<string, string> | null;
    average_cost: number | null;
    city: string | null;
    tags: string[];
    interests: string[];

    is_partner: boolean //пока не возвращается с апи
}

export interface RouteDetailDTO {
    route_id: string;
    user: User;
    title: string;
    description: string | null;
    author?: {
        id: number;
        username: string;
        email: string;
    };
    is_owner?: boolean;
    is_public?: boolean;
    public_uses_count?: number;
    original_route_id?: string | null;
    total_duration: number;
    walk_time: number;
    visit_time: number;
    total_cost: number | null;
    total_meters: number | null;
    status: "going" | "done" | "cancelled";
    point_sequence: string[];
    points: RoutePointDTO[];
    created_at: string;
    updated_at: string | null;
}

export type RouteDetailResponse = ApiResponse<RouteDetailDTO>;

// POST /route/edit-status/

type RouteStatus = "going" | "done" | "cancelled"

export interface EditRouteStatusRequest {
    route_id: string;
    status: RouteStatus;
}

export interface EditRouteStatusResponse {
    status: "success";
    data: {
        route_id: string;
        new_status: RouteStatus;
        updated_at: string;
    };
}

// POST /route/cancel
export interface CancelRouteRequest {
    route_id: string;
    reason?: string;
}

export interface CancelRouteResponse {
    status: "success";
    data: {
        route_id: string;
        status: string;
        cancel_reason: string;
        updated_at: string;
    };
}

// POST /route/feedback/
export interface RouteFeedbackRequest {
    route_id: string;
    rating?: number;
    comment?: string;
}

export interface RouteFeedbackResponse {
    status: "success";
    data: {
        route_id: string;
        user_id: number;
        rating: number;
        comment: string;
        created_at: string;
    };
}

// POST /route/add_food_point/
export interface AddFoodPointRequest {
    route_id: string;
    between_index: number;
    interests: string[];
    note?: string;
}

export type AddFoodPointResponse = ApiResponse<RouteDetailDTO>;

// GET /route/food-form/
export interface FoodInterestDTO {
    id: string;
    label: string;
    description: string;
}

export interface FoodFormResponse {
    status: "success";
    data: {
        interests: FoodInterestDTO[];
    };
}

// POST /api/route/visibility/
export interface VisibilityRequest {
    route_id: string;
    is_public: boolean;
}

export interface VisibilityResponse {
    status: "success";
    data: {
        route_id: string;
        title: string;
        description: string;
        is_public: boolean;
        is_owner: boolean;
        author: {
            id: number;
            username: string;
            email: string;
        };
        public_uses_count: number;
        original_route_id: string | null;
        created_at: string;
        city: string;
    };
}

export interface CitySuggestionRequest {
    name: string;
    country: string;
    comment: string;
}

export interface CitySuggestionResponse {
    status: "success";
    created: boolean;
    voted_now: boolean;
    data: {
        id: string;
        name: string;
        country: string;
        comment: string;
        status: string;
        votes_count: number;
        has_voted: boolean;
        created_by: {
            id: number;
            username: string;
        };
        created_at: string;
        updated_at: string;
    };
}

// GET /route/public/
export interface PublicRouteDTO extends RouteListItem {
    total_meters: number | null;
    is_owner: boolean;
    author: {
        id: number;
        username: string;
        email: string;
    };
    original_route_id: string | null;
}

export interface PublicRoutesResponse {
    status: "success";
    total_count: number;
    data: PublicRouteDTO[];
}

// GET /route/recommended/
export interface RecommendedRouteDTO extends PublicRouteDTO {
    recommendation_score: number;
    recommendation_reasons: ("same_city" | "matching_interests" | "popular")[];
    can_copy: boolean;
}

export interface RecommendedRoutesResponse {
    status: "success";
    total_count: number;
    data: RecommendedRouteDTO[];
}


//  POST /api/route/copy-public/

export interface CopyPublicRouteRequest {
    route_id: string;
}

export interface CopyPublicRouteResponse {
    status: "success";
    data: {
        route: RouteDetailDTO;
        source_route_id: string;
        source_public_uses_count: number;
    };
}