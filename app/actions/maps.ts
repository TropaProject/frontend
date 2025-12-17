"use server"

export async function getYandexMapsApiKey() {
  // Ваш ключ имеет префикс NEXT_PUBLIC_, поэтому ищем его
  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY
  
  console.log("[DEBUG] API Key from env:", apiKey ? `Found (${apiKey.length} chars)` : "Not found")
  
  if (!apiKey) {
    console.error("[app] Yandex Maps API key is not set in environment variables")
    return ""
  }
  
  return apiKey
}