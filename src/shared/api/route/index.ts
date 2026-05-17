// shared/api/route/index.ts
import { api } from "@/shared/api/base";
import type {
    RouteDetailResponse,
    EditRouteStatusRequest,
    EditRouteStatusResponse,
    CancelRouteRequest,
    CancelRouteResponse,
    RouteFeedbackRequest,
    RouteFeedbackResponse,
    AddFoodPointRequest,
    AddFoodPointResponse,
    FoodFormResponse,
    VisibilityResponse,
    VisibilityRequest,
    PublicRoutesResponse,
    RecommendedRoutesResponse,
    CopyPublicRouteRequest,
    CopyPublicRouteResponse,
} from "@/shared/api/route/types";

export const routeApi = {
    getDetail: async (routeId: string): Promise<RouteDetailResponse> => {
        const response = await api.get<RouteDetailResponse>(`/route/show/${routeId}/`);
        return response.data;
    },

    editStatus: async (data: EditRouteStatusRequest): Promise<EditRouteStatusResponse> => {
        const response = await api.post<EditRouteStatusResponse>("/route/edit-status/", data);
        return response.data;
    },

    copyPublic: async (data: CopyPublicRouteRequest): Promise<CopyPublicRouteResponse> => {
        const response = await api.post<CopyPublicRouteResponse>("/route/copy-public/", data);
        return response.data;
    },

    feedback: async (data: RouteFeedbackRequest): Promise<RouteFeedbackResponse> => {
        const response = await api.post<RouteFeedbackResponse>("/route/feedback/", data);
        return response.data;
    },

    addFoodPoint: async (data: AddFoodPointRequest): Promise<AddFoodPointResponse> => {
        const response = await api.post<AddFoodPointResponse>("/route/add_food_point/", data);
        return response.data;
    },

    getFoodForm: async (): Promise<FoodFormResponse> => {
        const response = await api.get<FoodFormResponse>("/route/food-form/");
        return response.data;
    },

    setVisibility: async (data: VisibilityRequest): Promise<VisibilityResponse> => {
        const response = await api.post<VisibilityResponse>("/route/visibility/", data);
        return response.data;
    },

    getPublicRoutes: async (params?: {
        city_id?: string;
        limit?: number;
        offset?: number;
    }): Promise<PublicRoutesResponse> => {
        const query = new URLSearchParams();
        if (params?.city_id) query.set("city_id", params.city_id);
        if (params?.limit) query.set("limit", String(params.limit));
        if (params?.offset) query.set("offset", String(params.offset));

        const response = await api.get<PublicRoutesResponse>(
            `/route/public/?${query.toString()}`
        );
        return response.data;
    },

    getRecommendedRoutes: async (params?: {
        city_id?: string;
        limit?: number;
        offset?: number;
        exclude_copied?: boolean;
    }): Promise<RecommendedRoutesResponse> => {
        const query = new URLSearchParams();
        if (params?.city_id) query.set("city_id", params.city_id);
        if (params?.limit) query.set("limit", String(params.limit));
        if (params?.offset) query.set("offset", String(params.offset));
        if (params?.exclude_copied) query.set("exclude_copied", String(params.exclude_copied));

        const response = await api.get<RecommendedRoutesResponse>(
            `/route/recommended/?${query.toString()}`
        );
        return response.data;
    },
};