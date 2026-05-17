// src/shared/components/ui/badges/PlaceBadgesList/index.tsx
import type { ReactNode } from 'react'
import clsx from 'clsx'
import DevelopersChoiceIcon from '@/pages/route/sections/places/assets/icons/DevelopersChoiceIcon'
import PopularIcon from '@/pages/route/sections/places/assets/icons/PopularIcon'
import GemIcon from '@/pages/route/sections/places/assets/icons/GemIcon'
import type { PlaceBadgeType } from '@/entities/place'

interface PlaceBadgesListProps {
    badges?: PlaceBadgeType[]
    className?: string
}

const BADGE_CONFIG: Record<PlaceBadgeType, { icon: ReactNode, label: string }> = {
    developers_choice: {
        icon: <DevelopersChoiceIcon className='ml-2 max-w-4 desktop:max-w-8' />,
        label: 'Выбор разработчиков'
    },
    popular_today: {
        icon: <PopularIcon className='ml-1 max-w-5 desktop:max-w-12' />,
        label: 'Популярно сегодня'
    },
    local_gem: {
        icon: <GemIcon className='ml-2 max-w-4 desktop:max-w-8' />,
        label: 'Местная жемчужина'
    }
}

export default function PlaceBadgesList({ badges = [], className }: PlaceBadgesListProps) {
    if (!badges || badges.length === 0) return null

    return (
        <ul className={clsx(
            'flex flex-col-reverse items-end sm:items-start lg:items-stretch lg:flex-row gap-1.5 desktop:gap-6',
            className
        )}>
            {badges.map((type) => {
                const config = BADGE_CONFIG[type]
                if (!config) return null

                return (
                    <li
                        key={type}
                        className="relative flex items-center h-6.5 lg:h-auto gap-1.5 bg-secondary rounded-lg lg:px-2 desktop:px-5 desktop:py-3 pr-2 py-1 max-w-max"
                    >
                        <span className="static desktop:absolute -left-0 -top-0 desktop:-translate-1/2 text-background text-xl">
                            {config.icon}
                        </span>
                        <span className="text-body-sm leading-0 desktop:leading-[1.2] text-nowrap text-background">
                            {config.label}
                        </span>
                    </li>
                )
            })}
        </ul>
    )
}