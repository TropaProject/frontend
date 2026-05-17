// entities/route/ui/RouteDetailsMapContainer.tsx
import RouteMap from '@/entities/route/ui/RouteMap';
import { useRouteMap } from '@/features/yandex-map/hooks/useRouteMap';
import type { YMapCoordinates } from '@/features/yandex-map/model/types';

interface RouteDetailsMapContainerProps {
    points: YMapCoordinates[];
    className?: string;
}

export const RouteDetailsMapContainer = ({ points, className }: RouteDetailsMapContainerProps) => {
    const { containerRef, isMapLoaded, error } = useRouteMap({ points });

    return (
        <RouteMap
            containerRef={containerRef}
            isMapLoaded={isMapLoaded}
            error={error}
            className={className}
        />
    );
};