// entities/place/hooks/usePointQueries.ts
import { useQuery } from "@tanstack/react-query";
import { pointApi } from "@/shared/api/point";

export const usePointDetail = (pointId: string) => {
    return useQuery({
        queryKey: ["point", pointId],
        queryFn: () => pointApi.getDetail(pointId),
        enabled: !!pointId,
        select: (res) => res.data,
    });
};

export const usePointReviews = (pointId: string, page = 1) => {
    return useQuery({
        queryKey: ["point", pointId, "reviews", page],
        queryFn: () => pointApi.getReviews(pointId, page),
        enabled: !!pointId,
        select: (res) => res.data,
    });
};