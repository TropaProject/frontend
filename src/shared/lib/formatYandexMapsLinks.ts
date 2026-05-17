// shared/lib/yandexMaps.ts

interface Coordinates {
    lat: number;
    lng: number;
}

/**
 * Ссылка на точку в Яндекс.Картах
 */
export const buildYandexPointUrl = (coordinates: Coordinates, zoom = 16): string => {
    return `https://yandex.ru/maps/?pt=${coordinates.lng},${coordinates.lat}&z=${zoom}`;
};

/**
 * Ссылка на маршрут в Яндекс.Картах (пешком)
 */
export const buildYandexRouteUrl = (points: Coordinates[]): string => {
    if (points.length < 2) return '';
    const coords = points.map(p => `${p.lat},${p.lng}`).join('~');
    return `https://yandex.ru/maps/?rtext=${coords}&rtt=pd`;
};