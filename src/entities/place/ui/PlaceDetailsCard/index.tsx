// src/entities/place/ui/PlaceDetailsCard/index.tsx
import clsx from 'clsx'
import StarIcon from '@/shared/assets/icons/StarIcon'
import BaseButton from '@/shared/components/ui/buttons/BaseButton'
import VerifiedDateBadge from '@/shared/components/ui/badges/VerifiedDateBadge'
import PlaceBadgesList from '@/shared/components/ui/badges/PlaceBadgesList'
import { Link } from 'react-router-dom'

import { CityBadge } from '@/shared/components/ui/badges/CityBadge'
import EntityCardBorder from '@/shared/assets/borders/EntityCardBorder'
import type { EntityCardBorderProps, EntityCardButtonProps } from '@/shared/components/ui/cards/EntityCard/types'
import type { PlaceDetails } from '@/entities/place/model/types'

interface PlaceDetailsProps extends PlaceDetails {
    button?: EntityCardButtonProps
    border?: EntityCardBorderProps
    className?: string
}

export default function PlaceDetailsCard({
    id,
    title,
    description,
    reviewsCount,
    rating,
    verifiedDate,
    image,
    badgeTypes = [],
    city,
    button,
    className,
    border,
}: PlaceDetailsProps) {
    return (
        <div className={clsx('relative w-full mx-auto flex flex-col h-full tablet:max-h-74', className)}>
            <div className="relative tablet:bg-background flex rounded-xl overflow-hidden h-full tablet:rounded-t-none tablet:rounded-l-2xl flex-col tablet:grid tablet:grid-cols-16 tablet:gap-8 tablet:py-1.5 tablet:pl-2">
                <EntityCardBorder variant={border?.variant} className={clsx('z-10', border?.color)} />

                <div className="relative pr-1 tablet:pr-0 col-span-6 z-0 rounded-t-2xl tablet:aspect-auto aspect-[3/2] xs:aspect-[11/5] tablet:rounded-t-none tablet:rounded-l-2xl overflow-hidden tablet:max-h-full w-full">
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
                    <div className='h-90 w-full bg-text/30 object-cover' />
                </div>

                {city && (
                    <CityBadge city={city} />
                )}

                <div className="flex flex-col h-full bg-background justify-between relative tablet:py-6 pt-4 col-span-7 px-4 tablet:pl-0">
                    <PlaceBadgesList
                        badges={badgeTypes}
                        className="absolute -top-1/2 -translate-y-8 tablet:translate-y-0 lg:mt-8 desktop:mt-0.5 right-6 tablet:static"
                    />

                    <div className="flex flex-row justify-between sm:pt-4 mt-auto">
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center tablet:gap-2 gap-1">
                                <div className="flex tablet:gap-1 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className={clsx(
                                                "w-4 h-4",
                                                i < Math.floor(rating) ? 'fill-primary' : 'fill-background-dark/20'
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-body-sm text-text">{reviewsCount} отзывов</span>
                            </div>

                            <h3 className="text-primary tablet:text-heading-sm text-heading-xs! leading-[0.9]!">{title}</h3>
                            <p className="text-text text-body-sm line-clamp-4">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex pt-3 bg-background flex-col col-span-3 px-5 tablet:pl-0 tablet:pr-8 tablet:pb-7 pb-4">
                    {button && (
                        <BaseButton
                            variant={button.variant}
                            as={Link}
                            to={`/place/${id}`}
                            onClick={button.onClick}
                            className={clsx('self-end mt-auto w-full min-w-full tablet:min-w-auto max-w-none', button.className)}
                            title={button.title}
                        />
                    )}
                </div>

                {verifiedDate && (
                    <div className="absolute top-0 right-0 w-full">
                        <VerifiedDateBadge verifiedDate={verifiedDate} />
                    </div>
                )}
            </div>
        </div>
    )
}