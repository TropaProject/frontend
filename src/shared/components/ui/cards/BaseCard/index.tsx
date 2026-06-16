// @/shared/components/BaseCard
import clsx from 'clsx'
import BaseCardBorder from '@/shared/components/ui/cards/BaseCard/assets/borders/BaseCardBorder'
import type { ReactNode } from 'react'
import { BorderWrapper } from '@/shared/components/wrappers/BorderWrapper'
import NewCitySawBorder from '@/pages/create-route/sections/quiz/assets/borders/NewCitySawBorder'

interface BaseCardProps {
    title?: string
    description?: string
    image: string
    className?: string
    onClick?: () => void
    borderColor?: string
    borderType?: 'default' | 'saw' | 'combined'
    children?: ReactNode
}

export default function BaseCard({
    title,
    description,
    image,
    className,
    onClick,
    borderColor,
    borderType = 'default',
    children
}: BaseCardProps) {
    return (
        <div
            className={clsx(
                "relative transition-transform duration-300 w-full h-full ",
                className,
                'xs:pl-1.5 xs:pr-2 min-h-55! desktop:pl-0.75 pl-1 pr-1 desktop:pr-1.5 py-1 desktop:pt-0.5',
                onClick ? 'group hover:scale-99 cursor-pointer' : ''
            )}
            onClick={onClick}
        >
            <div className="flex flex-col h-full relative bg-background rounded-2xl">
                <div className={clsx(
                    !(title || description) ? 'rounded-2xl' : 'rounded-t-2xl',
                    "relative h-full -rotate-1 overflow-hidden"
                )}>
                    <img
                        src={image || '/place.jpg'}
                        alt={title}
                        className="w-full h-full object-cover "
                        onError={(e) => {
                            if ((e.target as HTMLImageElement).src !== '/place.jpg') {
                                (e.target as HTMLImageElement).src = '/place.jpg';
                            }
                        }}
                    />
                </div>

                {(title || description) && (
                    <div className="flex flex-col justify-center pt-2 px-5 group-hover:translate-x-1 transition-transform duration-300">
                        {title && (
                            <h3 className="text-heading-sm text-primary">
                                {title}
                            </h3>
                        )}
                        {description && (
                            <p className='desktop:text-body-sm text-body-xs leading-none mb-5 text-text'>
                                {description}
                            </p>
                        )}
                    </div>
                )}

                {children}


                {(borderType === 'saw' || borderType === 'combined') && (
                    <BorderWrapper
                        borderComponent={NewCitySawBorder}
                        className={clsx(borderColor, 'z-100 object-cover scale-110')}
                    />
                )}
            </div>

            {(borderType === 'default' || borderType === 'combined') && (
                <BorderWrapper
                    borderComponent={BaseCardBorder}
                    className={clsx(borderColor, 'z-50')}
                />
            )}
        </div>
    )
}