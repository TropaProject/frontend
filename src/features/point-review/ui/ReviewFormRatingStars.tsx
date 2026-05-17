// shared/components/ui/ReviewFormRatingStars/index.tsx
import clsx from 'clsx'
import StarIcon from '@/shared/assets/icons/StarIcon'

interface ReviewFormRatingStarsProps {
    rating: number
    className?: string
    starClassName?: string
    onRate?: (rating: number) => void
}

export const ReviewFormRatingStars = ({
    rating,
    className,
    starClassName,
    onRate
}: ReviewFormRatingStarsProps) => (
    <div className={clsx("flex desktop:gap-1 gap-0.5", className)}>
        {[...Array(5)].map((_, i) => {
            const filled = i < rating;

            const star = (
                <StarIcon
                    className={clsx(
                        filled ? 'fill-primary' : 'fill-background',
                        onRate && "hover:scale-110 transition-transform cursor-pointer",
                        starClassName
                    )}
                />
            );

            if (onRate) {
                return (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onRate(i + 1)}
                    >
                        {star}
                    </button>
                );
            }

            return <div key={i}>{star}</div>;
        })}
    </div>
);