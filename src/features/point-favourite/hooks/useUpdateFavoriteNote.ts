// features/point-favorite/hooks/useUpdateFavoriteNote.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pointApi } from "@/shared/api/point";

export const useUpdateFavoriteNote = (pointId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { note: string }) => pointApi.updateFavoriteNote(pointId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", "favorites"] });
        },
    });
};