"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  MapPin,
  Star,
  Navigation,
  ChevronRight,
  Sparkles,
  DollarSign,
  Info,
  Calendar,
  Users,
  Trophy,
  Route as RouteIcon,
  Loader2,
  CheckCircle,
  XCircle,
  PlayCircle,
  AlertCircle,
  PlusCircle,
  Coffee,
  Cookie,
  Pizza,
  Sandwich,
  IceCream,
  UtensilsCrossed,
  X,
} from "lucide-react"
import Link from "next/link"
import { getRoute, getAccessToken, updateRouteStatus, submitFeedback, addFoodPoint, getFormData, getFoodFormData } from "@/lib/api"
import type { RouteData, RoutePoint, FormData, Interest } from "@/lib/api"
import { toast } from "sonner"

export default function RoutePage() {
  const params = useParams()
  const router = useRouter()
  const routeId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [route, setRoute] = useState<RouteData | null>(null)
  const [error, setError] = useState("")
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [userRating, setUserRating] = useState<number | null>(null)
  
  // Состояния для добавления точки питания
  const [showAddFoodMenu, setShowAddFoodMenu] = useState<number | null>(null)
  const [foodInterests, setFoodInterests] = useState<Interest[]>([])
  const [isLoadingFoodInterests, setIsLoadingFoodInterests] = useState(false)
  const [selectedFoodInterest, setSelectedFoodInterest] = useState<string | null>(null)
  const [isAddingFoodPoint, setIsAddingFoodPoint] = useState(false)
  const [note, setNote] = useState("")
  const [showNoPointsError, setShowNoPointsError] = useState(false)

  useEffect(() => {
    const loadRoute = async () => {
      const token = getAccessToken()
      if (!token) {
        router.push("/login")
        return
      }

      try {
        console.log("[app] Loading route:", routeId)
        const result = await getRoute(routeId)
        
        if (result.status === "success" && result.data) {
          console.log("[app] Route data loaded:", result.data)
          setRoute(result.data)
          // Загружаем пищевые интересы
          loadFoodInterests()
        } else {
          setError(result.error || "Не удалось загрузить маршрут")
          console.error("[app] Route load error:", result.error)
        }
      } catch (err) {
        console.error("[app] Route page error:", err)
        setError("Ошибка при загрузке маршрута")
      } finally {
        setIsLoading(false)
      }
    }

    loadRoute()
  }, [routeId, router])

const loadFoodInterests = async () => {
  setIsLoadingFoodInterests(true)
  try {
    // Используем новую ручку для получения пищевых интересов
    const result = await getFoodFormData()
    
    if (result.status === "success" && result.data?.interests) {
      console.log("[app] Food interests loaded from food-form:", result.data.interests)
      
      // Преобразуем в формат Interest (добавляем emoji если нужно)
      const interests: Interest[] = result.data.interests.map(interest => ({
        id: interest.id,
        label: interest.label,
        description: interest.description,
        emoji: getInterestEmoji(interest.id) // Добавляем emoji
      }))
      
      setFoodInterests(interests)
    } else {
      console.error("[app] Failed to load food interests:", result.error)
      
      // Fallback: если новая ручка не работает, используем старый метод
      await loadFoodInterestsFallback()
    }
  } catch (err) {
    console.error("[app] Error loading food interests from food-form:", err)
    
    // Fallback в случае ошибки
    await loadFoodInterestsFallback()
  } finally {
    setIsLoadingFoodInterests(false)
  }
}

// Fallback функция на случай если новая ручка не работает
const loadFoodInterestsFallback = async () => {
  try {
    const result = await getFormData()
    let interests: Interest[] = []
    
    if (result.status === "success" && result.data) {
      // Пытаемся получить из бэкенда
      interests = result.data.interests.filter(interest => {
        const lowerLabel = interest.label.toLowerCase()
        const lowerId = interest.id.toLowerCase()
        
        // Расширенный список ключевых слов
        return (
          lowerId.includes('coffee') ||
          lowerId.includes('bars') ||
          lowerId.includes('fine_dining') ||
          lowerId.includes('unusual_food') ||
          lowerId.includes('food') ||
          lowerLabel.includes('кофе') ||
          lowerLabel.includes('кафе') ||
          lowerLabel.includes('ресторан') ||
          lowerLabel.includes('бар') ||
          lowerLabel.includes('еда') ||
          lowerLabel.includes('перекус')
        )
      })
      
      console.log("[app] Food interests from form-data (fallback):", interests)
    }
    
    // Если с бэкенда ничего не пришло, используем статический список
    if (interests.length === 0) {
      console.log("[app] Using static food interests list")
      interests = [
        {
          id: 'coffee',
          label: 'Кофе / Кафе',
          description: 'Кофейни и кафе',
          emoji: '☕'
        },
        {
          id: 'food',
          label: 'Ресторан / Еда',
          description: 'Рестораны и места для обеда',
          emoji: '🍽️'
        },
        {
          id: 'bars',
          label: 'Бары / Напитки',
          description: 'Бары и питейные заведения',
          emoji: '🍸'
        },
        {
          id: 'sweet',
          label: 'Сладкое / Десерты',
          description: 'Кондитерские и десертные кафе',
          emoji: '🍰'
        },
        {
          id: 'fast_food',
          label: 'Фастфуд / Быстрая еда',
          description: 'Быстрое питание',
          emoji: '🍔'
        },
        {
          id: 'unusual_food',
          label: 'Необычная еда',
          description: 'Экзотическая и необычная кухня',
          emoji: '🌮'
        }
      ]
    }
    
    setFoodInterests(interests)
    
  } catch (err) {
    console.error("[app] Error in fallback food interests:", err)
    
    // Всегда показываем статический список в случае ошибки
    const staticInterests: Interest[] = [
      {
        id: 'coffee',
        label: 'Кофе / Кафе',
        description: 'Кофейни и кафе',
        emoji: '☕'
      },
      {
        id: 'food',
        label: 'Ресторан / Еда',
        description: 'Рестораны и места для обеда',
        emoji: '🍽️'
      },
      {
        id: 'bars',
        label: 'Бары / Напитки',
        description: 'Бары и питейные заведения',
        emoji: '🍸'
      },
      {
        id: 'sweet',
        label: 'Сладкое / Десерты',
        description: 'Кондитерские и десертные кафе',
        emoji: '🍰'
      }
    ]
    
    setFoodInterests(staticInterests)
  }
}

// Функция для получения emoji по ID интереса
const getInterestEmoji = (interestId: string): string => {
  const emojiMap: Record<string, string> = {
    'coffee': '☕',
    'fine_dining': '🍽️',
    'bars': '🍸',
    'unusual_food': '🌮',
    'food': '🍔',
    'sweet': '🍰',
    'fast_food': '🍕',
  }
  
  return emojiMap[interestId] || '🍴'
}

  // Обновленная функция handleAddFoodPoint
const handleAddFoodPoint = async (betweenIndex: number, interest: string) => {
  if (!route) return
  
  setIsAddingFoodPoint(true)
  setSelectedFoodInterest(interest)
  
  try {
    const result = await addFoodPoint({
      route_id: route.route_id,
      between_index: betweenIndex + 1, // Бэкенд ожидает индексацию с 1
      interests: [interest],
      note: note.trim() || undefined,
    })
    
    if (result.status === "success" && result.data) {
      setRoute(result.data)
      toast.success("Точка питания успешно добавлена!", {
        description: "Маршрут обновлен с новой точкой"
      })
      // Сбрасываем состояние
      setShowAddFoodMenu(null)
      setSelectedFoodInterest(null)
      setNote("")
    } else {
      // Обработка различных ошибок
      if (result.error?.includes("No points found in radius") || 
          result.error?.includes("Нет точек в радиусе")) {
        
        // Показываем специальное сообщение для этой ошибки
        toast.error("Не найдено подходящих мест", {
          description: (
            <div className="mt-2 space-y-2">
              <p className="text-sm">В радиусе от этого участка маршрута нет заведений по вашему запросу.</p>
              <div className="text-xs space-y-1">
                <p className="font-medium">Попробуйте:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Выбрать другой участок маршрута (между другими точками)</li>
                  <li>Изменить тип заведения (например, вместо "бары" выбрать "кофе")</li>
                  <li>Или уточнить пожелания в комментарии</li>
                </ul>
              </div>
            </div>
          ),
          duration: 8000, // Показываем дольше
        })
        
        // Можно также показать подсказку рядом с кнопками
        setShowNoPointsError(true)
        
      } else {
        // Общая ошибка
        toast.error("Ошибка при добавлении точки", {
          description: result.error || "Попробуйте еще раз"
        })
      }
    }
  } catch (err) {
    console.error("[app] Error adding food point:", err)
    toast.error("Ошибка при добавлении точки питания")
  } finally {
    setIsAddingFoodPoint(false)
  }
}


  const getInterestIcon = (interestId: string) => {
  switch (interestId) {
    case 'coffee':
      return <Coffee className="h-4 w-4" />
    case 'bars':
      return <UtensilsCrossed className="h-4 w-4" />
    case 'fine_dining':
      return <UtensilsCrossed className="h-4 w-4" />
    case 'unusual_food':
      return <Pizza className="h-4 w-4" />
    case 'food':
      return <Sandwich className="h-4 w-4" />
    case 'sweet':
      return <IceCream className="h-4 w-4" />
    case 'fast_food':
      return <Cookie className="h-4 w-4" />
    default:
      return <Cookie className="h-4 w-4" />
  }
}
  const renderAddFoodButton = (index: number) => {
  if (showAddFoodMenu === index) {
    return (
      <div className="my-4 rounded-lg border-2 border-dashed border-mint-300 bg-mint-50 p-4 animate-in fade-in duration-300">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-mint-600" />
            <h4 className="font-semibold text-mint-800">Добавить точку питания</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-mint-100"
            onClick={() => {
              setShowAddFoodMenu(null)
              setSelectedFoodInterest(null)
              setNote("")
              setShowNoPointsError(false) // Сбрасываем ошибку при закрытии
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Сообщение об ошибке, если нет точек в радиусе */}
        {showNoPointsError && (
          <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-3 animate-in slide-in-from-top duration-300">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-amber-800 text-sm mb-1">
                  Не найдено подходящих мест поблизости
                </p>
                <p className="text-amber-700 text-xs mb-2">
                  В радиусе от этого участка маршрута нет заведений по вашему запросу.
                </p>
                <div className="text-amber-700 text-xs space-y-1">
                  <p className="font-medium">Что можно сделать:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Попробуйте выбрать другой участок маршрута</li>
                    <li>Измените тип заведения</li>
                    <li>Уточните пожелания в комментарии ниже</li>
                  </ul>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-amber-100"
                onClick={() => setShowNoPointsError(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        
        {isLoadingFoodInterests ? (
          <div className="flex flex-col items-center justify-center py-4 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-mint-600" />
            <p className="text-sm text-gray-500">Загрузка интересов...</p>
          </div>
        ) : foodInterests.length > 0 ? (
          <>
            <p className="mb-3 text-sm text-gray-600">
              Выберите, что вы хотите:
            </p>
            
            <div className="mb-4 flex flex-wrap gap-2">
  {foodInterests.map((interest) => {
    const isSelected = selectedFoodInterest === interest.id
    
    return (
      <button
        key={interest.id}
        type="button"
        className={`
          flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all
          ${isSelected
            ? 'bg-mint-200 text-gray-900 border-2 border-mint-600 shadow-md' // Более насыщенный фон и контур
            : 'bg-white text-gray-700 border border-mint-200 hover:bg-mint-50 hover:border-mint-300 hover:text-gray-900'
          }
          ${isAddingFoodPoint ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => !isAddingFoodPoint && setSelectedFoodInterest(interest.id)}
        disabled={isAddingFoodPoint}
      >
        {interest.emoji ? (
          <span className="text-base">{interest.emoji}</span>
        ) : (
          getInterestIcon(interest.id)
        )}
        <span className={isSelected ? "text-gray-900 font-bold" : "text-gray-700"}>
          {interest.label}
        </span>
      </button>
    )
  })}
</div>
            
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Дополнительные пожелания (поможет найти лучшее место):
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-mint-500 focus:ring-2 focus:ring-mint-200 transition-all"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Например: хочу атмосферное место, поближе к воде, с террасой, вегетарианские опции..."
                disabled={isAddingFoodPoint}
              />
             
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-gray-300 hover:bg-gray-50"
                onClick={() => {
                  setShowAddFoodMenu(null)
                  setSelectedFoodInterest(null)
                  setNote("")
                  setShowNoPointsError(false)
                }}
                disabled={isAddingFoodPoint}
              >
                Отмена
              </Button>
              <Button
                size="sm"
                className="flex-1 gap-2 bg-gradient-to-r from-mint-500 to-sky-500 hover:from-mint-600 hover:to-sky-600"
                onClick={() => selectedFoodInterest && handleAddFoodPoint(index, selectedFoodInterest)}
                disabled={!selectedFoodInterest || isAddingFoodPoint}
              >
                {isAddingFoodPoint ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Ищем место...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4" />
                    Найти и добавить
                  </>
                )}
              </Button>
            </div>
            
          </>
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Нет доступных интересов
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => loadFoodInterests()}
            >
              Обновить список
            </Button>
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className="my-4">
      <Button
        variant="outline"
        className="w-full gap-2 border-dashed border-mint-300 bg-mint-50 hover:bg-mint-100 hover:border-mint-400 text-mint-700"
        onClick={() => {
          setShowAddFoodMenu(index)
          setShowNoPointsError(false) // Сбрасываем ошибку при открытии нового меню
        }}
      >
        <PlusCircle className="h-4 w-4" />
        добавить место, где можно покушать
      </Button>
    </div>
  )
}

  const handleStatusUpdate = async (newStatus: "going" | "done" | "cancelled") => {
    if (!route) return
    
    setIsUpdatingStatus(true)
    try {
      const result = await updateRouteStatus(route.route_id, newStatus)
      
      if (result.status === "success") {
        setRoute(prev => prev ? { ...prev, status: newStatus } : null)
        const updatedResult = await getRoute(routeId)
        if (updatedResult.status === "success" && updatedResult.data) {
          setRoute(updatedResult.data)
        }
      } else {
        throw new Error(result.error || "Ошибка обновления статуса")
      }
    } catch (err) {
      console.error("[app] Status update error:", err)
      toast.error(err instanceof Error ? err.message : "Ошибка при обновлении статуса")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const getYandexMapsUrl = () => {
    if (route?.map_url) {
      return route.map_url;
    }
    
    if (!route?.points.length) return 'https://yandex.ru/maps';
    
    const points = route.points.map(p => `${p.coordinates.lat},${p.coordinates.lng}`);
    
    if (navigator.geolocation) {
      return `https://yandex.ru/maps/?mode=routes&rtext=~${points.join('~')}&rtt=pd`;
    }
    
    return `https://yandex.ru/maps/?mode=routes&rtext=${points.join('~')}&rtt=pd`;
  };

  const formatTimeSafe = (value: number | undefined) => {
    if (value === undefined || value === null || isNaN(value)) {
      console.warn("[RoutePage] Invalid time value:", value)
      return "Не указано"
    }
    const hours = Math.floor(value / 60)
    const mins = value % 60
    if (hours === 0) return `${mins} мин`
    return `${hours} ч ${mins} мин`
  }

  const formatDistanceSafe = (value: number | undefined) => {
    if (value === undefined || value === null || isNaN(value)) {
      console.warn("[RoutePage] Invalid distance value:", value)
      return "Не указано"
    }
    if (value < 1000) return `${Math.round(value)} м`
    return `${(value / 1000).toFixed(1)} км`
  }

  const openInYandexMaps = (point: RoutePoint) => {
    const { lat, lng } = point.coordinates
    const url = `https://yandex.ru/maps/?pt=${lng},${lat}&z=16&l=map`
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const openRouteInYandexMaps = () => {
    const url = getYandexMapsUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmitFeedback = async () => {
    if (!route) return
    
    setIsSubmittingFeedback(true)
    
    try {
      const result = await submitFeedback(route.route_id, rating, comment)
      
      if (result.status === "success") {
        setHasRated(true)
        setUserRating(rating)
        setShowFeedbackModal(false)
        setComment("")
        toast.success("Спасибо за ваш отзыв!")
      } else {
        toast.error(`Ошибка: ${result.error || "Не удалось отправить отзыв"}`)
      }
    } catch (error) {
      console.error("Feedback error:", error)
      toast.error("Произошла ошибка при отправке отзыва")
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const handleEditRating = () => {
    setShowFeedbackModal(true)
  }

  const StatusUpdateButtons = () => {
  if (!route) return null
  
  // Определяем какие кнопки показывать в зависимости от текущего статуса
  const showStartButton = route.status !== "going" && route.status !== "cancelled"
  const showCompleteButton = route.status === "going"
  const showCancelButton = route.status !== "cancelled" && route.status !== "done"
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {showStartButton && (
        <Button
          size="sm"
          variant="outline"
          className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
          onClick={() => handleStatusUpdate("going")}
          disabled={isUpdatingStatus}
        >
          <PlayCircle className="h-4 w-4" />
          Начать маршрут
        </Button>
      )}
      
      {showCompleteButton && (
        <Button
          size="sm"
          variant="outline"
          className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
          onClick={() => handleStatusUpdate("done")}
          disabled={isUpdatingStatus}
        >
          <CheckCircle className="h-4 w-4" />
          Завершить
        </Button>
      )}
      
      {showCancelButton && (
        <Button
          size="sm"
          variant="outline"
          className="gap-2 border-red-300 text-red-700 hover:bg-red-50"
          onClick={() => handleStatusUpdate("cancelled")}
          disabled={isUpdatingStatus}
        >
          <XCircle className="h-4 w-4" />
          Отменить
        </Button>
      )}
    </div>
  )
}

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-sky-50">
        <Header />
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
          <Loader2 className="w-8 h-8 animate-spin text-mint-600" />
        </div>
      </div>
    )
  }

  if (error || !route) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-sky-50">
        <Header />
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
          <Card className="w-full max-w-md border border-gray-200 shadow-lg">
            <CardContent className="flex flex-col items-center py-8 text-center">
              <Info className="h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-lg font-semibold">Ошибка</h3>
              <p className="mt-2 text-sm text-gray-600">
                {error || "Маршрут не найден"}
              </p>
              <div className="mt-6">
                <Button onClick={() => router.push("/dashboard")} variant="default">
                  Вернуться в ЛК
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-sky-50">
      <Header />

      <div className="container mx-auto px-4 py-8 md:px-6">
        {/* Route Header */}
        <Card className="mb-8 border border-gray-200 shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="secondary" className={
                    route.status === "going" 
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : route.status === "done"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }>
                    {route.status === "going" ? "В процессе" : 
                     route.status === "done" ? "Завершен" : "Отменен"}
                  </Badge>
                </div>

                <CardTitle className="mb-3 text-3xl text-gray-900">
                  {route.description || "Персонализированный маршрут"}
                </CardTitle>
                
                {isUpdatingStatus && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Обновление статуса...</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 bg-transparent border-gray-300"
                  onClick={openRouteInYandexMaps}
                >
                  <Navigation className="h-4 w-4" />
                  Открыть в Яндекс.Картах
                </Button>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint-100">
                  <Clock className="h-5 w-5 text-mint-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Общая длительность</p>
                  <p className="font-semibold text-gray-900">{formatTimeSafe(route.total_duration)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Общая дистанция</p>
                  <p className="font-semibold text-gray-900">{formatDistanceSafe(route.total_meters)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Примерный бюджет</p>
                  <p className="font-semibold text-gray-900">{route.total_cost} ₽</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Точек в маршруте</p>
                  <p className="font-semibold text-gray-900">{route.points.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Route Timeline */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Маршрут</h2>
              <p className="text-sm text-gray-600">
                Последовательность точек вашего путешествия
              </p>
            </div>

            <div className="space-y-4">
              {route.points.map((point, index) => (
                <div key={`${point.id}-${index}`}> {/* Используем комбинированный ключ */}
                  <Card className="border border-gray-200 shadow-sm transition-all hover:shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        {/* Step Number */}
                        <div className="flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-500 text-lg font-bold text-gray-900">
                            {index + 1}
                          </div>

                          {/* Коннектор для кнопки добавления */}
                          {index < route.points.length - 1 && (
                            <div className="mt-2 h-8 w-0.5 bg-gradient-to-b from-mint-300 to-transparent" />
                          )}
                        </div>

                        {/* Point Details */}
                        <div className="flex-1 pb-4">
                          <div className="mb-3 flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {point.name}
                                </h3>
                                {/* Рейтинг точки */}
                                {point.average_rating > 0 && (
                                  <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs">
                                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                    <span className="font-medium text-amber-700">
                                      {point.average_rating.toFixed(1)}
                                    </span>
                                    <span className="text-amber-600">
                                      ({point.reviews_count})
                                    </span>
                                  </div>
                                )}
                              </div>
                              <p className="mb-2 text-sm leading-relaxed text-gray-600">
                                {point.description}
                              </p>
                              
                              {/* REASON (ОСНОВНАЯ ФИЧА) */}
                              {point.reason && (
                                <div className="mb-3 rounded-lg bg-mint-50 p-3 border border-mint-200">
                                  <div className="flex items-start gap-2">
                                    <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-mint-600" />
                                    <div>
                                      <p className="text-xs font-medium text-mint-800 mb-1">
                                        Почему мы выбрали это место:
                                      </p>
                                      <p className="text-sm leading-relaxed text-gray-700">
                                        {point.reason}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {point.tags && point.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {point.tags.map((tag, tagIndex) => (
                                    <Badge 
                                      key={`${point.id}-tag-${tagIndex}`} 
                                      variant="secondary"
                                      className="bg-sky-100 text-sky-800 border-sky-200 text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 border-gray-300 hover:bg-gray-50"
                              onClick={() => openInYandexMaps(point)}
                            >
                              <Navigation className="h-4 w-4" />
                              Открыть в Яндекс.Картах
                            </Button>
                            <Button
      variant="outline"
      size="sm"
      className="gap-2 border-mint-300 hover:bg-mint-50 text-mint-700"
      asChild
    >
      <Link href={`/point/${point.id}`}>
        <Info className="h-4 w-4" />
        Подробнее
      </Link>
    </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Кнопка добавления точки питания между точками */}
                  {index < route.points.length - 1 && renderAddFoodButton(index)}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button 
                className="w-full gap-2 bg-gradient-to-r from-mint-500 to-sky-500 hover:from-mint-600 hover:to-sky-600" 
                size="lg"
                onClick={openRouteInYandexMaps}
              >
                <Navigation className="h-5 w-5" />
                Открыть весь маршрут в Яндекс.Картах
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics Card */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Статистика маршрута</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Время пешком</span>
                  <span className="font-semibold text-gray-900">{formatTimeSafe(route.walk_time)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Время на посещение</span>
                  <span className="font-semibold text-gray-900">{formatTimeSafe(route.visit_time)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Дата создания</span>
                  <span className="font-semibold text-gray-900">
                    {route.created_at ? new Date(route.created_at).toLocaleDateString("ru-RU") : "Не указана"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Map Preview */}
            <Card className="border border-gray-200 shadow-sm min-h-[150px]">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Карта маршрута</CardTitle>
              </CardHeader>
              
              <div className="-mt-6 p-6">
                <Button 
                  className="w-full gap-2 bg-gradient-to-r from-mint-500 to-sky-500 hover:from-mint-600 hover:to-sky-600" 
                  size="lg"
                  onClick={openRouteInYandexMaps}
                >
                  <Navigation className="h-5 w-5" />
                  Открыть весь маршрут в Яндекс.Картах
                </Button>
              </div>
            </Card>

           {/* Status Actions */}
<Card className="border border-mint-200 bg-gradient-to-br from-mint-50 to-sky-50 shadow-sm">
  <CardContent className="pt-0">
    <div className="mb-4 flex items-center gap-2">
      <AlertCircle className="h-5 w-5 text-amber-600" />
      <h3 className="font-semibold text-gray-900">Управление маршрутом</h3>
    </div>
    
    {/* Проверка статуса маршрута */}
    {route.status === "cancelled" ? (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-red-600">
          <X className="h-5 w-5" />
          <p className="font-medium">Маршрут отменен</p>
        </div>
          <p className="text-sm text-black-700">
            Управлять маршрутом больше нельзя 😔
          </p>
          <p className="text-xs text-black-600 mt-2">
            Вы можете создать новый маршрут с похожими параметрами
          </p>

        <Button 
          variant="outline" 
          className="w-full border-gray-300 hover:bg-gray-100"
          onClick={() => router.push("/dashboard")}
        >
          Вернуться к моим маршрутам
        </Button>
      </div>
    ) : (
      <>
        <p className="mb-4 text-sm leading-relaxed text-gray-700">
          Измените статус маршрута в зависимости от вашего прогресса
        </p>
        <div className="space-y-2">
          <StatusUpdateButtons />
        </div>
      </>
    )}
  </CardContent>
</Card>

            {/* Actions - Встроенная форма оценки */}
            <Card className="border border-mint-200 bg-gradient-to-br from-mint-50 to-sky-50 shadow-sm">
              <CardContent className="pt-0">
                {!showFeedbackModal ? (
                  <>
                    <div className="mb-4 flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-600" />
                      <h3 className="font-semibold text-gray-900">Оцените маршрут</h3>
                    </div>
                    
                    {hasRated ? (
                      <div className="space-y-4">
                        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-green-800">Спасибо за вашу оценку!</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-sm text-green-600">Вы поставили</span>
                                <span className="text-sm font-medium text-green-700">{userRating}</span>
                                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                              </div>
                            </div>
                          </div>
                          
                          {comment && (
                            <div className="mt-3 p-3 bg-white rounded border border-green-100">
                              <p className="text-sm text-gray-700">Ваш комментарий:</p>
                              <p className="text-sm text-gray-600 mt-1 italic">"{comment}"</p>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full gap-2 bg-white border-mint-300 hover:bg-mint-50 transition-all"
                          onClick={handleEditRating}
                          disabled={route?.status !== "done"}
                        >
                          <Star className="h-4 w-4" />
                          Изменить оценку
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700">
                          Поделитесь впечатлениями после прохождения маршрута
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full gap-2 bg-white border-gray-300 hover:bg-gray-50 transition-all"
                          onClick={() => setShowFeedbackModal(true)}
                          disabled={route?.status !== "done"}
                        >
                          <Star className="h-4 w-4" />
                          {route?.status === "done" ? "Оценить маршрут" : "Оценить можно после завершения"}
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-600" />
                        <h3 className="font-semibold text-gray-900">
                          {hasRated ? "Изменить оценку" : "Ваш отзыв"}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Ваша оценка:
                      </label>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`p-1.5 transition-all duration-200 transform hover:scale-110 ${
                              rating >= star
                                ? 'text-yellow-500 hover:text-yellow-600'
                                : 'text-gray-300 hover:text-gray-400'
                            }`}
                            onClick={() => setRating(star)}
                            disabled={isSubmittingFeedback}
                          >
                            <svg 
                              className="w-8 h-8" 
                              fill="currentColor" 
                              viewBox="0 0 24 24"
                              stroke={rating >= star ? "currentColor" : "none"}
                              strokeWidth={rating >= star ? 0 : 1}
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                      <div className="text-center text-sm text-gray-600">
                        {rating === 1 && "Плохо"}
                        {rating === 2 && "Не очень"}
                        {rating === 3 && "Нормально"}
                        {rating === 4 && "Хорошо"}
                        {rating === 5 && "Отлично!"}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Комментарий (необязательно):
                      </label>
                      <textarea
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-mint-500 focus:ring-2 focus:ring-mint-200 focus:ring-offset-1 transition-all"
                        rows={2}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={hasRated ? "Обновленный комментарий..." : "Что понравилось или можно улучшить?"}
                        disabled={isSubmittingFeedback}
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFeedbackModal(false)}
                        className="flex-1 border-gray-300 hover:bg-gray-50 transition-all"
                        disabled={isSubmittingFeedback}
                      >
                        Отмена
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSubmitFeedback}
                        className="flex-1 bg-gradient-to-r from-mint-500 to-sky-500 hover:from-mint-600 hover:to-sky-600 transition-all"
                        disabled={isSubmittingFeedback}
                      >
                        {isSubmittingFeedback ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Отправка...
                          </>
                        ) : hasRated ? (
                          "Обновить оценку"
                        ) : (
                          "Отправить отзыв"
                        )}
                      </Button>
                    </div>
                    
                    {isSubmittingFeedback && (
                      <div className="text-xs text-center text-gray-500 pt-1">
                        Отправляем ваш отзыв...
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button 
              variant="outline" 
              className="w-full gap-2 bg-transparent border-gray-300 hover:bg-gray-50" 
              asChild
            >
              <Link href="/dashboard">
                <ChevronRight className="h-4 w-4" />
                Вернуться в ЛК
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}