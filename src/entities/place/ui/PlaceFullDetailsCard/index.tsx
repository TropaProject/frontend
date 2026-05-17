// src/entities/place/ui/PlaceFullDetailsCard/index.tsx
import clsx from 'clsx'
import { BorderWrapper } from '@/shared/components/wrappers/BorderWrapper'
import RouteInfoBorder from '@/pages/route/sections/hero/assets/borders/RouteInfoBorder'
import SawBorder from '@/shared/assets/borders/SawBorder'
import PlaceBadgesList from '@/shared/components/ui/badges/PlaceBadgesList'
import VerifiedDateBadge from '@/shared/components/ui/badges/VerifiedDateBadge'
import { PlaceRating } from '@/entities/place/ui/atoms/PlaceRating'
import GeoIconSimple from '@/entities/place/ui/PlaceFullDetailsCard/assets/icons/GeoIconSimple'
import TrainIcon from '@/entities/place/ui/PlaceFullDetailsCard/assets/icons/TrainIcon'
import WalletIcon from '@/entities/place/ui/PlaceFullDetailsCard/assets/icons/WalletIcon'

import type { FullPlaceDetails } from '@/entities/place/model/types'
import { FavoriteButton } from '@/entities/place/ui/atoms/FavoriteButton'
import { buildYandexPointUrl } from '@/shared/lib/formatYandexMapsLinks'
import { useState } from 'react'
import { WorkingHoursModal } from '@/widgets/WorkingHoursModal/ui/WorkingHoursModal'
import InfoIcon from '@/shared/assets/icons/InfoIcon'

interface PlaceFullDetailsProps extends Partial<FullPlaceDetails> {
    className?: string
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
}

export default function PlaceFullDetailsCard({
    title = '',
    description = '',
    rating = 0,
    reviewsCount = 0,
    verifiedDate,
    badgeTypes = [],
    address = '',
    metro = '',
    budgetText = '',
    fullWorkingHours,
    coordinates,

    isFavorite = false,
    onToggleFavorite,
    className,
}: PlaceFullDetailsProps) {

    const yandexMapsUrl = coordinates ? buildYandexPointUrl(coordinates) : null;
    const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);

    return (
        <section className={clsx('relative flex flex-col w-full text-text desktop:max-w-204', className)}>
            <BorderWrapper className="z-0" borderComponent={RouteInfoBorder} />

            <div className='z-10 relative flex flex-col px-6 pb-8 pt-15 desktop:px-10 desktop:pt-8 desktop:pb-4 gap-7 desktop:min-h-90 desktop:max-h-[32rem]'>
                {(badgeTypes.length > 0 || verifiedDate) && (
                    <div className="flex flex-row w-full items-center justify-between">
                        <PlaceBadgesList badges={badgeTypes} className="hidden desktop:flex" />
                        {verifiedDate && (
                            <VerifiedDateBadge
                                variant='primary'
                                verifiedDate={verifiedDate}
                                className='max-w-none desktop:max-w-max'
                            />
                        )}
                    </div>
                )}

                <div className="relative grid grid-cols-1 desktop:grid-cols-8 desktop:grid-rows-[1fr_auto] gap-y-5 desktop:gap-x-5 h-full">
                    <div className="desktop:col-span-5 flex flex-col gap-2 min-w-0">
                        <h1 className="text-secondary text-heading-lg desktop:text-heading-3xl leading-[0.9]!">
                            {title.toUpperCase()}
                        </h1>
                        <div className="flex gap-4 items-center">
                            <FavoriteButton
                                isFavorite={isFavorite}
                                onToggle={onToggleFavorite ?? (() => { })}
                            />
                            <PlaceRating rating={rating} reviewsCount={reviewsCount} />
                        </div>
                        <p className="text-body-base text-text mt-2 line-clamp-4">
                            {description}
                        </p>
                    </div>

                    {fullWorkingHours && (
                        <>
                            <div className="desktop:order-none desktop:col-span-3 desktop:row-span-2 relative flex flex-col py-6 px-8 desktop:py-8 tablet:pr-10 desktop:px-12 desktop:min-w-60 sm:max-w-max justify-center items-center text-center self-stretch">
                                <BorderWrapper borderComponent={SawBorder} />
                                <div className="relative z-10 flex flex-row desktop:flex-col gap-6 desktop:gap-4 w-full justify-between text-start desktop:mt-4">
                                    <div className="flex flex-col items-start tablet:gap-2">
                                        <span className="text-heading-sm tablet:text-heading-md desktop:text-heading-lg text-primary leading-none">
                                            {fullWorkingHours.status}
                                        </span>
                                        <span className="text-body-xs text-secondary/60">График работы</span>
                                    </div>
                                    <div className="flex flex-col items-start tablet:gap-2">
                                        <span className="text-heading-sm tablet:text-heading-md desktop:text-heading-lg text-primary leading-none">
                                            {fullWorkingHours.time}
                                        </span>
                                        <span className="text-body-xs text-secondary/60">{fullWorkingHours.timeLabel}</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsHoursModalOpen(true)}
                                    className="text-body-xs gap-1 inline-flex items-center text-secondary/60 hover:text-text transition-colors underline decoration-dotted underline-offset-2 mt-4 desktop:mt-6"
                                >
                                    <InfoIcon className='size-3.5' />
                                    Подробнее
                                </button>
                            </div>
                            <WorkingHoursModal
                                isOpen={isHoursModalOpen}
                                onClose={() => setIsHoursModalOpen(false)}
                                schedule={fullWorkingHours.schedule}
                                placeName={title}
                            />
                        </>
                    )}

                    {(address || metro || budgetText || coordinates) && (
                        <div className="desktop:order-none desktop:col-span-5 flex flex-row gap-4 desktop:gap-8">
                            {(address || coordinates) && yandexMapsUrl ? (
                                <a
                                    href={yandexMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col desktop:flex-row group items-center gap-1 text-primary"
                                >
                                    <GeoIconSimple className="size-5 desktop:size-6" />
                                    <span className="text-body-xs group-hover:underline decoration-1 underline-offset-2">{address || 'Открыть в Яндекс.Картах'}</span>
                                </a>
                            ) : (
                                address && (
                                    <div className="flex flex-col desktop:flex-row items-center gap-1 text-primary">
                                        <GeoIconSimple className="size-5 desktop:size-6" />
                                        <span className="text-body-xs">{address}</span>
                                    </div>
                                )
                            )}
                            {metro && (
                                <div className="flex flex-col desktop:flex-row items-center gap-1 text-primary">
                                    <TrainIcon className="size-5 desktop:size-6" />
                                    <span className="text-body-xs">{metro}</span>
                                </div>
                            )}
                            {budgetText && (
                                <div className="flex flex-col desktop:flex-row items-center gap-1 text-primary">
                                    <WalletIcon className="size-5 desktop:size-6" />
                                    <span className="text-body-xs">{budgetText}</span>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </section>
    )
}