// src/shared/components/ui/cards/ReviewCard/index.tsx
import clsx from 'clsx'
import ReviewBorder from '@/pages/home/sections/reviews/assets/borders/ReviewBorder'
import { RatingStars } from '@/shared/components/ui/RatingStars'
import type { Review } from '@/entities/review/model/types'
import { BorderWrapper } from '@/shared/components/wrappers/BorderWrapper'
import UserIcon from '@/widgets/header/assets/icons/UserIcon'
import { Link } from 'react-router-dom'

interface ReviewCardProps extends Review {
    variant?: 'default' | 'notepad' | 'story'
    className?: string
    customBorderColor?: string
}

export const ReviewCard = ({
    userId,
    bgImage,
    nickName,
    description,
    userImage,
    rating,
    date,
    images = [],
    variant = 'default',
    customBorderColor,
    className
}: ReviewCardProps) => {
    const borderColor = customBorderColor || variant === 'notepad' ? 'text-primary' : 'text-text'
    const cardSizes = variant === 'notepad' ? 'desktop:px-8 desktop:pb-8 desktop:pt-12 px-4 pb-4 pt-8 max-w-min' : 'pl-6 pr-5 pt-6 pb-4 max-w-85'

    return (
        <li className={clsx("relative text-text flex flex-col w-full mt-1",
            description ? 'min-h-40' : 'min-h-24',
            variant === 'notepad' && "rotate-[0.5deg] mb-1",
            cardSizes,
            className
        )}>
            <div className="z-10 flex flex-col gap-4">
                <Link to={`/user/${userId}`} className="flex flex-row gap-2 z-20">
                    <div
                        className={clsx("-rotate-3 shrink-0 w-full h-full aspect-square object-cover rounded-[0.25rem]", !userImage && 'border border-text/90 rounded-xs', variant === 'notepad' ? 'max-w-12' : variant === 'story' ? "max-w-11.5" : "max-w-18")}
                    >
                        {userImage ? (
                            <img
                                src={userImage}
                                alt={nickName || 'User avatar'}
                                className='w-full h-full'
                            />
                        ) : (
                            <UserIcon className={clsx('w-full h-full absolute inset-0 scale-60 stroke-primary')} />
                        )}
                    </div>

                    <div className={clsx(variant === 'story' ? 'justify-center' : 'justify-start', "flex flex-col gap-0.5")}>
                        {rating !== undefined && <RatingStars rating={rating} starClassName="w-3 h-3" />}
                        <h4
                            className={clsx(variant === 'story' ? 'text-background' : 'mt-auto text-primary ', "text-body-sm! tablet:text-body-lg! leading-[0.98]!")}>
                            {nickName}
                        </h4>
                        {date && <span className="text-body-xs text-secondary/60 leading-none">{date}</span>}
                    </div>
                </Link>

                <p className="text-body-xs desktop:text-body-sm min-w-44 whitespace-pre-wrap">
                    {description}
                </p>

                {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                        {images.slice(0, 3).map((photo, idx) => (
                            <img
                                key={idx}
                                src={photo}
                                className="aspect-square object-cover rounded-[0.25rem] w-full max-w-25"
                                alt="review photo"
                            />
                        ))}
                    </div>
                )}
            </div>
            {variant === 'story' && (
                <div className='h-full w-full pt-1 pl-1.5 pr-1 left-0 absolute top-0'>
                    <div className='h-full w-full rounded-t-3xl  z-5' style={{
                        background: 'linear-gradient(0deg, rgba(0, 0, 0, 0) 76.87%, rgba(0, 0, 0, 0.3) 90.04%)'
                    }} />
                </div>
            )}


            {variant === 'story' && (
                <img src={bgImage} alt="" className='absolute inset-0 w-full h-full object-cover z-0 rounded-3xl p-1 pl-1.5' />
            )}



            {variant === 'notepad' ? (
                <BorderWrapper
                    className={`${borderColor} z-9`}
                    borderComponent={ReviewBorder}
                />
            ) : (
                <div className='w-full flex absolute inset-0 pl-1.5 pr-1 py-1 '>
                    <div className='relative flex w-full h-full'>
                        <div className={clsx(borderColor, 'absolute w-full h-full border rounded-2xl rotate-[0.5deg]')} />
                        <div className={clsx(borderColor, 'absolute w-full h-full border rounded-2xl -rotate-[0.5deg]')} />
                    </div>
                </div>
            )}
        </li>
    )
}