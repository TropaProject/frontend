// entities/route/ui/InteractiveMapContainer.tsx
import RouteMap from '@/entities/route/ui/RouteMap';
import { useInteractiveMap } from '@/features/yandex-map/hooks/useInteractiveMap';
import { useCreateRouteStore } from '@/features/create-route/model/store';
import type { YMapCoordinates, CityBounds } from '@/features/yandex-map/model/types';

interface InteractiveMapContainerProps {
    initialCenter?: YMapCoordinates;
    zoom?: number;
    cityBounds?: CityBounds | null;
    onCoordinatesChange?: (coordinates: YMapCoordinates, address: string) => void;
    className?: string;
}

export const InteractiveMapContainer = ({
    initialCenter,
    zoom,
    cityBounds,
    onCoordinatesChange,
    className,
}: InteractiveMapContainerProps) => {
    const selectedCityId = useCreateRouteStore((state) => state.formData.cityId);
    const { containerRef, isMapLoaded, error } = useInteractiveMap({
        initialCenter,
        zoom,
        cityBounds,
        onCoordinatesChange,
    });

    const finalError = !selectedCityId ? "Сначала выберите город" : error;

    return (
        <RouteMap
            containerRef={containerRef}
            isMapLoaded={isMapLoaded}
            error={finalError}
            className={className}
        />
    );
};