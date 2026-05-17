// features/yandex-map/lib/loadScript.ts
import { YANDEX_MAPS_API_KEY } from '@/shared/lib/config';

let loadPromise: Promise<void> | null = null;
let isLoaded = false;

export const loadYandexMaps = (): Promise<void> => {
    if (isLoaded) return Promise.resolve();
    if (loadPromise) return loadPromise;

    if (!YANDEX_MAPS_API_KEY) {
        return Promise.reject(new Error('Yandex Maps API key is not configured'));
    }

    loadPromise = new Promise<void>((resolve, reject) => {
        const existing = document.querySelector('script[src*="api-maps.yandex.ru/v3"]');
        if (existing) {
            existing.addEventListener('load', () => {
                isLoaded = true;
                resolve();
            });
            existing.addEventListener('error', () => reject(new Error('Failed to load')));
            return;
        }

        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/v3/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU`;
        script.async = true;

        script.onload = () => {
            isLoaded = true;
            resolve();
        };
        script.onerror = () => {
            loadPromise = null;
            reject(new Error('Failed to load Yandex Maps script'));
        };

        document.head.appendChild(script);
    });

    return loadPromise;
};