// src/shared/components/ui/RatingStars/index.tsx
import clsx from 'clsx'
import StarIcon from '@/shared/assets/icons/StarIcon'

interface RatingStarsProps {
    rating: number
    className?: string
    starClassName?: string
}

export const RatingStars = ({ rating, className, starClassName }: RatingStarsProps) => (
    <div className={clsx("flex desktop:gap-1 gap-0.5", className)}>
        {[...Array(5)].map((_, i) => (
            <StarIcon
                key={i}
                className={clsx(
                    "w-4 h-4",
                    i < Math.floor(rating) ? 'fill-primary' : 'fill-background',
                    starClassName
                )}
            />
        ))}
    </div>
)