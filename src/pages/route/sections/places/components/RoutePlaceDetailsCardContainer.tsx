// src/pages/route/sections/places/RoutePlaceDetailsCardContainer.tsx
import type { PlaceDetails } from '@/entities/place'
import PlaceDetailsCard from '@/entities/place/ui/PlaceDetailsCard'

interface RoutePlaceDetailsCardContainerProps {
    place: PlaceDetails
    onCardClick?: (placeId: string) => void
}

export default function RoutePlaceDetailsCardContainer({ place, onCardClick }: RoutePlaceDetailsCardContainerProps) {
    return (
        <div className="flex flex-col gap-6 w-full">
            <PlaceDetailsCard
                key={place.id}
                id={place.id}
                title={place.title}
                description={place.description}
                reviewsCount={place.reviewsCount}
                rating={place.rating}
                verifiedDate={place.verifiedDate}
                image={place.image}
                badgeTypes={place.badgeTypes}
                city={place.city}
                button={{
                    variant: 'primary',
                    title: 'Подробнее',
                    onClick: () => onCardClick?.(place.id),
                }}
            />
        </div>
    )
}