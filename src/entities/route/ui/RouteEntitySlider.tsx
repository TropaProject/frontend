// entities/route/ui/RouteEntitySlider.tsx
import type { RouteListItem } from '@/shared/api/user/types';
import { EntitySlider, type EntitySliderRef } from '@/shared/components/ui/sliders/EntitySlider/ui/EntitySlider';
import { mapRouteToEntityCard } from '@/entities/route/lib/mapRouteToEntityCard';
import type { SwiperProps } from 'swiper/react';

interface RouteEntitySliderProps {
    routes: RouteListItem[];
    className?: string;
    withClothespins?: boolean;
    maxItems?: number;
    ref?: React.Ref<EntitySliderRef>;
    customBreakpoints?: SwiperProps['breakpoints']
    loading?: boolean

    hasMore?: boolean;
    onLoadMore?: () => void;
    loadMoreLoading?: boolean;
}

export const RouteEntitySlider = ({ routes, ref, hasMore, onLoadMore, loadMoreLoading, ...props }: RouteEntitySliderProps) => {
    const items = routes.map(route => ({
        ...mapRouteToEntityCard(route),
        button: {
            variant: 'secondary' as const,
            title: 'Посмотреть маршрут',
            to: `/route/${route.route_id}`,
        },
    }));
    return <EntitySlider
        ref={ref}
        items={items}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        loadMoreLoading={loadMoreLoading}
        loadMoreButtonText="Больше маршрутов"
        {...props}
    />;
};