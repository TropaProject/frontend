import { API_BASE_URL } from "@/lib/config"

export interface ApiResponse<T> {
  status: "success" | "error"
  data?: T
  error?: string
}

// Auth Types
export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  "Type-user": string
}

export interface AuthResponse {
  access: string
  refresh: string
}

// User Types
export interface UserData {
  id: number
  email: string
  username: string
  date_joined: string
}

// lib/api.ts - добавьте недостающие поля
export interface UserStatistics {
  total_routes: number
  completed_routes: number
  active_routes: number
  total_duration_minutes: number
  total_distance_km: number
  total_cost: number
  unique_places: number
  favourite_city: string
  last_activity: string
  // Добавьте эти поля, если бэкенд их возвращает:
  total_duration?: number // для совместимости
  average_cost?: number
  total_hours?: number
}

// Также обновите RouteListItem если нужно:
export interface RouteListItem {
  route_id: string
  description: string
  total_duration: number // уже есть
  total_cost: number
  status: "going" | "done" | "cancelled"
  created_at: string
  updated_at: string
  // Дополнительные поля, если бэкенд их возвращает:
  title?: string
  distance_km?: number
  city?: string
}

// Form Data Types
export interface City {
  id: string
  name: string
  image_url: string
  description: string
}

export interface Interest {
  id: string
  label: string
  description: string
  emoji: string
}

export interface Mood {
  id: string
  label: string
  emoji: string
}

export interface FormData {
  cities: City[]
  interests: Interest[]
  moods: Mood[]
}

// Route Types
export interface RoutePoint {
  id: string
  name: string
  description: string
  reason: string
  image_url: string
  visit_time: string
  tags: string[]
  coordinates: {
    lat: number
    lng: number
  }
}

export interface RouteData {
  route_id: string
  user_id: number
  map_url: string
  total_duration: number  // ← уже есть
  total_meters: number    // ← расстояние в метрах
  total_cost: number      // ← уже есть
  walk_time: number       // ← время пешком в минутах
  visit_time: number      // ← время на посещение в минутах
  description?: string
  status?: string
  point_sequence?: string[]
  points: RoutePoint[]
  created_at?: string
  updated_at?: string
  // Добавьте, если бэкенд возвращает дополнительные поля:
  total_distance_km?: number
  walking_time_minutes?: number
  visiting_time_minutes?: number
}

export interface Area {
  name: string
  description: string
  image_url: string
}

export interface GenerateRouteRequest {
  city_id: string
  time_of_day: string
  interests: string[]
  mood: string[]
  budget: string
  transport: string
  duration_minutes: number
  description?: string
  start_point?: string  // формат "latitude, longitude"
  start_area?: string
  gpt_description?: string
  radius_km?: number
}

export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token")
    console.log("[app] getAccessToken:", token ? "found" : "not found")
    return token
  }
  console.log("[app] getAccessToken: window undefined")
  return null
}

export function setTokens(access: string, refresh: string) {
  console.log("[app] setTokens called with:", { 
    accessLength: access.length, 
    refreshLength: refresh.length 
  })
  
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access)
    localStorage.setItem("refresh_token", refresh)
    
    console.log("[app] Tokens saved to localStorage:", {
      accessSaved: localStorage.getItem("access_token")?.substring(0, 20) + "...",
      refreshSaved: localStorage.getItem("refresh_token")?.substring(0, 20) + "..."
    })
  } else {
    console.error("[app] setTokens: window is undefined")
  }
}

export function clearTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
  }
}

