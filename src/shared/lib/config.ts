// shared/lib/config.ts

export const API_BASE_URL = import.meta.env.VITE_API_URL
export const MEDIA_BASE_URL = API_BASE_URL?.replace(/\/api$/, '')
export const YANDEX_MAPS_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY as string;