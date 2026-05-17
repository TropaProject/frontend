import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { SwiperProps } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import clsx from 'clsx';

import BaseButton from '@/shared/components/ui/buttons/BaseButton';
import SliderButtonBg from '@/pages/create-route/sections/quiz/assets/backgrounds/SliderButtonBg';
import ArrowIcon from '@/shared/assets/icons/ArrowIcon';

import 'swiper/css';
import 'swiper/css/pagination';
import { Loader } from '@/shared/lib/feedback/Loader';
import { EmptyState } from '@/shared/lib/feedback/EmptyState';

interface BaseSliderProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    className?: string;
    slideClassName?: string;
    navigationClassName?: string;
    swiperProps?: SwiperProps;

    // Header & Controls
    title?: string;
    description?: string;
    showNavigation?: boolean;
    showPagination?: boolean;

    // Стилизация
    titleClassName?: string;
    descriptionColor?: string;
    arrowColor?: string;
    buttonBgColor?: string;
    onSlideChange?: (index: number) => void;

    onBeforeInit?: (swiper: SwiperType) => void;

    // Состояния
    loading?: boolean;
    loadingMessage?: string;

    // Empty state
    emptyMessage?: string;
    emptyActionLabel?: string;
    emptyActionTo?: string;
    onEmptyActionClick?: () => void;

    // пагинация
    hasMore?: boolean;
    onLoadMore?: () => void;
    loadMoreLoading?: boolean;
    loadMoreButtonText?: string;
}