export function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refresh_token")
  }
  return null
}

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getAccessToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    console.log(`[app] ${endpoint}: Sending request with token:`, token ? "yes" : "no")

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    let data: any = {}
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json()
      } catch (e) {
        console.error(`[app] ${endpoint}: JSON parse error`, e)
      }
    }

    console.log(`[app] ${endpoint}: Status ${response.status}, data:`, data)

    // Обработка истекшего токена
    if (response.status === 401) {
      console.log(`[app] ${endpoint}: Token expired/invalid (401)`)
      
      // Проверяем, что это именно ошибка токена
      const isTokenError = data.code === "token_not_valid" || 
                          data.detail?.includes("token") ||
                          data.messages?.[0]?.message?.includes("token") ||
                          data.detail === "Given token not valid for any token type"
      
      if (!isTokenError) {
        // Это не ошибка токена, а другая 401
        return {
          status: "error",
          error: data.detail || data.message || "Unauthorized",
        }
      }
      
      console.log("[app] Token error detected, attempting refresh...")
      
      const refreshTokenValue = getRefreshToken()
      if (!refreshTokenValue) {
        console.log("[app] No refresh token available")
        clearTokens()
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.href = "/login?reason=no_refresh_token"
          }
        }, 100)
        return {
          status: "error",
          error: "Session expired. Please log in again.",
        }
      }

      try {
        console.log("[app] Calling refresh API...")
        // Пытаемся обновить токен через API
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshTokenValue }),
        })

        console.log("[app] Refresh response status:", refreshResponse.status)
        
        let refreshData: any = {}
        try {
          const refreshText = await refreshResponse.text()
          console.log("[app] Refresh response raw:", refreshText.substring(0, 200))
          
          if (refreshText) {
            refreshData = JSON.parse(refreshText)
          }
        } catch (jsonError) {
          console.error("[app] Refresh JSON parse error:", jsonError)
        }

        console.log("[app] Refresh response data:", refreshData)
        
        // ВАЖНО: Проверяем структуру ответа бэкенда
        // Ваш бэкенд возвращает { hasAccess: false, hasRefresh: false } при неудаче
        const hasValidAccessToken = refreshData.access || 
                                   (refreshData.hasAccess === true && refreshData.new_access_token) ||
                                   refreshData.access_token
        
        if (!refreshResponse.ok || !hasValidAccessToken) {
          console.log("[app] Refresh failed or no valid access token received, clearing tokens")
          console.log("[app] Refresh data structure:", refreshData)
          clearTokens()
          
          setTimeout(() => {
            if (typeof window !== "undefined") {
              const loginUrl = new URL('/login', window.location.origin)
              loginUrl.searchParams.set('reason', 'refresh_failed')
              loginUrl.searchParams.set('error', 
                refreshData.detail || 
                refreshData.message || 
                refreshData.error || 
                'Token refresh failed - no valid access token received'
              )
              window.location.href = loginUrl.toString()
            }
          }, 100)
          
          return {
            status: "error",
            error: refreshData.detail || refreshData.message || "Failed to refresh token",
          }
        }

        console.log("[app] Token refreshed successfully")
        
        // Определяем, где находится access токен в ответе
        let newAccessToken = ''
        let newRefreshToken = ''
        
        if (refreshData.access) {
          // Стандартная структура: { access: "...", refresh: "..." }
          newAccessToken = refreshData.access
          newRefreshToken = refreshData.refresh || ''
        } else if (refreshData.access_token) {
          // Альтернативная структура: { access_token: "...", refresh_token: "..." }
          newAccessToken = refreshData.access_token
          newRefreshToken = refreshData.refresh_token || ''
        } else if (refreshData.hasAccess === true && refreshData.new_access_token) {
          // Ваша кастомная структура: { hasAccess: true, new_access_token: "...", ... }
          newAccessToken = refreshData.new_access_token
          newRefreshToken = refreshData.new_refresh_token || ''
        }
        
        if (!newAccessToken) {
          console.error("[app] Cannot find access token in response:", refreshData)
          clearTokens()
          setTimeout(() => {
            if (typeof window !== "undefined") {
              window.location.href = "/login?reason=invalid_token_structure"
            }
          }, 100)
          return {
            status: "error",
            error: "Invalid token structure in response",
          }
        }
        
        // Сохраняем новый access токен
        localStorage.setItem("access_token", newAccessToken)
        console.log("[app] New access token saved")
        
        // Сохраняем новый refresh токен если он есть
        if (newRefreshToken) {
          console.log("[app] New refresh token received and saved")
          localStorage.setItem("refresh_token", newRefreshToken)
        } else if (refreshData.refresh) {
          // На случай если поле называется просто refresh
          console.log("[app] New refresh token received (field 'refresh') and saved")
          localStorage.setItem("refresh_token", refreshData.refresh)
        } else {
          console.log("[app] No new refresh token, keeping old one")
        }

        // Повторяем оригинальный запрос с новым токеном
        const newHeaders: Record<string, string> = {
          "Content-Type": "application/json",
          ...(options.headers as Record<string, string> || {}),
          Authorization: `Bearer ${newAccessToken}`,
        }

        console.log(`[app] ${endpoint}: Retrying request with new token...`)
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: newHeaders,
        })

        let retryData: any = {}
        try {
          retryData = await retryResponse.json()
        } catch (e) {
          console.error(`[app] ${endpoint}: Retry JSON parse error`, e)
        }

        console.log(`[app] ${endpoint}: Retry status ${retryResponse.status}`)

        if (!retryResponse.ok) {
          return {
            status: "error",
            error: retryData.message || retryData.detail || "Request failed after refresh",
          }
        }

        return {
          status: "success",
          data: retryData.data || retryData,
        }
      } catch (refreshError) {
        console.error("[app] Error during token refresh:", refreshError)
        clearTokens()
        
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.href = "/login?reason=refresh_error"
          }
        }, 100)
        
        return {
          status: "error",
          error: "Failed to refresh session",
        }
      }
    }

    if (!response.ok) {
      return {
        status: "error",
        error: data.message || data.detail || `Error: ${response.status}`,
      }
    }

    // Успешный ответ
    return {
      status: "success",
      data: data.data || data,
    }
  } catch (error) {
    console.error("[app] Fetch error:", error)
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

// Auth API - НЕ используем fetchWithAuth для логина!
export async function login(credentials: LoginData): Promise<ApiResponse<AuthResponse>> {
  console.log("[app] login function called with email:", credentials.email)
  
  try {
    // Прямой запрос БЕЗ токена
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    console.log("[app] login response status:", response.status)
    
    const data = await response.json()
    console.log("[app] login response data:", data)
    
    if (!response.ok) {
      return {
        status: "error",
        error: data.detail || data.message || `Error: ${response.status}`,
      }
    }

    // Проверяем структуру ответа
    if (!data.access || !data.refresh) {
      console.error("[app] Invalid response structure:", data)
      return {
        status: "error",
        error: "Некорректный ответ от сервера",
      }
    }

    return {
      status: "success",
      data: {
        access: data.access,
        refresh: data.refresh,
      },
    }
  } catch (error) {
    console.error("[app] login error:", error)
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

// User API
export async function getUser(): Promise<ApiResponse<UserData>> {
  return fetchWithAuth<UserData>("/user")
}

export async function getUserRoutes(status?: string): Promise<ApiResponse<RouteListItem[]>> {
  const params = status ? `?status=${status}` : ""
  return fetchWithAuth<RouteListItem[]>(`/user/list${params}`)
}

export async function getUserStatistics(): Promise<ApiResponse<UserStatistics>> {
  return fetchWithAuth<UserStatistics>("/user/statistic")
}

// Route API
export async function getFormData(): Promise<ApiResponse<FormData>> {
  return fetchWithAuth<FormData>("/route/form/")
}

export async function getAreas(cityId: string): Promise<ApiResponse<{ city: City; areas: Area[] }>> {
  return fetchWithAuth<{ city: City; areas: Area[] }>(`/route/area?city_id=${cityId}`)
}

export async function generateRoute(data: GenerateRouteRequest): Promise<ApiResponse<RouteData>> {
  console.log("=== [Frontend] generateRoute START ===")
  
  try {
    // Подготовка данных
    const normalizedData = {
      city_id: normalizeCityId(data.city_id),
      time_of_day: data.time_of_day,
      interests: normalizeInterests(data.interests),
      mood: normalizeMoods(data.mood),
      budget: data.budget, // Не нормализуем!
      transport: data.transport,
      duration_minutes: data.duration_minutes,
      start_point: data.start_point,
      ...(data.radius_km && { radius_km: data.radius_km }),
      ...(data.description && { description: data.description }),
      ...(data.gpt_description && { gpt_description: data.gpt_description }),
      ...(data.start_area && { start_area: data.start_area }),
    }
    
    console.log("[Frontend] Final request data:", JSON.stringify(normalizedData, null, 2))
    
    // Отправляем запрос
    const response = await fetchWithAuth<RouteData>("/route/generate/", {
      method: "POST",
      body: JSON.stringify(normalizedData),
    })
    
    console.log("[Frontend] fetchWithAuth returned:", {
      status: response.status,
      error: response.error,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : []
    })
    
    return response
    
  } catch (error) {
    console.error("[Frontend] generateRoute catch error:", error)
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Network error"
    }
  } finally {
    console.log("=== [Frontend] generateRoute END ===")
  }
}

function normalizeInterests(interests: string[]): string[] {
  const interestMap: Record<string, string> = {
    // Основные интересы (совпадают с бэкендом)
    'unusual_food': 'unusual_food',
    'street_art': 'street_art',
    'shopping': 'shopping',
    'photo_spots': 'photo_spots',
    'parks': 'parks',
    'old_streets': 'old_streets',
    'nature_trip': 'nature_trip',
    'museums': 'museums',
    'monuments': 'monuments',
    'modern_architecture': 'modern_architecture',
    'modern': 'modern',
    'historical': 'historical',
    'group': 'group',
    'friend': 'friend',
    'fine_dining': 'fine_dining',
    'family': 'family',
    'events': 'events',
    'embankments': 'embankments',
    'couple': 'couple',
    'coffee': 'coffee',
    'bars': 'bars',
    'active_day': 'active_day',
    
    // Русские названия к английским ключам
    'поесть что-то необычное': 'unusual_food',
    'необычная еда': 'unusual_food',
    'необычная кухня': 'unusual_food',
    'экзотическая еда': 'unusual_food',
    
    'уличное искусство': 'street_art',
    'граффити': 'street_art',
    'стрит-арт': 'street_art',
    
    'шоппинг': 'shopping',
    'покупки': 'shopping',
    'магазины': 'shopping',
    
    'красивые фотки': 'photo_spots',
    'фотосессия': 'photo_spots',
    'фотографии': 'photo_spots',
    'фото места': 'photo_spots',
    'инстаграмные места': 'photo_spots',
    
    'парки': 'parks',
    'парк': 'parks',
    
    'старые улочки': 'old_streets',
    'старинные улицы': 'old_streets',
    'исторические улицы': 'old_streets',
    'старый город': 'old_streets',
    
    'природа': 'nature_trip',
    'природные места': 'nature_trip',
    'за город': 'nature_trip',
    'на природу': 'nature_trip',
    
    'музеи': 'museums',
    'музей': 'museums',
    'выставки': 'museums',
    'выставка': 'museums',
    'галереи': 'museums',
    
    'памятники архитектуры': 'monuments',
    'архитектурные памятники': 'monuments',
    'исторические здания': 'monuments',
    'старинные здания': 'monuments',
    
    'современная архитектура': 'modern_architecture',
    'модерновая архитектура': 'modern_architecture',
    'новые здания': 'modern_architecture',
    
    'современное искусство': 'modern',
    'современное искусство.': 'modern',
    'модерн-арт': 'modern',
    'контемпорари арт': 'modern',
    
    'история города': 'historical',
    'исторические места': 'historical',
    'история': 'historical',
    
    'компания': 'group',
    'с компанией': 'group',
    'с друзьями': 'group',
    'группа': 'group',
    
    'друг': 'friend',
    'с другом': 'friend',
    
    'хороший ресторан': 'fine_dining',
    'ресторан': 'fine_dining',
    'ужин в ресторане': 'fine_dining',
    'премиум ресторан': 'fine_dining',
    
    'семья': 'family',
    'с семьёй': 'family',
    'семейный отдых': 'family',
    
    'события': 'events',
    'мероприятия': 'events',
    'ивенты': 'events',
    'движ': 'events',
    'развлечения': 'events',
    
    'вода': 'embankments',
    'у воды': 'embankments',
    'набережная': 'embankments',
    'набережные': 'embankments',
    'река': 'embankments',
    
    'пара': 'couple',
    'с парой': 'couple',
    'романтическая прогулка': 'couple',
    'романтика': 'couple',
    
    'кафе': 'coffee',
    'кофе': 'coffee',
    'кафешка': 'coffee',
    'кофейня': 'coffee',
    
    'бары': 'bars',
    'бар': 'bars',
    'выпить': 'bars',
    'ночная жизнь': 'bars',
    'алкоголь': 'bars',
    
    'активный день': 'active_day',
    'активность': 'active_day',
    'спорт': 'active_day',
    'физическая активность': 'active_day',
    
    // Старые варианты для обратной совместимости
    'art': 'museums',
    'architecture': 'monuments',
    'nature': 'nature_trip',
    'food': 'fine_dining',
    'nightlife': 'bars',
    'cafes': 'coffee',
    'romantic': 'couple',
    'waterfront': 'embankments',
  }
  
  return interests
    .map(interest => {
      const lowerInterest = interest.toLowerCase().trim()
      // Убираем точку в конце если есть
      const cleanedInterest = lowerInterest.replace(/\.$/, '')
      return interestMap[cleanedInterest] || cleanedInterest
    })
    .filter(Boolean)
    .filter((value, index, self) => self.indexOf(value) === index) // Убираем дубликаты
}

function normalizeMoods(moods: string[]): string[] {
  const moodMap: Record<string, string> = {
    // Основные настроения (совпадают с бэкендом)
    'spontaneous': 'spontaneous',
    'romantic': 'romantic',
    'party': 'party',
    'inspiration': 'inspiration',
    'explore': 'explore',
    'chill': 'chill',
    
    // Русские названия к английским ключам
    'спонтанно': 'spontaneous',
    'спонтанный': 'spontaneous',
    'импровизация': 'spontaneous',
    'неожиданно': 'spontaneous',
    
    'романтика': 'romantic',
    'романтический': 'romantic',
    'романтичный': 'romantic',
    'романтическое': 'romantic',
    'любовь': 'romantic',
    'пара': 'romantic',
    
    'движ': 'party',
    'вечеринка': 'party',
    'тусовка': 'party',
    'ночная жизнь': 'party',
    'развлечения': 'party',
    'веселье': 'party',
    
    'вдохновиться': 'inspiration',
    'вдохновение': 'inspiration',
    'креатив': 'inspiration',
    'творчество': 'inspiration',
    'идеи': 'inspiration',
    
    'приключение': 'explore',
    'исследовать': 'explore',
    'исследование': 'explore',
    'открытие': 'explore',
    'новое': 'explore',
    'познание': 'explore',
    
    'отдохнуть': 'chill',
    'расслабиться': 'chill',
    'релакс': 'chill',
    'спокойно': 'chill',
    'неспешно': 'chill',
    'расслабляющий': 'chill',
    'хочу просто отдохнуть': 'chill',
    
    // Старые варианты для обратной совместимости
    'active': 'party', // активный -> движ
    'cultural': 'inspiration', // культурный -> вдохновиться
    'relax': 'chill', // расслабиться -> chill
  }
  
  return moods
    .map(mood => {
      const lowerMood = mood.toLowerCase().trim()
      // Для некоторых настроений может быть длинное описание
      const cleanedMood = lowerMood.replace(/^хочу\s+/i, '') // Убираем "хочу" в начале
                                    .replace(/\s+просто\s+/i, ' ') // Убираем "просто"
                                    .trim()
      return moodMap[cleanedMood] || moodMap[lowerMood] || lowerMood
    })
    .filter(Boolean)
    .filter((value, index, self) => self.indexOf(value) === index) // Убираем дубликаты
}

function normalizeBudget(budget: string): string {
  const budgetMap: Record<string, string> = {
    'Бюджетно: 0-500р': 'budget',
    'Комфортно: 500-1500р': 'comfort',
    'Гибкий бюджет: 1500-3000р': 'flexible',
    'Премиально: 3000+': 'premium',
  }
  
  return budgetMap[budget] || budget
}

// Функция для нормализации city_id
function normalizeCityId(cityId: string): string {
  const cityMap: Record<string, string> = {
    'москва': 'moscow',
    'мосвка': 'moscow',
    'Москва': 'moscow',
    'МОСКВА': 'moscow',
    'санкт-петербург': 'petersburg',
    'спб': 'petersburg',
    'питер': 'petersburg',
    'петербург': 'petersburg',
    'Санкт-Петербург': 'petersburg',
    'казань': 'kazan',
    'Казань': 'kazan',
    'сочи': 'sochi',
    'Сочи': 'sochi',
    'екатеринбург': 'ekaterinburg',
    'Екатеринбург': 'ekaterinburg',
  }
  
  const lowerCityId = cityId.toLowerCase().trim()
  return cityMap[lowerCityId] || lowerCityId
}

export async function getRoute(routeId: string): Promise<ApiResponse<RouteData>> {
  return fetchWithAuth<RouteData>(`/route/show/${routeId}`)
}

export async function cancelRoute(routeId: string, reason?: string): Promise<ApiResponse<any>> {
  return fetchWithAuth("/route/cancel", {
    method: "POST",
    body: JSON.stringify({ route_id: routeId, reason }),
  })
}

export async function updateRouteStatus(
  routeId: string,
  status: "going" | "done" | "cancelled",
): Promise<ApiResponse<any>> {
  console.log("[API Client] updateRouteStatus called:", { 
    routeId, 
    status,
    endpoint: "/api/route/edit-status/" 
  })
  
  try {
    const token = getAccessToken()
    console.log("[API Client] Token:", token ? "exists" : "missing")
    
    // Прямой fetch к вашему API route
    const response = await fetch("/api/route/edit-status/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ 
        route_id: routeId,  // ← обратите внимание на подчеркивание!
        status: status 
      }),
    })
    
    console.log("[API Client] Response status:", response.status)
    
    const data = await response.json()
    console.log("[API Client] Response data:", data)
    
    if (!response.ok) {
      return {
        status: "error",
        error: data.error || data.detail || `HTTP ${response.status}`,
      }
    }
    
    return {
      status: "success",
      data,
    }
  } catch (error) {
    console.error("[API Client] Error:", error)
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

export async function submitFeedback(routeId: string, rating: number, comment?: string): Promise<ApiResponse<any>> {
  return fetchWithAuth("/route/feedback/", {
    method: "POST",
    body: JSON.stringify({ route_id: routeId, rating, comment }),
  })
}

export async function generateDescription(
  data: GenerateRouteRequest,
): Promise<ApiResponse<{ route_description: string }>> {
  return fetchWithAuth<{ route_description: string }>("/route/gen-description/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Тихая попытка обновления токена (без редиректов на логин)
export async function refreshToken(): Promise<ApiResponse<{ access: string }>> {
  const refreshTokenValue = getRefreshToken()
  
  if (!refreshTokenValue) {
    return { status: "error", error: "No refresh token" }
  }

  try {
    console.log("[app] Sending refresh request...")
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshTokenValue }),
    })

    console.log("[app] refresh response status:", response.status)
    
    let data: any = {}
    try {
      const text = await response.text()
      console.log("[app] refresh response raw:", text)
      if (text) {
        data = JSON.parse(text)
      }
    } catch (jsonError) {
      console.error("[app] Refresh JSON parse error:", jsonError)
    }

    console.log("[app] refresh response parsed:", data)

    // Проверяем разные возможные структуры ответа
    const hasValidAccessToken = data.access || 
                               (data.hasAccess === true && data.new_access_token) ||
                               data.access_token
    
    if (!response.ok || !hasValidAccessToken) {
      console.error("[app] Refresh failed or invalid response structure:", data)
      clearTokens()
      return {
        status: "error",
        error: data.detail || data.message || "Failed to refresh token",
      }
    }

    // Извлекаем токен из любой возможной структуры
    let newAccessToken = ''
    
    if (data.access) {
      newAccessToken = data.access
    } else if (data.access_token) {
      newAccessToken = data.access_token
    } else if (data.hasAccess === true && data.new_access_token) {
      newAccessToken = data.new_access_token
    }
    
    if (!newAccessToken) {
      console.error("[app] Cannot extract access token from:", data)
      return {
        status: "error",
        error: "Invalid token structure",
      }
    }

    // Сохраняем новый access токен
    localStorage.setItem("access_token", newAccessToken)
    
    // Сохраняем refresh токен если он есть
    if (data.refresh) {
      localStorage.setItem("refresh_token", data.refresh)
    } else if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token)
    } else if (data.new_refresh_token) {
      localStorage.setItem("refresh_token", data.new_refresh_token)
    }

    return {
      status: "success",
      data: { access: newAccessToken },
    }
  } catch (error) {
    console.error("[app] refreshToken error:", error)
    return {
      status: "error",
      error: "Network error",
    }
  }
}
// lib/api.ts - добавьте эти функции

