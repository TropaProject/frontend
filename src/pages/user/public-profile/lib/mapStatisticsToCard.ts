// pages/user/public-profile/lib/mapStatisticsToCard.ts
export interface ProfileStatsCardData {
    count: number;
    distance: number;
    hours: number;
    minutes: number;
}

export const mapStatisticsToCard = (statistics: {
    totalRoutes: number;
    totalDistanceKm: number;
    totalDurationMinutes: number;
}): ProfileStatsCardData => {
    const hours = Math.floor(statistics.totalDurationMinutes / 60);
    const minutes = statistics.totalDurationMinutes % 60;

    return {
        count: statistics.totalRoutes,
        distance: statistics.totalDistanceKm,
        hours,
        minutes,
    };
};