export default function BaseSlider<T>({
    items,
    renderItem,
    className,
    slideClassName,
    navigationClassName,
    swiperProps,
    title,
    description,
    showNavigation = false,
    showPagination = false,
    titleClassName = 'text-primary',
    descriptionColor = 'text-text',
    arrowColor = 'text-background',
    buttonBgColor = 'text-primary',
    onSlideChange,
    onBeforeInit,

    loading = false,
    loadingMessage = 'Загрузка...',

    emptyMessage = 'Тут ничего нет :(',
    emptyActionLabel,
    emptyActionTo,
    onEmptyActionClick,

    hasMore = false,
    onLoadMore,
    loadMoreLoading = false,
    loadMoreButtonText = 'Загрузить ещё'
}: BaseSliderProps<T>) {
    const swiperRef = useRef<SwiperType | null>(null);
    const uniqueId = useId().replace(/:/g, '');
    const paginationClass = `js-pagination-${uniqueId}`;

    const allItems = useMemo(() => {
        if (!hasMore) return items;
        return [...items, null];
    }, [items, hasMore]);

    const [shouldMaintainPosition, setShouldMaintainPosition] = useState(false);
    const lastActiveIndexRef = useRef(0);

    useEffect(() => {
        if (loadMoreLoading) {
            lastActiveIndexRef.current = swiperRef.current?.activeIndex || 0;
            setShouldMaintainPosition(true);
        }
    }, [loadMoreLoading]);

    useEffect(() => {
        if (!loadMoreLoading && shouldMaintainPosition && swiperRef.current) {
            setTimeout(() => {
                swiperRef.current?.slideTo(lastActiveIndexRef.current);
                setShouldMaintainPosition(false);
            }, 50);
        }
    }, [loadMoreLoading, shouldMaintainPosition]);

    const renderWithLoadMore = (item: T | null, index: number) => {
        if (item === null && hasMore) {
            return (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                    <BaseButton
                        onClick={onLoadMore}
                        loading={loadMoreLoading}
                        title={loadMoreButtonText}
                        variant="primary"
                        size="lg"
                        className="min-w-40 w-full max-w-none!"
                    />
                </div>
            );
        }
        return renderItem(item as T, index);
    };


    return (
        <div className={clsx('w-full flex flex-col gap-6', className)}>
            {description && (
                <p className={clsx('tablet:hidden block -mt-3 text-body-sm max-w-3/5 transition-colors duration-500', descriptionColor)}>
                    {description}
                </p>
            )}

            {(title || showNavigation) && (
                <div className="flex items-end justify-between w-full z-10 gap-4 pr-2.5 desktop:pr-0">
                    {description && (
                        <p className={clsx('tablet:block hidden text-body-sm lg:text-body-lg tablet:max-w-2/5 lg:max-w-1/3 transition-colors duration-500', descriptionColor)}>
                            {description}
                        </p>
                    )}

                    <div className={clsx(description && 'max-w-max tablet:ml-auto mr-6', "w-full flex flex-col gap-4")}>
                        {title && (
                            <h2 className={clsx(titleClassName, 'w-full text-heading-md desktop:text-heading-lg! transition-colors duration-500')}>
                                {title}
                            </h2>
                        )}
                    </div>

                    {showNavigation && items.length > 0 && (
                        <div className={clsx(navigationClassName, 'flex gap-2.5')}>
                            <BaseButton
                                type="button"
                                onClick={() => swiperRef.current?.slidePrev()}
                                leftIcon={<ArrowIcon className={clsx('rotate-180 transition-colors duration-500', arrowColor)} />}
                                customBg={
                                    <SliderButtonBg className={clsx('absolute inset-0 w-full h-full transition-colors duration-500', buttonBgColor)} preserveAspectRatio='none' />
                                }
                                className='min-w-8 p-0 min-h-8 h-8 w-8 *:p-0 shadow-none border-none'
                            />
                            <BaseButton
                                type="button"
                                onClick={() => swiperRef.current?.slideNext()}
                                leftIcon={<ArrowIcon className={clsx('transition-colors duration-500', arrowColor)} />}
                                customBg={
                                    <SliderButtonBg className={clsx('absolute inset-0 w-full h-full transition-colors duration-500', buttonBgColor)} preserveAspectRatio='none' />
                                }
                                className='min-w-8 p-0 min-h-8 h-8 w-8 *:p-0 shadow-none border-none'
                            />
                        </div>
                    )}
                </div>
            )}

            {loading ? (
                <Loader message={loadingMessage} className="py-12 self-center" />
            ) : items.length === 0 ? (
                <EmptyState
                    message={emptyMessage}
                    actionLabel={emptyActionLabel}
                    actionTo={emptyActionTo}
                    onClick={onEmptyActionClick}
                />
            ) : (
                <Swiper
                    modules={[Pagination, Navigation]}
                    onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                        onBeforeInit?.(swiper);
                    }}
                    onSlideChange={(swiper) => onSlideChange?.(swiper.activeIndex)}
                    pagination={showPagination ? {
                        clickable: true,
                        el: `.${paginationClass}`,
                        renderBullet: (_, className) => {
                            return `<button class="custom-bullet ${className}">
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.33984 0.537109L8.36328 0.535156C12.7128 0.11024 15.6011 3.64746 15.6172 7.62695C15.3089 9.95915 14.4716 11.8423 13.2344 13.1377C11.9987 14.4313 10.3377 15.1679 8.31543 15.168C6.27069 15.168 4.28853 14.4545 2.90137 13.1738C1.52653 11.9045 0.714202 10.0612 1.00879 7.72266L1.01269 7.69141L1.01269 7.66016C1.01276 5.20109 1.8408 3.4392 3.13086 2.28711C4.42988 1.12706 6.25196 0.537109 8.31543 0.537109L8.33984 0.537109Z" fill="currentColor" stroke="#3A3B70"/>
                            </svg>
                        </button>`;
                        }
                    } : false}
                    {...swiperProps}
                    className={clsx('w-full !overflow-visible', swiperProps?.className)}
                >
                    {allItems.map((item, index) => (
                        <SwiperSlide key={index} className={clsx(slideClassName, 'backface-hidden! transform-gpu! transform-3d!')}>
                            {renderWithLoadMore(item, index)}
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {showPagination && items.length > 0 && (
                <div className={clsx(paginationClass, 'hidden desktop:flex justify-center gap-1')} />
            )}

            <style>{`
                .custom-bullet {
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: transparent !important;
                    width: auto !important;
                    height: auto !important;
                    margin: 0 !important;
                    opacity: 1;
                    color: #FF3F6C;
                }
                .custom-bullet svg { width: 17px; height: 16px; transition: transform 0.3s ease; }
                .custom-bullet.swiper-pagination-bullet-active svg { transform: scale(1); }
                .custom-bullet:not(.swiper-pagination-bullet-active) svg { transform: scale(0.6); }
                .custom-bullet:hover svg { transform: scale(0.8); }
                .${paginationClass}.swiper-pagination-lock { display: none !important; }
            `}</style>
        </div>
    );
}