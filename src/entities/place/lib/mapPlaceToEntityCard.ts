// entities/place/lib/mapPlaceToEntityCard.ts
import { formatWorkingHours } from '@/entities/place/lib/formatWorkingHours';
import type { FavoritePointDTO } from '@/shared/api/point/types';
import type { EntityCardProps } from '@/shared/components/ui/cards/EntityCard/types';

export const mapPlaceToEntityCard = (place: FavoritePointDTO): EntityCardProps => {
    const hours = formatWorkingHours(place.working_hours);

    return {
        id: place.id,
        title: place.name,
        description: place.description,
        image: place.image_url ?? '/place.jpg',
        city: place.city ?? undefined,
        price: place.average_cost != null && place.average_cost > 0
            ? `${place.average_cost.toLocaleString('ru-RU')} ₽`
            : place.average_cost === 0 ? 'Бесплатно' : undefined,
        schedule: hours?.status,
        rating: place.average_rating,
        reviewsCount: place.reviews_count > 0 ? `${place.reviews_count} отзывов` : undefined,
        tags: [],
    };
};