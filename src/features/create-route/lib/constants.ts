// features/create-route/lib/constants.ts — добавить MOSCOW_BOUNDS и PETERSBURG_BOUNDS

export const TRANSPORT_DEFAULT = "on_foot" as const;

export const BUDGET_MAP: Record<number, string> = {
    1: "budget",
    2: "comfort",
    3: "premium",
    4: "vip",
};

export const CITY_BOUNDS: Record<string, { min_lat: number; max_lat: number; min_lon: number; max_lon: number }> = {
    moscow: {
        min_lat: 55.723242,
        max_lat: 55.778355,
        min_lon: 37.579460,
        max_lon: 37.664025,
    },
    petersburg: {
        min_lat: 59.800000,
        max_lat: 60.050000,
        min_lon: 30.150000,
        max_lon: 30.550000,
    },
};

export const CITY_CENTERS: Record<string, { lat: number; lng: number }> = {
    moscow: { lat: 55.755826, lng: 37.617300 },
    petersburg: { lat: 59.934280, lng: 30.335099 },
};