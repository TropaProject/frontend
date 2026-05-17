// entities/place/model/types.ts
export type PlaceBadgeType = 'developers_choice' | 'popular_today' | 'local_gem';

export interface WorkingHoursDay {
    day: string;
    hours: string;
    isToday: boolean;
}

export interface FullWorkingHours {
    time: string;       // "12:00-19:00" или "Без выходных" для UI (правая колонка)
    status: string;     // "ПН-СБ" или "Без выходных" для кликабельной части (левая колонка)
    schedule: WorkingHoursDay[];  // полное расписание для модалки
    timeLabel: string;  // "Часы работы" | "Часы работы (сегодня)"
}

export interface PlaceDetails {
    id: string;
    title: string;
    description: string;
    rating: number;
    reviewsCount?: number;
    image?: string;
    city?: string;
    badgeTypes?: PlaceBadgeType[];
    verifiedDate?: string;
}

export interface FullPlaceDetails extends PlaceDetails {
    address: string;
    metro: string;
    budgetText: string;
    fullWorkingHours?: FullWorkingHours;
    coordinates?: { lat: number; lng: number };
}