// features/yandex-map/hooks/useMapStyles.ts
import { useCallback } from 'react';
import { CUSTOM_MAP_STYLES } from '@/features/yandex-map/lib/mapStyles';

export const useMapStyles = () => {
    const createStyledLayer = useCallback(() => {
        const w = window as unknown as {
            ymaps3?: {
                YMapDefaultSchemeLayer: new (opts?: Record<string, unknown>) => unknown;
            };
        };
        if (!w.ymaps3) return null;

        try {
            return new w.ymaps3.YMapDefaultSchemeLayer({
                customization: CUSTOM_MAP_STYLES,
            });
        } catch {
            return null;
        }
    }, []);

    return { createStyledLayer };
};