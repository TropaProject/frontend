// features/yandex-map/hooks/useInteractiveMap.ts
import { useEffect, useCallback, useState, useRef } from 'react';
import { useYandexMap } from '@/features/yandex-map/hooks/useYandexMap';
import { YANDEX_MAPS_API_KEY } from '@/shared/lib/config';
import { DEFAULT_MARKER_SVG } from '@/features/yandex-map/lib/mapStyles';
import type { YMapCoordinates } from '@/features/yandex-map/model/types';

interface GeocodeResult {
    coordinates: YMapCoordinates;
    address: string;
}

interface UseInteractiveMapProps {
    initialCenter?: YMapCoordinates;
    zoom?: number;
    cityBounds?: { min_lat: number; max_lat: number; min_lon: number; max_lon: number } | null;
    onCoordinatesChange?: (coordinates: YMapCoordinates, address: string) => void;
}

const GEOCODE_BASE = `https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_MAPS_API_KEY}&format=json&lang=ru_RU`;
const DEBOUNCE_MS = 300;

export const useInteractiveMap = ({
    initialCenter = { lat: 55.751244, lng: 37.618423 },
    zoom = 12,
    cityBounds,
    onCoordinatesChange,
}: UseInteractiveMapProps = {}) => {
    const { containerRef, isMapLoaded, error, addMarker, setCenter, clearAll, onMapClick } = useYandexMap({ center: initialCenter, zoom });

    const [address, setAddress] = useState('');
    const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);
    const initializedRef = useRef(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

    const isWithinBounds = useCallback((coords: YMapCoordinates): boolean => {
        if (!cityBounds) return true;
        const { lat, lng } = coords;
        return lat >= cityBounds.min_lat && lat <= cityBounds.max_lat && lng >= cityBounds.min_lon && lng <= cityBounds.max_lon;
    }, [cityBounds]);

    const fetchJson = useCallback(async (url: string) => {
        const res = await fetch(url);
        return res.json();
    }, []);

    const extractAddress = useCallback((data: unknown): string => {
        const geoObjects = (data as { response?: { GeoObjectCollection?: { featureMember?: Array<{ GeoObject: { metaDataProperty: { GeocoderMetaData: { text: string } } } }> } } }).response?.GeoObjectCollection?.featureMember;
        if (geoObjects?.length) return geoObjects[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
        return '';
    }, []);

    const extractGeocodeResults = useCallback((data: unknown): GeocodeResult[] => {
        const geoObjects = (data as { response?: { GeoObjectCollection?: { featureMember?: Array<{ GeoObject: { Point: { pos: string }; metaDataProperty: { GeocoderMetaData: { text: string } } } }> } } }).response?.GeoObjectCollection?.featureMember;
        if (!geoObjects?.length) return [];
        return geoObjects
            .map(geo => {
                const [lng, lat] = geo.GeoObject.Point.pos.split(' ').map(Number);
                return { coordinates: { lat, lng }, address: geo.GeoObject.metaDataProperty.GeocoderMetaData.text };
            })
            .filter(r => isWithinBounds(r.coordinates));
    }, [isWithinBounds]);

    const reverseGeocode = useCallback(async (coords: YMapCoordinates): Promise<string> => {
        try {
            const data = await fetchJson(`${GEOCODE_BASE}&geocode=${coords.lng},${coords.lat}`);
            return extractAddress(data) || `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
        } catch {
            return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
        }
    }, [fetchJson, extractAddress]);

    const geocode = useCallback(async (query: string): Promise<GeocodeResult[]> => {
        if (query.trim().length < 2) return [];
        setIsSearching(true);
        try {
            const data = await fetchJson(`${GEOCODE_BASE}&geocode=${encodeURIComponent(query)}&results=5`);
            return extractGeocodeResults(data);
        } catch {
            return [];
        } finally {
            setIsSearching(false);
        }
    }, [fetchJson, extractGeocodeResults]);

    const placeMarker = useCallback(async (coords: YMapCoordinates) => {
        if (!isMapLoaded || !isEnabled) return;
        if (!isEnabled) {
            setErrorMessage('Сначала выберите город');
            return;
        }
        if (!isWithinBounds(coords)) {
            setErrorMessage('Точка находится за пределами выбранного города');
            return;
        }

        setErrorMessage('');
        clearAll();

        setCenter(coords);

        const addr = await reverseGeocode(coords);
        setAddress(addr);
        onCoordinatesChange?.(coords, addr);
        setSearchResults([]);

        clearAll();
        addMarker({
            coordinates: coords,
            icon: DEFAULT_MARKER_SVG,
            size: 40,
            draggable: true,
            label: addr,
            onDragEnd: async (newCoords) => {
                if (!isWithinBounds(newCoords)) {
                    setErrorMessage('Метка должна быть в пределах города');
                    return;
                }
                setErrorMessage('');
                setCenter(newCoords);
                const newAddr = await reverseGeocode(newCoords);
                setAddress(newAddr);
                onCoordinatesChange?.(newCoords, newAddr);
            },
        });
    }, [isMapLoaded, isEnabled, isWithinBounds, clearAll, addMarker, setCenter, reverseGeocode, onCoordinatesChange]);

    const searchAddress = useCallback((query: string) => {
        if (!isEnabled) {
            setErrorMessage('Сначала выберите город');
            setSearchResults([]);
            return;
        }
        clearTimeout(debounceRef.current!);
        if (query.trim().length < 2) { setSearchResults([]); return; }
        debounceRef.current = setTimeout(async () => setSearchResults(await geocode(query)), DEBOUNCE_MS);
    }, [isEnabled, geocode]);

    const selectSearchResult = useCallback(async (result: GeocodeResult) => {
        await placeMarker(result.coordinates);
        setAddress(result.address);
        setSearchResults([]);
    }, [placeMarker]);

    const enable = useCallback((enabled: boolean) => {
        setIsEnabled(enabled);
        setErrorMessage(enabled ? '' : 'Сначала выберите город');
    }, []);

    const centerOn = useCallback((coords: YMapCoordinates) => {
        setCenter(coords);
    }, [setCenter]);

    useEffect(() => {
        if (isMapLoaded && !initializedRef.current && isEnabled) {
            initializedRef.current = true;
            placeMarker(initialCenter);
        }
    }, [isMapLoaded, isEnabled, initialCenter, placeMarker]);

    useEffect(() => {
        if (!isMapLoaded || !isEnabled) return;
        return onMapClick(coords => placeMarker(coords));
    }, [isMapLoaded, isEnabled, onMapClick, placeMarker]);

    return {
        containerRef, isMapLoaded, error, address,
        searchResults, isSearching, errorMessage, isEnabled,
        searchAddress, selectSearchResult, enable, centerOn,
    };
};