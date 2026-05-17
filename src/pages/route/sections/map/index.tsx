// pages/route/sections/map/index.tsx
import { RouteDetailsMapContainer } from '@/entities/route/ui/RouteDetailsMapContainer';
import type { YMapCoordinates } from '@/features/yandex-map/model/types';

interface RouteMapSectionProps {
    points: YMapCoordinates[];
}

export const RouteMapSection = ({ points }: RouteMapSectionProps) => {
    return <RouteDetailsMapContainer points={points} className="my-6" />;
};