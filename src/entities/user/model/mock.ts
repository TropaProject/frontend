import type { User } from "@/entities/user/model/types";
import type { RouteListItem } from "@/shared/api/user/types";

export const mockUserStats = {
    count: 10,
    distance: 100,
    hours: 30,
    minutes: 15
};

export const mockUser: User = {
    id: 1,
    email: 'user@tropa.ru',
    username: 'Турист со стажем',
    date_joined: '2025-12-21T00:00:00Z',
};

// export const mockUserStats = {
//     total_routes: 10,
//     completed_routes: 7,
//     active_routes: 3,
//     total_duration_minutes: 1830, // 30 часов 30 минут
//     total_distance_km: 100,
//     total_cost: 15000,
//     unique_places: 25,
//     favourite_city: 'Москва',
//     last_activity: '2026-04-20T12:00:00Z',
// };

export const mockUserRoutes: RouteListItem[] = [
    {
        route_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        description: "Утренняя прогулка по паркам Москвы",
        total_duration: 120,
        total_cost: 500,
        status: "done",
        created_at: "2026-04-20T08:00:00Z",
        updated_at: "2026-04-20T10:00:00Z",
    },
    {
        route_id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        description: "Вечерний променад по набережной",
        total_duration: 90,
        total_cost: 300,
        status: "done",
        created_at: "2026-04-18T18:00:00Z",
        updated_at: "2026-04-18T19:30:00Z",
    },
    {
        route_id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
        description: "Архитектурный маршрут: от модерна до конструктивизма",
        total_duration: 150,
        total_cost: 0,
        status: "going",
        created_at: "2026-04-22T10:00:00Z",
        updated_at: null,
    },
    {
        route_id: "d4e5f6a7-b8c9-0123-defa-234567890123",
        description: "Кофейный тур: лучшие спешелти-кофейни",
        total_duration: 180,
        total_cost: 1200,
        status: "going",
        created_at: "2026-04-25T09:00:00Z",
        updated_at: null,
    },
    {
        route_id: "e5f6a7b8-c9d0-1234-efab-345678901234",
        description: "Отменено: слишком далеко",
        total_duration: 200,
        total_cost: null,
        status: "cancelled",
        created_at: "2026-04-15T12:00:00Z",
        updated_at: "2026-04-16T14:00:00Z",
    },
];