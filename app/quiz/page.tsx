"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Sunrise, Sun, Sunset, Moon, Loader2, ArrowLeft, ArrowRight, Search } from "lucide-react"
import Header from "@/components/header"
import { getFormData, generateDescription, generateRoute, getAccessToken } from "@/lib/api"
import { getYandexMapsApiKey } from "@/app/actions/maps"
import { RouteLoadingScreen } from "@/components/RouteLoadingScreen"

declare global {
  interface Window {
    ymaps: any
  }
}

interface MapObjects {
  map: any
  placemark: any
}

export default function QuizPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [mapReady, setMapReady] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const totalSteps = 6
  
  // Реф для хранения объектов карты
  const mapObjectsRef = useRef<MapObjects | null>(null)
  const generatedRouteIdRef = useRef<string | null>(null)
  // Form data from API
  const [formData, setFormData] = useState<any>(null)

  // User selections - используем cityId для бэкенда
  const [selectedCityId, setSelectedCityId] = useState("")
  const [address, setAddress] = useState("")
  const [addressInput, setAddressInput] = useState("")
  const [coordinates, setCoordinates] = useState({ lat: 55.76, lng: 37.64 })
  const [timeOfDay, setTimeOfDay] = useState("")
  const [duration, setDuration] = useState([2])
  const [radius, setRadius] = useState(1)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [budget, setBudget] = useState("")
  const [aiDescription, setAiDescription] = useState("")
  const [userComments, setUserComments] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false)
  const [generatedRouteId, setGeneratedRouteId] = useState<string | null>(null)
  const [descriptionApiCompleted, setDescriptionApiCompleted] = useState(false)

  useEffect(() => {
  return () => {
    console.log("[QuizPage] Component unmounting, cleaning up...")
    sessionStorage.removeItem('last_generated_route_id')
    generatedRouteIdRef.current = null
    
    // Очищаем карту
    if (mapObjectsRef.current) {
      try {
        mapObjectsRef.current.map.destroy()
      } catch (e) {
        console.log("[app] Error destroying map on unmount:", e)
      }
      mapObjectsRef.current = null
    }
  }
}, [])

  // Получаем название города по ID
  const selectedCityName = formData?.cities?.find((c: any) => c.id === selectedCityId)?.name || ""

  // Функция для преобразования названия города в ID для бэкенда (на всякий случай)
  const getCityIdForBackend = (cityName: string): string => {
    const cityMap: Record<string, string> = {
      'Москва': 'moscow',
      'Санкт-Петербург': 'petersburg',
      'Казань': 'kazan',
      'Сочи': 'sochi',
      'Екатеринбург': 'ekaterinburg',
      'Новосибирск': 'novosibirsk',
    }
    return cityMap[cityName] || cityName.toLowerCase()
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const loadData = async () => {
      const token = getAccessToken()
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const result = await getFormData()
        if (result.status === "success" && result.data) {
          console.log("[app] Form data loaded:", {
            cities: result.data.cities?.map((c: any) => ({ id: c.id, name: c.name })),
            interestsCount: result.data.interests?.length,
            moodsCount: result.data.moods?.length
          })
          setFormData(result.data)
        }
      } catch (error) {
        console.error("[app] Error loading form data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [mounted, router])

  const handleDescriptionComplete = () => {
  console.log("[app] Description generation complete, moving to step 6")
  setIsGeneratingDescription(false)
  setCurrentStep(6) // Переходим к следующему шагу
}

const handleRouteComplete = () => {
  console.log("[app] Route generation complete, navigating to route")
  console.log("[app] Generated Route ID from state:", generatedRouteId)
  console.log("[app] Generated Route ID from ref:", generatedRouteIdRef.current)
  
  setIsGeneratingRoute(false)
  
  // Сначала пробуем получить routeId из ref, потом из state
  const routeId = generatedRouteIdRef.current || generatedRouteId
  
  if (routeId) {
    console.log("[app] Route ID found, navigating to /route/", routeId)
    // Небольшая задержка для гарантии
    setTimeout(() => {
      router.push(`/route/${routeId}`)
    }, 300)
  } else {
    console.error("[app] No route ID found in both ref and state!")
    
    // Попробуем поискать в localStorage или sessionStorage
    const storedRouteId = sessionStorage.getItem('last_generated_route_id')
    if (storedRouteId) {
      console.log("[app] Found route ID in sessionStorage:", storedRouteId)
      setTimeout(() => {
        router.push(`/route/${storedRouteId}`)
      }, 300)
    } else {
      alert("Ошибка: ID маршрута не найден. Попробуйте еще раз.")
      
      // Вернуться назад
      setIsGeneratingRoute(false)
      setCurrentStep(5) // Вернуться на предыдущий шаг
    }
  }
}

// Инициализация карты - УПРОЩЕННАЯ ВЕРСИЯ
useEffect(() => {
  // Только для шага 1
  if (currentStep !== 1) return
  
  console.log("[app] Starting map initialization for step", currentStep)

  const initMap = async () => {
    try {
      // 1. Получаем API ключ
      const apiKey = await getYandexMapsApiKey()
      console.log("[app] API key received:", apiKey ? "Yes" : "No")
      
      if (!apiKey) {
        console.error("[app] No Yandex Maps API key")
        return
      }

      // 2. Загружаем скрипт Яндекс.Карт (если еще не загружен)
      if (!window.ymaps) {
        console.log("[app] Loading Yandex Maps script...")
        await new Promise((resolve, reject) => {
          const script = document.createElement("script")
          script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`
          script.async = true
          script.onload = () => {
            console.log("[app] Yandex Maps script loaded")
            resolve(true)
          }
          script.onerror = (err) => {
            console.error("[app] Failed to load Yandex Maps script:", err)
            reject(err)
          }
          document.head.appendChild(script)
        })
      }

      // 3. Ждем готовности ymaps
      console.log("[app] Waiting for ymaps.ready...")
      await new Promise((resolve) => {
        window.ymaps.ready(resolve)
      })

      // 4. Проверяем элемент карты МНОГОКРАТНО с интервалами
      let attempts = 0
      const maxAttempts = 10
      
      const waitForElement = () => {
        return new Promise((resolve, reject) => {
          const checkElement = () => {
            attempts++
            const mapElement = document.getElementById("yandex-map")
            
            console.log(`[app] Check attempt ${attempts}:`, mapElement ? "Found!" : "Not found")
            
            if (mapElement) {
              resolve(mapElement)
            } else if (attempts >= maxAttempts) {
              reject(new Error("Map element not found after max attempts"))
            } else {
              setTimeout(checkElement, 200) // Проверяем каждые 200ms
            }
          }
          
          checkElement()
        })
      }

      // 5. Ждем элемент
      const mapElement = await waitForElement()
      console.log("[app] Map element found, creating map...")

      // 6. Создаем карту
      const map = new window.ymaps.Map("yandex-map", {
        center: [coordinates.lat, coordinates.lng],
        zoom: 12,
        controls: ["zoomControl", "fullscreenControl"]
      })

      // 7. Создаем метку
      const placemark = new window.ymaps.Placemark(
        [coordinates.lat, coordinates.lng],
        {
          balloonContent: "Точка отправления",
          hintContent: "Перетащите для изменения позиции"
        },
        {
          preset: "islands#blueCircleDotIcon",
          draggable: true
        }
      )

      // 8. Обработчик перетаскивания
      placemark.events.add("dragend", async () => {
        const coords = placemark.geometry.getCoordinates()
        setCoordinates({ lat: coords[0], lng: coords[1] })
        
        try {
          const geocoder = await window.ymaps.geocode(coords)
          const firstGeoObject = geocoder.geoObjects.get(0)
          if (firstGeoObject) {
            const newAddress = firstGeoObject.getAddressLine()
            setAddress(newAddress)
            setAddressInput(newAddress)
          }
        } catch (error) {
          console.error("[app] Reverse geocoding error:", error)
        }
      })

      // 9. Клик по карте
      map.events.add("click", async (e: any) => {
        const coords = e.get("coords")
        setCoordinates({ lat: coords[0], lng: coords[1] })
        placemark.geometry.setCoordinates(coords)
        
        try {
          const geocoder = await window.ymaps.geocode(coords)
          const firstGeoObject = geocoder.geoObjects.get(0)
          if (firstGeoObject) {
            const newAddress = firstGeoObject.getAddressLine()
            setAddress(newAddress)
            setAddressInput(newAddress)
            placemark.properties.set("balloonContent", newAddress)
          }
        } catch (error) {
          console.error("[app] Geocoding error on click:", error)
        }
      })

      map.geoObjects.add(placemark)

      

      // 12. Сохраняем объекты и обновляем состояние
      mapObjectsRef.current = { map, placemark }
      setMapReady(true)
      console.log("[app] Map initialized successfully!")
      
    } catch (error) {
      console.error("[app] Map initialization failed:", error)
    }
  }

  // Запускаем инициализацию с небольшой задержкой
  const timer = setTimeout(() => {
    initMap()
  }, 300) // Даем время на рендеринг

  return () => {
    clearTimeout(timer)
  }
}, [currentStep]) // Только currentStep как зависимость

  // Обновление карты при изменении города
useEffect(() => {
  console.log("[app] City update effect:", {
    mapReady,
    selectedCityId,
    hasFormData: !!formData,
    hasMapObjects: !!mapObjectsRef.current
  })
  
  if (!selectedCityId || !formData) return
  
  const city = formData.cities.find((c: any) => c.id === selectedCityId)
  if (!city?.coordinates) return
  
  const newCoords = {
    lat: city.coordinates.lat,
    lng: city.coordinates.lng || city.coordinates.lon
  }
  
  console.log("[app] Updating coordinates to:", newCoords)
  setCoordinates(newCoords)
  
  // Обновляем карту только если она готова
  if (mapReady && mapObjectsRef.current) {
    console.log("[app] Updating map center to new city")
    const { map, placemark } = mapObjectsRef.current
    
    try {
      map.setCenter([newCoords.lat, newCoords.lng], 12)
      placemark.geometry.setCoordinates([newCoords.lat, newCoords.lng])
      
      // Геокодируем координаты для получения адреса
      window.ymaps.geocode([newCoords.lat, newCoords.lng]).then((res: any) => {
        const firstGeoObject = res.geoObjects.get(0)
        if (firstGeoObject) {
          const newAddress = firstGeoObject.getAddressLine()
          setAddress(newAddress)
          setAddressInput(newAddress)
        }
      })
    } catch (error) {
      console.error("[app] Error updating map:", error)
    }
  } else {
    console.log("[app] Map not ready yet, coordinates updated but map will update later")
  }
}, [selectedCityId, formData, mapReady])

  // Функция поиска адреса по введенному тексту
  const handleSearchAddress = async () => {
    if (!addressInput.trim() || !mapObjectsRef.current) return
    
    setIsSearching(true)
    try {
      const { map, placemark } = mapObjectsRef.current
      
      // Прямое геокодирование: адрес → координаты
      const geocoder = await window.ymaps.geocode(addressInput)
      const firstGeoObject = geocoder.geoObjects.get(0)
      
      if (!firstGeoObject) {
        alert("Адрес не найден")
        return
      }
      
      const coords = firstGeoObject.geometry.getCoordinates()
      const foundAddress = firstGeoObject.getAddressLine()
      
      // Обновляем состояние
      setCoordinates({ lat: coords[0], lng: coords[1] })
      setAddress(foundAddress)
      setAddressInput(foundAddress)
      
      // Обновляем карту
      placemark.geometry.setCoordinates(coords)
      map.setCenter(coords, 15)
      
      // Обновляем балун
      placemark.properties.set({
        balloonContent: foundAddress
      })
      placemark.balloon.open()
      
    } catch (error) {
      console.error("[app] Geocoding error:", error)
      alert("Ошибка при поиске адреса")
    } finally {
      setIsSearching(false)
    }
  }

  // Обработчик нажатия Enter в поле адреса
  const handleAddressKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchAddress()
    }
  }

  const handleNext = async () => {
  // Переход с шага 5 на 6: сначала генерируем описание маршрута
if (currentStep === 5) {
  setIsGeneratingDescription(true)
  setDescriptionApiCompleted(false) // Сбрасываем
  
  try {
    const result = await generateDescription({
      city_id: selectedCityId,
      interests: selectedInterests,
      mood: selectedMoods,
      time_of_day: timeOfDay,
      duration_minutes: duration[0] * 60,
      budget: budget,
      transport: "on_foot",
      start_point: `${coordinates.lat}, ${coordinates.lng}`,
    })

    if (result.status === "success" && result.data) {
      const description = result.data.route_description || ""
      setAiDescription(description)
      setDescriptionApiCompleted(true) // Устанавливаем флаг завершения
    } else {
      alert("Не удалось сгенерировать описание. Попробуйте еще раз.")
      setIsGeneratingDescription(false)
      setDescriptionApiCompleted(false)
    }
  } catch (error) {
    console.error("[app] Error generating description:", error)
    alert("Произошла ошибка при генерации описания")
    setIsGeneratingDescription(false)
    setDescriptionApiCompleted(false)
  }
  return
}

  // На шаге 6 по кнопке создаем маршрут
if (currentStep === 6) {
  setIsGeneratingRoute(true)
  generatedRouteIdRef.current = null
  
  console.log("[app] Starting route generation...")
  
  try {
    const result = await generateRoute({
      city_id: selectedCityId,
      start_point: `${coordinates.lat}, ${coordinates.lng}`,
      interests: selectedInterests,
      mood: selectedMoods,
      time_of_day: timeOfDay,
      duration_minutes: duration[0] * 60,
      radius_km: radius,
      budget: budget,
      transport: "on_foot",
      description: userComments,
      gpt_description: aiDescription,
    })

    console.log("[app] Route generation result:", {
      status: result.status,
      hasError: !!result.error,
      error: result.error,
      data: result.data,
      hasRouteId: !!result.data?.route_id
    })

    if (result.status === "success" && result.data?.route_id) {
      const routeId = result.data.route_id
      console.log("[app] Route ID successfully received:", routeId)
      setGeneratedRouteId(routeId)
      generatedRouteIdRef.current = routeId
      
      // Сохраняем в sessionStorage
      sessionStorage.setItem('last_generated_route_id', routeId)
      console.log("[app] Route ID saved to sessionStorage:", routeId)
      
    } else if (result.status === "error") {
      // Извлекаем сообщение об ошибке из разных возможных мест
      let errorMessage = result.error
      
      if (!errorMessage && result.data) {
        // Попробуем разные возможные форматы ошибок
        const errorData = result.data as any
        errorMessage = errorData.detail || 
                      errorData.message || 
                      errorData.error ||
                      errorData.error_description ||
                      "Неизвестная ошибка сервера"
      }
      
      errorMessage = errorMessage || "Неизвестная ошибка"
      
      console.error("[app] Route generation failed:", errorMessage)
      alert(`Ошибка при создании маршрута: ${errorMessage}`)
      setIsGeneratingRoute(false)
      generatedRouteIdRef.current = null
    } else {
      // Неожиданный статус
      console.error("[app] Unexpected result status:", result.status)
      alert("Неожиданный ответ от сервера. Попробуйте еще раз.")
      setIsGeneratingRoute(false)
      generatedRouteIdRef.current = null
    }
  } catch (error) {
    console.error("[app] Error in route generation:", error)
    alert("Произошла ошибка при создании маршрута. Попробуйте еще раз.")
    setIsGeneratingRoute(false)
    generatedRouteIdRef.current = null
  }
  return
}

  // Обычный переход для остальных шагов
  setCurrentStep(currentStep + 1)
}

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) => (prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]))
  }

  const isStepValid = () => {
    switch (currentStep) {
    case 1:
      return selectedCityId && coordinates.lat && coordinates.lng && address
      case 2:
        return timeOfDay && duration[0] > 0 && radius > 0
      case 3:
        return selectedInterests.length > 0
      case 4:
        return selectedMoods.length > 0
      case 5:
        return budget !== ""
      case 6:
        return true
      default:
        return false
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-sky-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-mint-600" />
      </div>
    )
  }

  // Обновите отображение RouteLoadingScreen для описания
if (isGeneratingDescription) {
  return (
    <>
      <Header />
      <RouteLoadingScreen 
        isGeneratingDescription 
        apiCompleted={descriptionApiCompleted} // Используем новый state
        onComplete={handleDescriptionComplete}
      />
    </>
  )
}

if (isGeneratingRoute) {
  return (
    <>
      <Header />
      <RouteLoadingScreen 
        isGeneratingRoute 
        routeId={generatedRouteIdRef.current || generatedRouteId}
        apiCompleted={!!(generatedRouteIdRef.current || generatedRouteId)} // Флаг завершения - когда есть routeId
        onComplete={handleRouteComplete}
      />
    </>
  )
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-sky-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="p-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Шаг {currentStep} из {totalSteps}</span>
              <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-mint-500 to-sky-500 transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: City and Start Point */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Откуда начнем?</h2>
                <p className="text-gray-600">Укажите данные точки отправления</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Выберите город</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {formData?.cities?.map((city: any) => (
                      <Button
                        key={city.id}
                        variant={selectedCityId === city.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedCityId(city.id) // Сохраняем ID города
                          console.log("[app] Selected city:", { id: city.id, name: city.name })
                        }}
                        className="w-full"
                      >
                        {city.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Адрес начальной точки</Label>
                  <div className="flex gap-2 mt-2">
                    <div className="flex-1">
                      <Input
                        id="address"
                        placeholder="Введите адрес или выберите на карте"
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                        onKeyPress={handleAddressKeyPress}
                        disabled={isSearching}
                      />
                    </div>
                    <Button 
                      onClick={handleSearchAddress} 
                      disabled={isSearching || !addressInput.trim()}
                    >
                      {isSearching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Можно ввести адрес или кликнуть на карту. Также можно перетащить метку.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Карта для выбора точки</Label>
                    {!mapReady && (
                      <span className="text-sm text-gray-500 flex items-center">
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        Загрузка карты...
                      </span>
                    )}
                  </div>
                  <div 
                    id="yandex-map" 
                    className="h-96 w-full rounded-lg border border-gray-200" 
                  />
                  <p className="text-xs text-gray-500">
                    • Перетащите синюю метку для изменения позиции
                    • Используйте поиск на карте для быстрого поиска
                    • Кликните на карту, чтобы установить точку
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Time and Duration */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Когда и сколько гуляем?</h2>
                <p className="text-gray-600">
                  Выберите время суток и примерную продолжительность прогулки.
                </p>
              </div>

              {/* Time of day */}
              <div className="space-y-3">
                <Label>Время суток</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "morning", label: "Утро", icon: Sunrise },
                    { id: "day", label: "День", icon: Sun },
                    { id: "evening", label: "Вечер", icon: Sunset },
                    { id: "night", label: "Ночь", icon: Moon },
                  ].map((item) => (
                    <Button
                      key={item.id}
                      type="button"
                      variant={timeOfDay === item.id ? "default" : "outline"}
                      className="justify-start gap-2"
                      onClick={() => setTimeOfDay(item.id)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <Label>Длительность прогулки</Label>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Минимум 1 час</span>
                  <span>{duration[0]} ч</span>
                </div>
                <Slider
                  value={duration}
                  min={1}
                  max={6}
                  step={1}
                  onValueChange={(value) => setDuration(value)}
                />
              </div>

              {/* Radius */}
              <div className="space-y-3">
                <Label>Радиус маршрута</Label>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Насколько далеко готовы отходить от стартовой точки</span>
                  <span>{radius.toFixed(1)} км</span>
                </div>
                <Slider
                  value={[radius]}
                  min={0.5}
                  max={5}
                  step={0.5}
                  onValueChange={(value) => setRadius(value[0])}
                />
              </div>
            </div>
          )}
          
          {/* Step 3: Interests - ПЛОТНОЕ РАСПОЛОЖЕНИЕ БЕЗ ПЕРЕКРЫТИЙ */}
{currentStep === 3 && (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Что вам интересно?</h2>
      <p className="text-gray-600">
        Выберите несколько вариантов — маршрут будет подстроен под ваши интересы.
      </p>
    </div>

    {/* Контейнер с горизонтальным скроллом - ПРАВИЛЬНЫЙ OVERFLOW */}
    <div className="mt-2 overflow-x-auto overflow-y-visible -mx-2 px-2 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" 
         style={{ minHeight: "260px" }}
    >
      {/* Вертикальный контейнер для двух рядов */}
      <div className="flex flex-col" style={{ minWidth: "max-content" }}>
        
        {/* ПЕРВЫЙ РЯД - С ЗАЗОРАМИ МЕЖДУ ПУЗЫРЬКАМИ */}
        <div className="flex items-center gap-1.5 -mb-3"> {/* mb-1 для отступа снизу */}
          {formData?.interests
            ?.filter((_: any, index: number) => index % 2 === 0)
            .map((interest: any, rowIndex: number) => {
            const isActive = selectedInterests.includes(interest.id)
            
            // Разные размеры для первого ряда
            const sizeClassesRow1 = [
              "w-46 h-46", // средний-большой
              "w-44 h-44", // средний
              "w-42 h-42", // средний-маленький
              "w-40 h-40", // маленький
            ]
            const sizeIndex1 = (rowIndex * 3) % sizeClassesRow1.length
            const sizeClass = sizeClassesRow1[sizeIndex1]
            
            // Вертикальные смещения - минимальные
            const verticalOffsets1 = [-6, -3, -8, -2, -1]
            const verticalIndex1 = (rowIndex * 5) % verticalOffsets1.length
            const verticalOffset = verticalOffsets1[verticalIndex1]
            
            // Вращение - минимальное
            const rotation = (rowIndex * 7) % 6 - 3 // от -3 до +3 градусов

            return (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggleInterest(interest.id)}
                className={`flex-shrink-0 rounded-full border flex items-center justify-center text-center transition-transform duration-200 ${sizeClass} ${
                  isActive
                    ? "border-mint-500 bg-mint-50 shadow-md ring-1 ring-mint-300 relative z-10"
                    : "border-gray-200 bg-white hover:border-mint-300 hover:bg-mint-50/70 shadow-sm relative"
                }`}
                style={{
                  transform: `translateY(${verticalOffset}px) rotate(${rotation}deg)`,
                  // При наведении поднимаем еще выше чтобы не выходил за границы
                  transformOrigin: 'center center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = `translateY(${verticalOffset - 4}px) rotate(${rotation}deg) scale(1.05)`
                  e.currentTarget.style.zIndex = '20'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `translateY(${verticalOffset}px) rotate(${rotation}deg)`
                  e.currentTarget.style.zIndex = isActive ? '10' : '1'
                }}
              >
                <div 
                  className="flex flex-col items-center justify-center gap-0.5 px-1.5 w-full h-full"
                  style={{ transform: `rotate(-${rotation}deg)` }}
                >
                  <span className="text-lg">{interest.emoji}</span>
                  <span className="text-xs font-semibold text-gray-900 text-balance leading-tight text-center">
                    {interest.label}
                  </span>
                  {interest.description && (
                    <span className="text-[10px] text-gray-600 line-clamp-2 leading-snug text-center">
                      {interest.description}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
        
        {/* ВТОРОЙ РЯД - С ЗАЗОРАМИ И СДВИГОМ */}
        <div className="flex items-center gap-1.5 mt-1 ml-10"> {/* mt-1 и ml-10 для сдвига */}
          {formData?.interests
            ?.filter((_: any, index: number) => index % 2 === 1)
            .map((interest: any, rowIndex: number) => {
            const isActive = selectedInterests.includes(interest.id)
            
            // Разные размеры для второго ряда - поменьше чем в первом
            const sizeClassesRow2 = [
              "w-40 h-40", // маленький
              "w-38 h-38", // очень маленький
              "w-42 h-42", // средний
              "w-44 h-44", // средний-большой
            ]
            const sizeIndex2 = (rowIndex * 3) % sizeClassesRow2.length
            const sizeClass = sizeClassesRow2[sizeIndex2]
            
            // Вертикальные смещения - вниз
            const verticalOffsets2 = [2, 4, 1, 5, 0]
            const verticalIndex2 = (rowIndex * 5) % verticalOffsets2.length
            const verticalOffset = verticalOffsets2[verticalIndex2]
            
            // Вращение - в другую сторону
            const rotation = (rowIndex * 9) % 8 - 4 // от -4 до +4 градусов

            return (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggleInterest(interest.id)}
                className={`flex-shrink-0 rounded-full border flex items-center justify-center text-center transition-transform duration-200 ${sizeClass} ${
                  isActive
                    ? "border-mint-500 bg-mint-50 shadow-md ring-1 ring-mint-300 relative z-10"
                    : "border-gray-200 bg-white hover:border-mint-300 hover:bg-mint-50/70 shadow-sm relative"
                }`}
                style={{
                  transform: `translateY(${verticalOffset}px) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = `translateY(${verticalOffset - 4}px) rotate(${rotation}deg) scale(1.05)`
                  e.currentTarget.style.zIndex = '20'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `translateY(${verticalOffset}px) rotate(${rotation}deg)`
                  e.currentTarget.style.zIndex = isActive ? '10' : '1'
                }}
              >
                <div 
                  className="flex flex-col items-center justify-center gap-0.5 px-1.5 w-full h-full"
                  style={{ transform: `rotate(-${rotation}deg)` }}
                >
                  <span className="text-base">{interest.emoji}</span>
                  <span className="text-xs font-semibold text-gray-900 text-balance leading-tight text-center">
                    {interest.label}
                  </span>
                  {interest.description && (
                    <span className="text-[9px] text-gray-600 line-clamp-2 leading-snug text-center">
                      {interest.description}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
        
      </div>
    </div>

    <p className="mt-2 text-sm text-gray-500 text-center">
      Пролистывайте пузырьки влево и вправо (можно колесом мыши с зажатым Shift).
    </p>
    
    {selectedInterests.length > 0 && (
      <div className="mt-4 p-3 bg-mint-50 border border-mint-200 rounded-lg">
        <p className="text-sm font-medium text-mint-800">
          Выбрано интересов: {selectedInterests.length}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedInterests.map(interestId => {
            const interest = formData?.interests?.find((i: any) => i.id === interestId)
            return interest ? (
              <span key={interestId} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-mint-300 rounded-full text-sm">
                <span>{interest.emoji}</span>
                <span>{interest.label}</span>
              </span>
            ) : null
          })}
        </div>
      </div>
    )}
  </div>
)}
          {/* Step 4: Mood */}
{currentStep === 4 && (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Какое у вас настроение?</h2>
      <p className="text-gray-600">
        Расскажите, как вы хотите провести прогулку — спокойно, активно, исследуя новое и т.д.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {formData?.moods?.map((moodItem: any) => (
        <button
          key={moodItem.id}
          type="button"
          onClick={() => toggleMood(moodItem.id)}
          className={`flex items-center justify-between rounded-xl border p-5 transition-all hover:shadow-md text-left ${
            selectedMoods.includes(moodItem.id)
              ? "border-sky-500 bg-sky-50 shadow-sm ring-2 ring-sky-300 ring-offset-1"
              : "border-gray-200 hover:border-sky-300 hover:bg-sky-50/50"
          }`}
        >
          <div className="flex flex-col items-start flex-1"> {/* Добавлены классы */}
            <span className="font-medium text-gray-900 text-left w-full">{moodItem.label}</span>
            {moodItem.description && (
              <span className="text-sm text-gray-600 mt-1 text-left w-full">{moodItem.description}</span>
            )}
          </div>
          <span className="text-3xl ml-4 flex-shrink-0">{moodItem.emoji}</span> {/* Увеличен размер emoji */}
        </button>
      ))}
    </div>
    
    {selectedMoods.length > 0 && (
      <div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-lg">
        <p className="text-sm font-medium text-sky-800">
          Выбрано настроений: {selectedMoods.length}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedMoods.map(moodId => {
            const mood = formData?.moods?.find((m: any) => m.id === moodId)
            return mood ? (
              <span key={moodId} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-sky-300 rounded-full text-sm">
                <span className="text-lg">{mood.emoji}</span>
                <span>{mood.label}</span>
              </span>
            ) : null
          })}
        </div>
      </div>
    )}
  </div>
)}

          {/* Step 5: Budget */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Бюджет прогулки</h2>
                <p className="text-gray-600">
                  Выберите вариант бюджета, который вам комфортен.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Бюджетно: 0-500р",
                  "Комфортно: 500-1500р",
                  "Гибкий бюджет: 1500-3000р",
                  "Премиально: 3000+р",
                ].map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={budget === option ? "default" : "outline"}
                    className="justify-start h-auto py-4"
                    onClick={() => setBudget(option)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{option.split(":")[0]}</div>
                      <div className="text-sm opacity-80">{option.split(":")[1]}</div>
                    </div>
                  </Button>
                ))}
              </div>
              {budget && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm font-medium text-amber-800">
                    Выбран бюджет: <span className="font-bold">{budget}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 6: Final review, AI description + user comments */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Почти готово</h2>
                <p className="text-gray-600">
                  Ниже — сгенерированное описание маршрута. Нажмите «Создать маршрут», чтобы получить подробный план.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="block mb-3">Описание маршрута</Label>
                  <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-mint-50 to-sky-50 p-5 text-gray-800 shadow-sm">
                    {aiDescription ? (
                      <div className="space-y-3">
                        <div className="text-lg font-semibold text-gray-900">🤖 Тропа рекомендует:</div>
                        <div className="text-base leading-relaxed">{aiDescription}</div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                        <p>Пожалуйста, подождите</p>
                        <p className="text-sm mt-1">Если текст не появился, попробуйте еще раз или немного измените ответы.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Ваши пожелания к маршруту (опционально)</Label>
                  <Textarea
                    id="comments"
                    placeholder="Например: хочу больше природных мест, избегать торговых центров и шумных улиц..."
                    value={userComments}
                    onChange={(e) => setUserComments(e.target.value)}
                    className="min-h-[140px] text-base p-4"
                  />
                  <p className="text-sm text-gray-500">
                    Эти пожелания не меняют уже сгенерированное описание, но будут учтены при создании финального маршрута.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isGenerating}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!isStepValid() || isGenerating}
              className="min-w-[140px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {currentStep === 6 ? "Создаем маршрут..." : "Загрузка..."}
                </>
              ) : currentStep === 6 ? (
                "Создать маршрут"
              ) : (
                <>
                  Далее
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}