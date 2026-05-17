// features/yandex-map/hooks/useYandexMap.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import type { YMapCoordinates, YMapMarkerConfig } from '@/features/yandex-map/model/types';
import { loadYandexMaps } from '@/features/yandex-map/lib/loadScript';
import { useMapStyles } from '@/features/yandex-map/hooks/useMapStyles';

interface YMapInstance {
    addChild: (child: unknown) => void;
    removeChild: (child: unknown) => void;
    setLocation: (location: { center: [number, number]; zoom?: number }) => void;
    destroy: () => void;
}

export const useYandexMap = (
    { center = { lat: 55.751244, lng: 37.618423 }, zoom = 15 } = {}
) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<YMapInstance | null>(null);
    const childrenRef = useRef<unknown[]>([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { createStyledLayer } = useMapStyles();

    useEffect(() => {
        let cancelled = false;
        const init = async () => {
            try {
                await loadYandexMaps();
                if (cancelled || !containerRef.current) return;
                const w = window as unknown as { ymaps3?: { ready: Promise<void>; YMap: new (el: HTMLElement, opts: Record<string, unknown>) => YMapInstance; YMapDefaultSchemeLayer: new () => unknown; YMapDefaultFeaturesLayer: new (opts?: Record<string, unknown>) => unknown; }; };
                if (!w.ymaps3) throw new Error('ymaps3 not found');
                await w.ymaps3.ready;
                const map = new w.ymaps3.YMap(containerRef.current, {
                    location: { center: [center.lng, center.lat], zoom },
                });
                const styledLayer = createStyledLayer();
                map.addChild(styledLayer ?? new w.ymaps3.YMapDefaultSchemeLayer());
                map.addChild(new w.ymaps3.YMapDefaultFeaturesLayer({ zIndex: 1800 }));
                mapRef.current = map;
                if (!cancelled) setIsMapLoaded(true);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to init map');
            }
        };
        init();
        return () => { cancelled = true; mapRef.current?.destroy(); mapRef.current = null; };
    }, []);

    const setCenter = useCallback((c: YMapCoordinates) => {
        mapRef.current?.setLocation({ center: [c.lng, c.lat] });
    }, []);

    const onMapClick = useCallback((callback: (coords: YMapCoordinates) => void) => {
        if (!mapRef.current) return;
        const w = window as unknown as { ymaps3?: { YMapListener: new (opts: Record<string, unknown>) => unknown } };
        if (!w?.ymaps3?.YMapListener) return;

        const listener = new w.ymaps3.YMapListener({
            layer: 'any',
            onClick: (_: unknown, event: { coordinates: [number, number] }) => {
                if (event?.coordinates) {
                    const [lng, lat] = event.coordinates;
                    callback({ lat, lng });
                }
            },
        });

        mapRef.current.addChild(listener);

        return () => {
            try {
                mapRef.current?.removeChild(listener);
            } catch { /* ok */ }
        };
    }, []);

    const addMarker = useCallback((config: YMapMarkerConfig) => {
        if (!mapRef.current) return;
        const w = window as unknown as { ymaps3?: { YMapMarker: new (opts: Record<string, unknown>, el?: HTMLElement) => { destroy: () => void; update: (opts: Record<string, unknown>) => void; } } };
        if (!w?.ymaps3?.YMapMarker) return;
        const size = config.size || 32;
        const container = document.createElement('div');
        container.style.cssText = 'display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-115%);';
        if (config.icon) {
            const iconWrapper = document.createElement('div');
            iconWrapper.style.cssText = `width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(-2px 3px 3px #3a3b7040);`;
            iconWrapper.innerHTML = String(config.icon);
            container.appendChild(iconWrapper);
        }
        if (config.label) {
            const label = document.createElement('span');
            label.style.cssText = "position:absolute;bottom:0;right:-0.25rem;transform:translateX(100%);font-family:'Vertiger','Arial',sans-serif;font-size:2rem;font-weight:400;line-height:0.8;color:#3A3B70;white-space:nowrap;";
            label.textContent = config.label;
            container.appendChild(label);
        }
        const marker = new w.ymaps3.YMapMarker(
            { coordinates: [config.coordinates.lng, config.coordinates.lat], draggable: config.draggable ?? false },
            container
        );
        mapRef.current.addChild(marker);
        childrenRef.current.push(marker);

        if (config.onDragEnd && config.draggable) {
            let dragged = false;
            const onDown = () => { dragged = false; };
            const onUp = async () => {
                if (!dragged) return;
                const coords = (marker as unknown as { getCoordinates: () => { coordinates: [number, number] } }).getCoordinates?.();
                if (coords?.coordinates) {
                    const [lng, lat] = coords.coordinates;
                    config.onDragEnd?.({ lat, lng });
                }
            };
            container.addEventListener('pointerdown', onDown);
            container.addEventListener('pointerup', onUp);
            container.addEventListener('pointermove', () => { dragged = true; });
        }
        return marker;
    }, []);

    const addPolyline = useCallback((points: YMapCoordinates[], color = '#ff3f6c') => {
        if (!mapRef.current) return;
        const w = window as unknown as { ymaps3?: { YMapFeature: new (opts: Record<string, unknown>) => unknown } };
        if (!w?.ymaps3?.YMapFeature) return;
        const feature = new w.ymaps3.YMapFeature({
            geometry: { type: 'LineString', coordinates: points.map(p => [p.lng, p.lat]) },
            style: { stroke: [{ color, width: 2, opacity: 1, dash: [8, 6], lineCap: 'butt' }] },
        });
        mapRef.current.addChild(feature);
        childrenRef.current.push(feature);
        return feature;
    }, []);

    const clearAll = useCallback(() => {
        childrenRef.current.forEach(ch => { try { mapRef.current?.removeChild(ch); } catch { /* ok */ } });
        childrenRef.current = [];
    }, []);

    return { containerRef, isMapLoaded, error, addMarker, addPolyline, setCenter, clearAll, onMapClick };
};