// shared/components/ui/sliders/EntitySlider/EntitySlider.tsx
import { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { useScreenSize } from '@/shared/hooks/useScreenSize';
import { useScroll, useSpring } from 'framer-motion';
import BaseSlider from '@/shared/components/ui/sliders/BaseSlider';
import type { EntityCardProps } from '@/shared/components/ui/cards/EntityCard/types';
import type { SwiperProps } from 'swiper/react';
import clsx from 'clsx';
import { EntitySliderItem } from '@/shared/components/ui/sliders/EntitySlider/ui/EntitySliderItem';

interface EntitySliderProps {
    items: EntityCardProps[];
    className?: string;
    rotateSlides?: boolean;
    withClothespins?: boolean;
    customBreakpoints?: SwiperProps['breakpoints'];
    slideClassName?: string;
    ref?: React.Ref<EntitySliderRef>;
    maxItems?: number;
    loading?: boolean

    hasMore?: boolean;
    onLoadMore?: () => void;
    loadMoreLoading?: boolean;
    loadMoreButtonText?: string
}

export interface EntitySliderRef {
    slideNext: () => void;
    slidePrev: () => void;
}

export const EntitySlider = ({
    items,
    className,
    rotateSlides = false,
    withClothespins = false,
    customBreakpoints,
    slideClassName,
    ref,
    maxItems,
    loading,

    hasMore = false,
    onLoadMore,
    loadMoreLoading = false,
    loadMoreButtonText
}: EntitySliderProps) => {
    const { isDesktop } = useScreenSize();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<EntitySliderRef>(null);

    useImperativeHandle(ref, () => ({
        slideNext: () => swiperRef.current?.slideNext(),
        slidePrev: () => swiperRef.current?.slidePrev(),
    }));

    useEffect(() => setHoveredIndex(null), [isDesktop]);

    const canAnimateRepulsion = rotateSlides && isDesktop;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'center center'],
    });

    const smoothScroll = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 15,
        restDelta: 0.001,
    });

    return (
        <div ref={containerRef} className="w-full">
            <BaseSlider
                items={maxItems ? items.slice(0, maxItems) : items}
                className={clsx(className, 'w-full max-w-mobile pl-2.5 desktop:pl-0')}
                slideClassName="!overflow-visible"
                onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                }}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={onLoadMore}
                loadMoreLoading={loadMoreLoading}
                loadMoreButtonText={loadMoreButtonText}
                swiperProps={{
                    spaceBetween: 10,
                    slidesPerView: 2,
                    autoHeight: false,
                    breakpoints: customBreakpoints || {
                        360: { slidesPerView: rotateSlides ? 1.8 : 2, spaceBetween: rotateSlides ? -10 : 10 },
                        560: { slidesPerView: 2, spaceBetween: rotateSlides ? -20 : 10 },
                        768: { slidesPerView: 3.5, spaceBetween: rotateSlides ? -60 : -50 },
                        1280: { slidesPerView: 4, spaceBetween: rotateSlides ? -10 : 10 },
                    },
                }}
                renderItem={(entity, index) => (
                    <div className='flex w-full h-full'>
                        <EntitySliderItem
                            key={entity.id || index}
                            entity={{
                                border: { variant: 'mobileSmall' },
                                ...entity
                            }}
                            index={index}
                            scrollProgress={smoothScroll}
                            withClothespins={withClothespins}
                            rotateSlides={rotateSlides}
                            canAnimateRepulsion={canAnimateRepulsion}
                            hoveredIndex={hoveredIndex}
                            setHoveredIndex={setHoveredIndex}
                            slideClassName={slideClassName}
                        />
                    </div>
                )}
            />
        </div>
    );
};