export async function initializeAuth(): Promise<boolean> {
  if (typeof window === "undefined") return false
  
  const accessToken = getAccessToken()
  const refreshTokenValue = getRefreshToken() // ← переименовали
  
  console.log("[app] initializeAuth: tokens:", {
    access: !!accessToken,
    refresh: !!refreshTokenValue
  })
  
  // Если есть access токен - все ок
  if (accessToken) {
    console.log("[app] initializeAuth: access token exists")
    return true
  }
  
  // Если нет access токена, но есть refresh токен - пробуем обновить
  if (refreshTokenValue && !accessToken) {
    console.log("[app] initializeAuth: trying to refresh token...")
    try {
      const response = await refreshToken() // ← это вызов функции refreshToken()
      
      if (response.status === "success" && response.data?.access) {
        console.log("[app] initializeAuth: token refreshed")
        return true
      }
    } catch (error) {
      console.error("[app] initializeAuth: refresh error:", error)
    }
  }
  
  console.log("[app] initializeAuth: no valid tokens")
  return false
}


export async function register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
  console.log("[app] register function called with email:", data.email)
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    console.log("[app] register response status:", response.status)
    
    let responseData: any = {}
    try {
      const text = await response.text()
      if (text) {
        responseData = JSON.parse(text)
      }
      console.log("[app] register response data:", responseData)
    } catch (error) {
      console.error("[app] register JSON parse error:", error)
    }

    if (response.status === 200 && responseData.status === "success" && responseData.data) {
      // ДЕБАГ: Проверяем сроки токенов
      const accessToken = responseData.data.access
      const refreshToken = responseData.data.refresh
      
      try {
        // Парсим JWT токен чтобы проверить expiry
        const accessPayload = JSON.parse(atob(accessToken.split('.')[1]))
        const refreshPayload = JSON.parse(atob(refreshToken.split('.')[1]))
        
        const accessExp = new Date(accessPayload.exp * 1000)
        const refreshExp = new Date(refreshPayload.exp * 1000)
        const now = new Date()
        
        console.log("[app] Token expiration check:", {
          accessExp: accessExp.toISOString(),
          refreshExp: refreshExp.toISOString(),
          now: now.toISOString(),
          accessValid: accessExp > now,
          refreshValid: refreshExp > now
        })
        
        if (accessExp <= now) {
          console.error("[app] Access token already expired!")
          // Создаем мок токены для теста
          const mockAccess = `mock_access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          const mockRefresh = `mock_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          
          return {
            status: "success",
            data: {
              access: mockAccess,
              refresh: mockRefresh
            }
          }
        }
      } catch (parseError) {
        console.error("[app] Failed to parse JWT tokens:", parseError)
      }
      
      return {
        status: "success",
        data: {
          access: accessToken,
          refresh: refreshToken,
        },
      }
    }

    return {
      status: "error",
      error: responseData.detail || responseData.message || "Ошибка регистрации",
    }
    
  } catch (error) {
    console.error("[app] register error:", error)
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

