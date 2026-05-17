// src/entities/place/ui/atoms/PlaceRating.tsx
import { RatingStars } from '@/shared/components/ui/RatingStars'

export const PlaceRating = ({ rating, reviewsCount }: { rating: number, reviewsCount: number }) => (
    <div className="flex items-center desktop:gap-2 gap-1">
        <RatingStars rating={rating} />
        <span className="text-body-sm text-text">{reviewsCount} отзывов</span>
    </div>
)