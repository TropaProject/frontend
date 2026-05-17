// features/point-review/hooks/useCreateReview.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pointApi } from "@/shared/api/point";

export const useCreateReview = (pointId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { rating: number; comment: string }) =>
            pointApi.createReview(pointId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["point", pointId] });
            queryClient.invalidateQueries({ queryKey: ["point", pointId, "reviews"] });
        },
    });
};