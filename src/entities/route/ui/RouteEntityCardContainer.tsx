// entities/route/ui/RouteEntityCardContainer.tsx
import EntityCard from '@/shared/components/ui/cards/EntityCard';
import type { RouteListItem } from '@/shared/api/user/types';
import { mapRouteToEntityCard } from '@/entities/route/lib/mapRouteToEntityCard';

interface RouteEntityCardContainerProps {
    route: RouteListItem;
    className?: string;
}

export const RouteEntityCardContainer = ({ route, className }: RouteEntityCardContainerProps) => {
    const props = mapRouteToEntityCard(route);

    return (
        <EntityCard
            {...props}
            className={className}
            button={{
                variant: 'secondary',
                title: 'Посмотреть маршрут',
                to: `/route/${route.route_id}`,
            }}
            border={{ color: 'text-text', variant: 'mobileSmall' }}
        />
    );
};