// entities/user/hooks/useUserQueries.ts
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { userApi } from "@/shared/api/user";
import { pointApi } from "@/shared/api/point";
import { routeApi } from "@/shared/api/route";

export const useUserProfile = () => {
    return useQuery({
        queryKey: ["user", "me"],
        queryFn: () => userApi.getMe(),
        select: (data) => data.data,
    });
};

export const useUserById = (userId: number) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => userApi.getUserById(userId),
        enabled: !!userId,
        select: (data) => data.data,
    });
};

export const useUserStatistics = () => {
    return useQuery({
        queryKey: ["user", "statistics"],
        queryFn: () => userApi.getStatistics(),
        select: (data) => data.data,
        staleTime: 10 * 60 * 1000,
    });
};

export const useUserActiveRoutes = (limit = 6) => {
    return useInfiniteQuery({
        queryKey: ["user", "routes", "active", { limit }],
        queryFn: ({ pageParam = 0 }) =>
            userApi.getRoutes({ status: "going", limit, offset: pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0);
            return loaded < lastPage.total_count ? loaded : undefined;
        },
        initialPageParam: 0,
        select: (data) => ({
            routes: data.pages.flatMap((page) => page.data),
            totalCount: data.pages[0]?.total_count ?? 0,
        }),
    });
};

export const useUserAllRoutes = (limit = 6) => {
    return useInfiniteQuery({
        queryKey: ["user", "routes", "all", { limit }],
        queryFn: ({ pageParam = 0 }) =>
            userApi.getRoutes({ limit, offset: pageParam, }),
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0);
            return loaded < lastPage.total_count ? loaded : undefined;
        },
        initialPageParam: 0,
        select: (data) => ({
            routes: data.pages.flatMap((page) => page.data),
            totalCount: data.pages[0]?.total_count ?? 0,
        }),
    });
};

export const useUserPublicRoutes = (limit = 6) => {
    return useInfiniteQuery({
        queryKey: ["user", "routes", "public", { limit }],
        queryFn: ({ pageParam = 0 }) =>
            userApi.getRoutes({ public_only: true, limit, offset: pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0);
            return loaded < lastPage.total_count ? loaded : undefined;
        },
        initialPageParam: 0,
        select: (data) => ({
            routes: data.pages.flatMap((page) => page.data),
            totalCount: data.pages[0]?.total_count ?? 0,
        }),
    });
};

export const useUserFavouritePlaces = (limit = 6) => {
    return useInfiniteQuery({
        queryKey: ["user", "favourite-places", { limit }],
        queryFn: ({ pageParam = 0 }) => pointApi.getFavorites({ limit, offset: pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0);
            return loaded < lastPage.total_count ? loaded : undefined;
        },
        initialPageParam: 0,
        select: (data) => ({
            places: data.pages.flatMap((page) => page.data),
            totalCount: data.pages[0]?.total_count ?? 0,
        }),
    });
};

export const usePublicRoutes = (limit = 6) => {
    return useQuery({
        queryKey: ["routes", "public", { limit }],
        queryFn: () => routeApi.getPublicRoutes({ limit }),
        select: (data) => data.data,
        staleTime: 5 * 60 * 1000,
    });
};

export const useRecommendedRoutes = (limit = 6, cityId?: string) => {
    return useQuery({
        queryKey: ["routes", "recommended", { limit, cityId }],
        queryFn: () => routeApi.getRecommendedRoutes({ limit, exclude_copied: true, city_id: cityId }),
        select: (data) => data.data,
        staleTime: 5 * 60 * 1000,
    });
};

