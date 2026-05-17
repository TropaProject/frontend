// features/create-route/hooks/useCreateRouteQueries.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { createRouteApi } from "@/shared/api/create-route";
import type {
    GenerateDescriptionRequest,
    GenerateRouteRequest,
} from "@/shared/api/create-route/types";

export const useFormData = () => {
    return useQuery({
        queryKey: ["create-route", "form-data"],
        queryFn: () => createRouteApi.getFormData(),
        select: (res) => res.data,
        staleTime: 30 * 60 * 1000,
    });
};

export const useGenerateDescription = () => {
    return useMutation({
        mutationFn: (data: GenerateDescriptionRequest) =>
            createRouteApi.generateDescription(data),
    });
};

export const useGenerateRoute = () => {
    return useMutation({
        mutationFn: (data: GenerateRouteRequest) =>
            createRouteApi.generateRoute(data),
    });
};

export const useAreas = (cityId: string) => {
    return useQuery({
        queryKey: ["create-route", "areas", cityId],
        queryFn: () => createRouteApi.getAreas(cityId),
        select: (res) => res.data,
        enabled: !!cityId,
    });
};