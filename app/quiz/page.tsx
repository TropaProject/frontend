"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"
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

// Границы для Москвы (прямоугольник)
const moscowBounds = {
  north: 55.913052, // верхняя граница
  south: 55.574655, // нижняя граница
  west: 37.371297,  // левая граница
  east: 37.834939   // правая граница
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
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Refs для доступа к актуальным значениям в обработчиках карты
  const selectedCityIdRef = useRef<string>("")
  const coordinatesRef = useRef({ lat: 55.76, lng: 37.64 })

  // Функция проверки координат для Москвы
  const isWithinMoscowBounds = (lat: number, lng: number): boolean => {
    return (
      lat >= moscowBounds.south &&
      lat <= moscowBounds.north &&
      lng >= moscowBounds.west &&
      lng <= moscowBounds.east
    )
  }

  // Получаем название города по ID
  const selectedCityName = formData?.cities?.find((c: any) => c.id === selectedCityId)?.name || ""

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

  // Обновляем ref при изменении selectedCityId
  useEffect(() => {
    selectedCityIdRef.current = selectedCityId
  }, [selectedCityId])

  // Обновляем ref при изменении coordinates
  useEffect(() => {
    coordinatesRef.current = coordinates
  }, [coordinates])

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
    setCurrentStep(6)
  }

  const handleRouteComplete = () => {
    console.log("[app] Route generation complete, navigating to route")
    console.log("[app] Generated Route ID from state:", generatedRouteId)
    console.log("[app] Generated Route ID from ref:", generatedRouteIdRef.current)
    
    setIsGeneratingRoute(false)
    
    const routeId = generatedRouteIdRef.current || generatedRouteId
    
    if (routeId) {
      console.log("[app] Route ID found, navigating to /route/", routeId)
      setTimeout(() => {
        router.push(`/route/${routeId}`)
      }, 300)
    } else {
      console.error("[app] No route ID found in both ref and state!")
      
      const storedRouteId = sessionStorage.getItem('last_generated_route_id')
      if (storedRouteId) {
        console.log("[app] Found route ID in sessionStorage:", storedRouteId)
        setTimeout(() => {
          router.push(`/route/${storedRouteId}`)
        }, 300)
      } else {
        alert("Ошибка: ID маршрута не найден. Попробуйте еще раз.")
        
        setIsGeneratingRoute(false)
        setCurrentStep(5)
      }
    }
  }

  // Инициализация карты
  useEffect(() => {
    if (currentStep !== 1) return
    
    console.log("[app] Starting map initialization for step", currentStep)

    const initMap = async () => {
      try {
        const apiKey = await getYandexMapsApiKey()
        console.log("[app] API key received:", apiKey ? "Yes" : "No")
        
        if (!apiKey) {
          console.error("[app] No Yandex Maps API key")
          return
        }

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

        console.log("[app] Waiting for ymaps.ready...")
        await new Promise((resolve) => {
          window.ymaps.ready(resolve)
        })

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
                setTimeout(checkElement, 200)
              }
            }
            
            checkElement()
          })
        }

        const mapElement = await waitForElement()
        console.log("[app] Map element found, creating map...")

        const map = new window.ymaps.Map("yandex-map", {
          center: [coordinates.lat, coordinates.lng],
          zoom: 12,
          controls: ["zoomControl", "fullscreenControl"]
        })

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

        // Обработчик перетаскивания метки
        placemark.events.add("dragend", async () => {
          const coords = placemark.geometry.getCoordinates()
          const currentCityId = selectedCityIdRef.current
          const currentCoords = coordinatesRef.current
          
          console.log("[app] Placemark dragged to:", coords, "city:", currentCityId)
          
          // Проверяем, выбран ли город
          if (!currentCityId) {
            setErrorMessage("Сначала выберите город")
            placemark.geometry.setCoordinates([currentCoords.lat, currentCoords.lng])
            return
          }
          
          // Проверяем координаты только для Москвы
          if (currentCityId === "moscow" && !isWithinMoscowBounds(coords[0], coords[1])) {
            setErrorMessage("Метка находится за пределами выбранного города. Пожалуйста, переместите метку в пределах города.")
            placemark.geometry.setCoordinates([currentCoords.lat, currentCoords.lng])
            return
          }
          
          setCoordinates({ lat: coords[0], lng: coords[1] })
          setErrorMessage("")
          
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

        // Клик по карте
        map.events.add("click", async (e: any) => {
          const coords = e.get("coords")
          const currentCityId = selectedCityIdRef.current
          
          console.log("[app] Map clicked at:", coords, "city:", currentCityId)
          
          // Проверяем, выбран ли город
          if (!currentCityId) {
            setErrorMessage("Сначала выберите город")
            return
          }
          
          // Проверяем координаты только для Москвы
          if (currentCityId === "moscow" && !isWithinMoscowBounds(coords[0], coords[1])) {
            setErrorMessage("Точка находится за пределами выбранного города. Пожалуйста, выберите точку в пределах города.")
            return
          }
          
          setCoordinates({ lat: coords[0], lng: coords[1] })
          placemark.geometry.setCoordinates(coords)
          setErrorMessage("")
          
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
        mapObjectsRef.current = { map, placemark }
        setMapReady(true)
        console.log("[app] Map initialized successfully!")
        
      } catch (error) {
        console.error("[app] Map initialization failed:", error)
      }
    }

    const timer = setTimeout(() => {
      initMap()
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [currentStep])

  // Эффект для включения/выключения карты при выборе города
  useEffect(() => {
    if (!mapObjectsRef.current || !mapReady) return
    
    const { map } = mapObjectsRef.current
    
    try {
      const mapElement = map.container.getElement()
      if (selectedCityId) {
        mapElement.style.pointerEvents = 'auto'
        mapElement.style.opacity = '1'
        console.log("[app] Map enabled for city:", selectedCityId)
      } else {
        mapElement.style.pointerEvents = 'none'
        mapElement.style.opacity = '0.7'
        console.log("[app] Map disabled - no city selected")
      }
    } catch (error) {
      console.error("[app] Error updating map styles:", error)
    }
  }, [selectedCityId, mapReady])

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

  // Функция поиска адреса
  const handleSearchAddress = async () => {
    if (!addressInput.trim() || !mapObjectsRef.current) return
    
    setIsSearching(true)
    setErrorMessage("")
    
    try {
      const { map, placemark } = mapObjectsRef.current
      
      const geocoder = await window.ymaps.geocode(addressInput)
      const firstGeoObject = geocoder.geoObjects.get(0)
      
      if (!firstGeoObject) {
        setErrorMessage("Адрес не найден. Попробуйте другой вариант.")
        return
      }
      
      const coords = firstGeoObject.geometry.getCoordinates()
      const foundAddress = firstGeoObject.getAddressLine()
      
      // Проверяем, выбран ли город
      if (!selectedCityId) {
        setErrorMessage("Сначала выберите город")
        return
      }
      
      // Проверяем координаты только для Москвы
      if (selectedCityId === "moscow" && !isWithinMoscowBounds(coords[0], coords[1])) {
        setErrorMessage("Адрес находится за пределами выбранного города. Пожалуйста, выберите адрес в пределах города.")
        return
      }
      
      // Обновляем состояние
      setCoordinates({ lat: coords[0], lng: coords[1] })
      setAddress(foundAddress)
      setAddressInput(foundAddress)
      setErrorMessage("")
      
      // Обновляем карту
      placemark.geometry.setCoordinates(coords)
      map.setCenter(coords, 15)
      
      placemark.properties.set({
        balloonContent: foundAddress
      })
      placemark.balloon.open()
      
    } catch (error) {
      console.error("[app] Geocoding error:", error)
      setErrorMessage("Ошибка при поиске адреса")
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddressKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchAddress()
    }
  }

  const handleNext = async () => {
    if (currentStep === 5) {
      setIsGeneratingDescription(true)
      setDescriptionApiCompleted(false)
      
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
          setDescriptionApiCompleted(true)
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
          
          sessionStorage.setItem('last_generated_route_id', routeId)
          console.log("[app] Route ID saved to sessionStorage:", routeId)
          
        } else if (result.status === "error") {
          let errorMessage = result.error
          
          if (!errorMessage && result.data) {
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
        if (!selectedCityId || !coordinates.lat || !coordinates.lng || !address) {
          return false
        }
        
        // Для Москвы проверяем границы
        if (selectedCityId === "moscow") {
          return isWithinMoscowBounds(coordinates.lat, coordinates.lng)
        }
        
        return true
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

  if (isGeneratingDescription) {
    return (
      <>
        <Header />
        <RouteLoadingScreen 
          isGeneratingDescription 
          apiCompleted={descriptionApiCompleted}
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
          apiCompleted={!!(generatedRouteIdRef.current || generatedRouteId)}
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
                  <div className="mb-3">
                    <Label className="text-base font-semibold block">Выберите ваш город</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Это поможет настроить сервис под ваш регион
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData?.cities?.map((city: any) => (
                      <div
                        key={city.id}
                        className={`
                          p-4 rounded-lg border cursor-pointer transition-all
                          flex items-center gap-3 group
                          ${selectedCityId === city.id 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-border hover:border-primary/30 hover:bg-muted/50'
                          }
                        `}
                        onClick={() => {
                          setSelectedCityId(city.id)
                          setErrorMessage("")
                          console.log("[app] Selected city:", { id: city.id, name: city.name })
                        }}
                      >
                        {/* Индикатор выбора */}
                        <div className="flex-shrink-0">
                          {selectedCityId === city.id ? (
                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-primary/50" />
                          )}
                        </div>
                        
                        <span className="font-medium flex-1">{city.name}</span>
                      </div>
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
                  
                  {/* Отображение ошибки */}
                  {errorMessage && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                      ⚠️ {errorMessage}
                    </div>
                  )}
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
                  
                  {/* Статус выбора города - ТОЛЬКО ПРЕДУПРЕЖДЕНИЕ если город не выбран */}
                  {!selectedCityId && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                      ⚠️ Сначала выберите город, чтобы использовать карту
                    </div>
                  )}
                  <div 
                    id="yandex-map" 
                    className={`h-96 w-full rounded-lg border ${!selectedCityId ? 'border-amber-300 opacity-70' : 'border-gray-200'}`}
                    
                  />
                  <p className="text-xs text-gray-500 mt-2">
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
          
          {/* Step 3: Interests */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Что вам интересно?</h2>
                <p className="text-gray-600">
                  Выберите несколько вариантов — маршрут будет подстроен под ваши интересы.
                </p>
              </div>

              <div className="mt-2 overflow-x-auto overflow-y-visible -mx-2 px-2 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" 
                   style={{ minHeight: "260px" }}
              >
                <div className="flex flex-col" style={{ minWidth: "max-content" }}>
                  <div className="flex items-center gap-1.5 -mb-3">
                    {formData?.interests
                      ?.filter((_: any, index: number) => index % 2 === 0)
                      .map((interest: any, rowIndex: number) => {
                      const isActive = selectedInterests.includes(interest.id)
                      
                      const sizeClassesRow1 = [
                        "w-46 h-46",
                        "w-44 h-44",
                        "w-42 h-42",
                        "w-40 h-40",
                      ]
                      const sizeIndex1 = (rowIndex * 3) % sizeClassesRow1.length
                      const sizeClass = sizeClassesRow1[sizeIndex1]
                      
                      const verticalOffsets1 = [-6, -3, -8, -2, -1]
                      const verticalIndex1 = (rowIndex * 5) % verticalOffsets1.length
                      const verticalOffset = verticalOffsets1[verticalIndex1]
                      
                      const rotation = (rowIndex * 7) % 6 - 3

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
                  
                  <div className="flex items-center gap-1.5 mt-1 ml-10">
                    {formData?.interests
                      ?.filter((_: any, index: number) => index % 2 === 1)
                      .map((interest: any, rowIndex: number) => {
                      const isActive = selectedInterests.includes(interest.id)
                      
                      const sizeClassesRow2 = [
                        "w-40 h-40",
                        "w-38 h-38",
                        "w-42 h-42",
                        "w-44 h-44",
                      ]
                      const sizeIndex2 = (rowIndex * 3) % sizeClassesRow2.length
                      const sizeClass = sizeClassesRow2[sizeIndex2]
                      
                      const verticalOffsets2 = [2, 4, 1, 5, 0]
                      const verticalIndex2 = (rowIndex * 5) % verticalOffsets2.length
                      const verticalOffset = verticalOffsets2[verticalIndex2]
                      
                      const rotation = (rowIndex * 9) % 8 - 4

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
                    <div className="flex flex-col items-start flex-1">
                      <span className="font-medium text-gray-900 text-left w-full">{moodItem.label}</span>
                      {moodItem.description && (
                        <span className="text-sm text-gray-600 mt-1 text-left w-full">{moodItem.description}</span>
                      )}
                    </div>
                    <span className="text-3xl ml-4 flex-shrink-0">{moodItem.emoji}</span>
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
          <div className="flex justify-between mt-3 pt-6 border-t border-gray-200">
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