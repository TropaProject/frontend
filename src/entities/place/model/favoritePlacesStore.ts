// entities/place/model/favoritePlacesStore.ts
import { create } from "zustand";
import { pointApi } from "@/shared/api/point";

interface FavoritePlacesStore {
    favoriteIds: string[];        // ← массив вместо Set
    isLoading: boolean;
    fetchFavorites: () => Promise<void>;
    isFavorite: (pointId: string) => boolean;
    toggleFavorite: (pointId: string) => Promise<"added" | "removed">;
}

export const useFavoritePlacesStore = create<FavoritePlacesStore>((set, get) => ({
    favoriteIds: [],
    isLoading: false,

    fetchFavorites: async () => {
        set({ isLoading: true });
        const all = await pointApi.getFavorites({ limit: 100, offset: 0 });
        set({
            favoriteIds: all.data.map((p) => p.id),
            isLoading: false,
        });
    },

    isFavorite: (pointId) => get().favoriteIds.includes(pointId),

    toggleFavorite: async (pointId) => {
        const res = await pointApi.toggleFavorite(pointId);

        set((state) => ({
            favoriteIds:
                res.status === "added"
                    ? [...state.favoriteIds, pointId]
                    : state.favoriteIds.filter((id) => id !== pointId),
        }));

        return res.status;
    },
}));