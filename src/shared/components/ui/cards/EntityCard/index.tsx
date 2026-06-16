// shared/components/ui/cards/EntityCard/index.tsx
import clsx from 'clsx';
import StarIcon from '@/shared/assets/icons/StarIcon';
import BaseButton from '@/shared/components/ui/buttons/BaseButton';
import EntityCardBorder from '@/shared/assets/borders/EntityCardBorder';
import { Link } from 'react-router-dom';
import { CityBadge } from '@/shared/components/ui/badges/CityBadge';
import ClockIcon from '@/shared/components/ui/cards/EntityCard/assets/icons/ClockIcon';
import type { EntityCardProps } from '@/shared/components/ui/cards/EntityCard/types';
import WalletIcon from '@/entities/place/ui/PlaceFullDetailsCard/assets/icons/WalletIcon';

const Stars = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
            <StarIcon
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-primary' : 'fill-background'}`}
            />
        ))}
    </div>
);

export default function EntityCard({
    title,
    description,
    image,
    city,
    schedule,
    price,
    rating,
    reviewsCount,
    tags = [],
    button,
    className,
    border,
}: EntityCardProps) {

    const hasRating = rating != null;
    const hasReviews = reviewsCount != null;

    return (
        <div className={clsx(
            'relative pr-1 sm:pb-1 tablet:pl-1.5 tablet:pr-1.5 flex flex-col w-full rounded-xl tablet:rounded-2xl',
            className
        )}>
            <EntityCardBorder variant={border?.variant} className={clsx('z-10', border?.color)} />

            <div className="relative z-0 w-full bg-text/30 aspect-[5/4] overflow-hidden desktop:rounded-tr-2xl rounded-t-2xl desktop:rounded-tl-3xl desktop:mt-1 desktop:-rotate-[1.25deg]">
                <img 
                    src={image || '/place.jpg'} 
                    alt={title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        if ((e.target as HTMLImageElement).src !== '/place.jpg') {
                            (e.target as HTMLImageElement).src = '/place.jpg';
                        }
                    }}
                />
            </div>

            {city && <CityBadge city={city} className="desktop:left-6 desktop:top-8" />}

            <div className="flex flex-col flex-1 p-4 desktop:p-6 bg-background rounded-b-3xl">
                <div className="grid grid-cols-[auto_auto] gap-1 mb-2 text-body-xs desktop:text-body-sm text-text">
                    {schedule && (
                        <div className="flex items-center gap-1">
                            <ClockIcon className="size-4.5 text-text shrink-0" />
                            <span>{schedule}</span>
                        </div>
                    )}
                    {price && (
                        <div className="flex items-center gap-1">
                            <WalletIcon className="size-4.5 text-text shrink-0" />
                            <span>{price}</span>
                        </div>
                    )}
                    {tags.map((tag, i) => (
                        <div key={i} className="flex items-center gap-1">
                            {tag.icon}
                            <span>{tag.label}</span>
                        </div>
                    ))}
                </div>

                {(hasRating || hasReviews) && (
                    <div className="flex items-center gap-1 mb-2">
                        <Stars rating={rating ?? 0} />
                        <span className="text-body-sm text-text">
                            {hasReviews && reviewsCount !== '0' ? reviewsCount : 'Без оценок'}
                        </span>
                    </div>
                )}

                <h3 className="text-primary text-heading-xs! line-clamp-2 leading-none! desktop:text-heading-md! mb-2">
                    {title}
                </h3>
                <p className="text-text text-body-sm mb-auto line-clamp-3">
                    {description}
                </p>

                {button && (
                    <BaseButton
                        variant={button.variant}
                        as={button.to ? Link : 'button'}
                        to={button.to}
                        onClick={button.onClick}
                        className={clsx('mt-4 w-full max-w-none desktop:-rotate-2', button.className)}
                    >
                        {button.title}
                    </BaseButton>
                )}
            </div>
        </div>
    );
}