// entities/place/lib/mapPointToFullPlaceDetails.ts
import type { PointDetailDTO } from "@/shared/api/point/types";
import type { FullPlaceDetails } from "@/entities/place/model/types";
import { formatWorkingHours } from "@/entities/place/lib/formatWorkingHours";

export const mapPointToFullPlaceDetails = (point: PointDetailDTO): FullPlaceDetails => ({
    id: point.id,
    title: point.name,
    description: point.description,
    rating: point.average_rating,
    reviewsCount: point.reviews_count,
    image: point.image_url ?? '/place.jpg',
    address: point.address ?? "",
    metro: "",
    budgetText: point.average_cost ? `Средний чек: ${point.average_cost.toLocaleString("ru-RU")} ₽` : "",
    fullWorkingHours: formatWorkingHours(point.working_hours),
    verifiedDate: undefined,
    badgeTypes: [],
    city: point.city,
    coordinates: point.coordinates,
});

export const mapPointToAudience = (point: PointDetailDTO): { moods: string[]; interests: string[] } => ({
    moods: point.moods.map((i) => i.label),
    interests: point.interests.map((i) => i.label),
});