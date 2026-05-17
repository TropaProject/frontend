// shared/api/create-route/types.ts
import type { ApiResponse } from "@/shared/api/types";

// GET /route/form/ — данные для квиза
export interface CityDTO {
    id: string;
    name: string;
    image_url: string;
    description: string;
}

export interface InterestDTO {
    id: string;
    label: string;
    description: string;
}

export interface MoodDTO {
    id: string;
    label: string;
    description: string;
}

export interface FormDataResponse {
    status: "success";
    data: {
        cities: CityDTO[];
        interests: InterestDTO[];
        moods: MoodDTO[];
    };
}

// POST /route/gen-description/ — генерация описания
export interface GenerateDescriptionRequest {
    city_id: string;
    interests: string[];
    mood: string[];
    time_of_day: string;
    duration_minutes: number;
    budget: string;
    transport: string;
    start_point?: string;
    start_area?: string;
    description?: string;
}

export interface GenerateDescriptionResponse {
    route_description: string;
}

// POST /route/generate/ — генерация маршрута
export interface GenerateRouteRequest {
    city_id: string;
    time_of_day: string;
    interests: string[];
    mood: string[];
    budget: string;
    transport: string;
    duration_minutes: number;
    description?: string;
    start_point?: string;
    start_area?: string;
    gpt_description?: string;
    radius_km?: number;
}

export interface RoutePointDTO {
    id: string;
    name: string;
    description: string;
    reason?: string;
    image_url: string | null;
    visit_time: string;
    tags: string[];
    average_rating: number;
    reviews_count: number;
    coordinates: {
        lat: number;
        lng: number;
    };
}

export interface GenerateRouteData {
    route_id: string;
    route_name: string;
    title?: string;                     // ← новое (может совпадать с route_name)
    description?: string;              // ← новое (описание маршрута)
    total_duration: number;
    total_meters: number;
    total_cost: number;
    walk_time: number;
    visit_time: number;
    user_id: number;
    is_public?: boolean;               // ← новое
    public_uses_count?: number;        // ← новое
    map_url: string;
    points: RoutePointDTO[];
}

export type GenerateRouteResponse = ApiResponse<GenerateRouteData>;

// GET /route/area — районы города
export interface CityAreaDTO {
    name: string;
    description: string | null;
    image_url: string | null;
}

export interface AreasResponseData {
    city: {
        id: string;
        name: string;
    };
    areas: CityAreaDTO[];
}

export interface AreasResponse {
    status: "success";
    data: AreasResponseData;
}
