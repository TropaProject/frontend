// features/yandex-map/hooks/useRouteMap.ts
import { useYandexMap } from '@/features/yandex-map/hooks/useYandexMap';
import { DEFAULT_MARKER_SVG, START_MARKER_SVG } from '@/features/yandex-map/lib/mapStyles';
import type { YMapCoordinates } from '@/features/yandex-map/model/types';
import { useEffect } from 'react';

interface UseRouteMapProps {
    points: YMapCoordinates[];
    center?: YMapCoordinates;
    zoom?: number;
}

export const useRouteMap = ({ points, center, zoom = 15 }: UseRouteMapProps) => {
    const { containerRef, isMapLoaded, error, addMarker, addPolyline, setCenter, clearAll } = useYandexMap({
        center: center || points[0] || { lat: 55.751244, lng: 37.618423 },
        zoom,
    });

    useEffect(() => {
        if (!isMapLoaded || points.length === 0) return;

        clearAll();

        if (points.length > 0) {
            setCenter(points[0]);
        }

        points.forEach((point, index) => {
            addMarker({
                coordinates: point,
                icon: index === 0 ? START_MARKER_SVG : DEFAULT_MARKER_SVG,
                size: index === 0 ? 32 : 24,
                label: point.name,
            });
        });

        if (points.length > 1) {
            addPolyline(points, '#ff3f6c');
        }
    }, [isMapLoaded, points, addMarker, addPolyline, setCenter, clearAll]);

    return {
        containerRef,
        isMapLoaded,
        error,
    };
};