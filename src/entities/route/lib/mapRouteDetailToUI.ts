// entities/route/lib/mapRouteDetailToUI.ts
import { formatDuration } from "@/entities/route/lib/formatDuration";
import type { User } from "@/entities/user/model/types";
import type { YMapCoordinates } from "@/features/yandex-map/model/types";
import type { RouteDetailDTO } from "@/shared/api/route/types";

export interface RouteHeroData {
    title: string;
    description: string;
    totalDuration: string;
    walkTime: string;
    visitTime: string;
    totalCost: string;
    totalMeters: string;
    pointsCount: number;
    status: string;
    createdAt: string;
    user: User;
    isPublic?: boolean;              // ← новое
    publicUsesCount?: number;        // ← новое
    coordinates: YMapCoordinates[];
}

export const mapRouteDetailToHero = (route: RouteDetailDTO): RouteHeroData => ({
    title: route.title,
    description: route.description ?? "",
    totalDuration: formatDuration(route.total_duration),
    walkTime: formatDuration(route.walk_time),
    visitTime: formatDuration(route.visit_time),
    totalCost: route.total_cost != null ? `${route.total_cost.toLocaleString("ru-RU")} ₽` : "0 ₽",
    totalMeters: route.total_meters != null
        ? route.total_meters >= 1000
            ? `${(route.total_meters / 1000).toFixed(1)} км`
            : `${route.total_meters} м`
        : "0 м",
    pointsCount: route.points.length,
    status: route.status,
    createdAt: new Date(route.created_at).toLocaleDateString("ru-RU"),
    user: route.user,
    isPublic: route.is_public,
    publicUsesCount: route.public_uses_count,
    coordinates: route.points.map(p => ({
        lat: p.coordinates.lat,
        lng: p.coordinates.lng,
        name: p.name,
    })),
});