// features/point-favorite/hooks/useToggleFavorite.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pointApi } from "@/shared/api/point";

export const useToggleFavorite = (pointId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => pointApi.toggleFavorite(pointId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["point", pointId] });
            queryClient.invalidateQueries({ queryKey: ["user", "favorites"] });
        },
    });
};