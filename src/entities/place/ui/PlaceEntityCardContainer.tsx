// entities/place/ui/PlaceEntityCardContainer.tsx
import EntityCard from '@/shared/components/ui/cards/EntityCard';
import type { FavoritePointDTO } from '@/shared/api/point/types';
import { mapPlaceToEntityCard } from '@/entities/place/lib/mapPlaceToEntityCard';

interface PlaceEntityCardContainerProps {
    place: FavoritePointDTO;
    className?: string;
}

export const PlaceEntityCardContainer = ({ place, className }: PlaceEntityCardContainerProps) => {
    const props = mapPlaceToEntityCard(place);

    return (
        <EntityCard
            {...props}
            className={className}
            button={{
                variant: 'secondary',
                title: 'Посмотреть место',
                to: `/place/${place.id}`,
            }}
            border={{ color: 'text-text', variant: 'mobileSmall' }}
        />
    );
};