// features/yandex-map/model/types.ts

export interface YMapCoordinates {
    lat: number;
    lng: number;
    name?: string;
}

export interface YMapMarkerConfig {
    coordinates: YMapCoordinates;
    color?: string;
    size?: number;
    draggable?: boolean;
    title?: string;
    icon?: string;
    label?: string;

    onDragEnd?: (coordinates: YMapCoordinates) => void;
}

export interface YMapConfig {
    center: YMapCoordinates;
    zoom?: number;
}

export interface YandexMapInstance {
    map: unknown;
    addMarker: (config: YMapMarkerConfig) => void;
    addPolyline: (points: YMapCoordinates[], color?: string) => void;
    setCenter: (center: YMapCoordinates, zoom?: number) => void;
    clearAll: () => void;
}

export interface CityBounds {
    min_lat: number;
    max_lat: number;
    min_lon: number;
    max_lon: number;
}