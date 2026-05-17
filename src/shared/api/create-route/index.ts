// shared/api/create-route/index.ts
import { api } from "@/shared/api/base";
import type {
    FormDataResponse,
    GenerateDescriptionRequest,
    GenerateDescriptionResponse,
    GenerateRouteRequest,
    GenerateRouteResponse,
    AreasResponse,
} from "@/shared/api/create-route/types";

export const createRouteApi = {
    getFormData: async (): Promise<FormDataResponse> => {
        const response = await api.get<FormDataResponse>("/route/form/");
        return response.data;
    },

    generateDescription: async (data: GenerateDescriptionRequest): Promise<GenerateDescriptionResponse> => {
        const response = await api.post<GenerateDescriptionResponse>("/route/gen-description/", data);
        return response.data;
    },

    generateRoute: async (data: GenerateRouteRequest): Promise<GenerateRouteResponse> => {
        const response = await api.post<GenerateRouteResponse>("/route/generate/", data);
        return response.data;
    },

    getAreas: async (cityId: string): Promise<AreasResponse> => {
        const response = await api.get<AreasResponse>(`/route/area?city_id=${cityId}`);
        return response.data;
    },
};
