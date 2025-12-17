// lib/config.ts

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://5.129.193.251:8000"
export const API_BASE_URL = `${BACKEND_URL}/api`
export const YANDEX_MAPS_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || ""