// entities/user/lib/mapPublicUserToUI.ts
import type { PublicUserDTO, RouteListItem } from "@/shared/api/user/types";
import type { User } from "@/entities/user/model/types";

export interface PublicUserUIData {
    user: User;
    statistics: {
        totalRoutes: number;
        completedRoutes: number;
        activeRoutes: number;
        totalDurationMinutes: number;
        totalDistanceKm: number;
        totalCost: number;
        uniquePlaces: number;
        favouriteCity: string | null;
        lastActivity: string | null;
    };
    publicRoutesTotalCount: number;
    publicRoutes: RouteListItem[];
}

export const mapPublicUserToUI = (data: PublicUserDTO): PublicUserUIData => {
    const { statistics, public_routes_total_count, public_routes, ...user } = data;

    return {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            date_joined: user.date_joined,
        },
        statistics: {
            totalRoutes: statistics.total_routes,
            completedRoutes: statistics.completed_routes,
            activeRoutes: statistics.active_routes,
            totalDurationMinutes: statistics.total_duration_minutes,
            totalDistanceKm: statistics.total_distance_km,
            totalCost: statistics.total_cost,
            uniquePlaces: statistics.unique_places,
            favouriteCity: statistics.favourite_city,
            lastActivity: statistics.last_activity,
        },
        publicRoutesTotalCount: public_routes_total_count,
        publicRoutes: public_routes,
    };
};