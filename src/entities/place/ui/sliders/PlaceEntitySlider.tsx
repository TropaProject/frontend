// entities/place/ui/PlaceEntitySlider.tsx
import type { FavoritePointDTO } from '@/shared/api/point/types';
import type { SwiperProps } from 'swiper/react';
import { EntitySlider, type EntitySliderRef } from '@/shared/components/ui/sliders/EntitySlider/ui/EntitySlider';
import { mapPlaceToEntityCard } from '@/entities/place/lib/mapPlaceToEntityCard';

interface PlaceEntitySliderProps {
    places: FavoritePointDTO[];
    className?: string;
    rotateSlides?: boolean;
    customBreakpoints?: SwiperProps['breakpoints'];
    maxItems?: number;
    ref?: React.Ref<EntitySliderRef>;

    slideClassName?: string
}

export const PlaceEntitySlider = ({ places, ref, ...props }: PlaceEntitySliderProps) => {
    const items = places.map(place => ({
        ...mapPlaceToEntityCard(place),
        button: {
            variant: 'secondary' as const,
            title: 'Подробнее о месте',
            to: `/place/${place.id}`,
        },
    }));
    return <EntitySlider ref={ref} maxItems={12} items={items} {...props} />;
};