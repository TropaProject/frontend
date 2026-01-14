"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { getRefreshToken, clearTokens, getUserFavorites } from "@/lib/api"
import {
  Clock,
  MapPin,
  Star,
  Navigation,
  Heart,
  HeartOff,
  Edit,
  Save,
  X,
  ChevronLeft,
  Calendar,
  Users,
  Tag,
  Globe,
  Phone,
  Wallet,
  Coffee,
  Sparkles,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  Filter,
  ThumbsUp,
  Share2,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock as ClockIcon,
  Sunrise,
  Sun,
  Moon,
  Droplets,
  Wind,
  Cloud,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { getAccessToken } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

// Типы данных
interface PointDetail {
  id: string
  name: string
  description: string
  image_url: string
  address: string
  city: string
  area: string
  coordinates: {
    lat: number
    lng: number
  }
  average_visit_duration: number
  average_cost: number
  average_rating: number
  reviews_count: number
  tags: string[]
  interests: Array<{ id: number; label: string }>
  moods: Array<{ id: number; label: string }>
  best_visit_time: string[]
  working_hours: Record<string, string>
  seasonality: {
    is_seasonal: boolean
    months: number[]
  }
  analytics: {
    view_count: number
    success_rate: number
    last_viewed_at: string
  }
  last_reviews: Array<{
    user_id: number
    username: string
    rating: number
    comment: string
    created_at: string
  }>
}

interface Review {
  user_id: number
  username: string
  rating: number
  comment: string
  created_at: string
}

interface FavoritePoint {
  id: string
  name: string
  image_url: string
  description: string
  average_rating: number
  coordinates: { lat: number; lng: number }
  note: string
  added_at: string
}

export default function PointDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pointId = params.id as string

  // Основные состояния
  const [point, setPoint] = useState<PointDetail | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Избранное
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [favoriteNote, setFavoriteNote] = useState("")
  const [isSavingNote, setIsSavingNote] = useState(false)
  
  // Отзывы
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  })
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [userReview, setUserReview] = useState<Review | null>(null)
  
  // Пагинация отзывов
  const [reviewsPage, setReviewsPage] = useState(1)
  const [reviewsTotal, setReviewsTotal] = useState(0)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const pageSize = 10

  // API функции для работы с точками
  const fetchPointDetail = async (id: string): Promise<{ status: string; data?: PointDetail; error?: string }> => {
    try {
      const token = getAccessToken()
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (token) headers["Authorization"] = `Bearer ${token}`

      const response = await fetch(`/api/point/${id}/detail`, { headers })
      return await response.json()
    } catch (error) {
      console.error("Fetch point detail error:", error)
      return { status: "error", error: "Network error" }
    }
  }

  const fetchReviews = async (id: string, page: number, pageSize: number) => {
    try {
      const response = await fetch(`/api/point/${id}/reviews?page=${page}&page_size=${pageSize}`)
      return await response.json()
    } catch (error) {
      console.error("Fetch reviews error:", error)
      return { status: "error", error: "Network error" }
    }
  }

  const submitReview = async (id: string, rating: number, comment: string) => {
  try {
    const token = getAccessToken()
    if (!token) throw new Error("Not authenticated")

    const response = await fetch(`/api/point/${id}/create-review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
    })
    const result = await response.json()
    
    // Если получили новый токен - сохраняем его
    if (result.new_access_token) {
      localStorage.setItem("access_token", result.new_access_token);
      console.log("Access token updated from review submission");
    }
    
    return result
  } catch (error) {
    console.error("Submit review error:", error)
    return { status: "error", error: "Network error" }
  }
}

  const toggleFavoriteStatus = async (id: string, refreshToken?: string | null) => {
  try {
    const token = getAccessToken()
    if (!token) throw new Error("Not authenticated")

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }
    
    // Добавляем refresh токен в заголовок, если он есть
    if (refreshToken) {
      headers["X-Refresh-Token"] = refreshToken;
    }

    const response = await fetch(`/api/point/${id}/favorite`, {
      method: "POST",
      headers,
    })
    const result = await response.json()
    
    // Если получили новый токен - сохраняем его
    if (result.new_access_token) {
      localStorage.setItem("access_token", result.new_access_token);
      console.log("Access token updated from favorite toggle");
    }
    
    return result
  } catch (error) {
    console.error("Toggle favorite error:", error)
    return { status: "error", error: "Network error" }
  }
}

  const updateNote = async (id: string, note: string) => {
    try {
      const token = getAccessToken()
      if (!token) throw new Error("Not authenticated")

      const response = await fetch(`/api/point/${id}/favorite/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ note }),
      })
      return await response.json()
    } catch (error) {
      console.error("Update note error:", error)
      return { status: "error", error: "Network error" }
    }
  }

  const fetchFavorites = async (): Promise<{ 
  status: string; 
  data?: FavoritePoint[]; 
  error?: string;
  code?: string;
  new_access_token?: string;
}> => {
  try {
    const token = getAccessToken()
    if (!token) throw new Error("Not authenticated")

    const response = await fetch("/api/point/favorites", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
    return await response.json()
  } catch (error) {
    console.error("Fetch favorites error:", error)
    return { status: "error", error: "Network error" }
  }
}

  // Загрузка данных точки
  useEffect(() => {
    const loadPointData = async () => {
      setIsLoading(true)
      setError("")
      
      try {
        // Загружаем детали точки
        const pointResult = await fetchPointDetail(pointId)
        
        if (pointResult.status === "success" && pointResult.data) {
          setPoint(pointResult.data)
          
          // Проверяем, в избранном ли точка
          await checkIfFavorite(pointResult.data.id)
          
          // Загружаем отзывы
          await loadReviews(1)
        } else {
          setError(pointResult.error || "Не удалось загрузить информацию о месте")
        }
      } catch (err) {
        console.error("Point detail error:", err)
        setError("Ошибка при загрузке данных")
      } finally {
        setIsLoading(false)
      }
    }

    loadPointData()
  }, [pointId])

  // Проверка, в избранном ли точка
  const checkIfFavorite = async (id: string) => {
  const token = getAccessToken()
  if (!token) {
    setIsFavorite(false)
    return
  }

  try {
    const favoritesResult = await getUserFavorites()
    if (favoritesResult.status === "success" && favoritesResult.data) {
      const isFav = favoritesResult.data.some((fav: FavoritePoint) => fav.id === id)
      setIsFavorite(isFav)
      
      // Если точка в избранном, загружаем заметку
      if (isFav) {
        const favorite = favoritesResult.data.find((fav: FavoritePoint) => fav.id === id)
        setFavoriteNote(favorite?.note || "")
      }
    } else if (favoritesResult.error?.includes("token") || favoritesResult.error?.includes("expired")) {
      // Токен истек и не обновился - перенаправляем на логин
      clearTokens()
      router.push("/login?reason=session_expired")
    }
  } catch (err) {
    console.error("Check favorite error:", err)
  }
}

  // Загрузка отзывов
  const loadReviews = async (page: number) => {
    setReviewsLoading(true)
    try {
      const reviewsResult = await fetchReviews(pointId, page, pageSize)
      if (reviewsResult.status === "success" && reviewsResult.data) {
        const data = reviewsResult.data
        
        if (page === 1) {
          setReviews(data.reviews)
        } else {
          setReviews(prev => [...prev, ...data.reviews])
        }
        
        setReviewsTotal(data.total)
        
        // Проверяем, есть ли отзыв текущего пользователя
        const token = getAccessToken()
        if (token && data.reviews.length > 0) {
          // В реальном приложении нужно получить user_id из токена
          // Для демо пока не реализуем
        }
      }
    } catch (err) {
      console.error("Load reviews error:", err)
      toast.error("Не удалось загрузить отзывы")
    } finally {
      setReviewsLoading(false)
    }
  }

  // Обработка избранного
  const handleToggleFavorite = async () => {
  const token = getAccessToken()
  if (!token) {
    toast.info("Для добавления в избранное нужно войти в систему")
    router.push("/login?redirect=/point/" + pointId)
    return
  }

  setFavoriteLoading(true)
  try {
    // Получаем refresh токен для отправки
    const refreshToken = getRefreshToken();
    
    // Отправляем запрос с заголовком refresh токена
    const result = await toggleFavoriteStatus(pointId, refreshToken)
    if (result.status === "success") {
      const newFavoriteState = result.data?.status === "added"
      setIsFavorite(newFavoriteState)
      
      toast.success(newFavoriteState ? "Добавлено в избранное" : "Удалено из избранного")
      
      // Если получили новый токен - сохраняем его
      if (result.data?.new_access_token) {
        localStorage.setItem("access_token", result.data.new_access_token);
        console.log("Access token updated from response");
      }
      
      // Если удалили из избранного, сбрасываем заметку
      if (!newFavoriteState) {
        setFavoriteNote("")
        setShowNoteForm(false)
      }
    } else {
      toast.error(result.error || "Ошибка при обновлении избранного")
    }
  } catch (err) {
    console.error("Toggle favorite error:", err)
    toast.error("Ошибка при обновлении избранного")
  } finally {
    setFavoriteLoading(false)
  }
}

  // Сохранение заметки к избранному
  const handleSaveNote = async () => {
    if (!isFavorite) return

    setIsSavingNote(true)
    try {
      const result = await updateNote(pointId, favoriteNote)
      if (result.status === "success") {
        toast.success("Заметка сохранена")
        setShowNoteForm(false)
      } else {
        toast.error(result.error || "Ошибка при сохранении заметки")
      }
    } catch (err) {
      console.error("Save note error:", err)
      toast.error("Ошибка при сохранении заметки")
    } finally {
      setIsSavingNote(false)
    }
  }

  // Отправка отзыва
  const handleSubmitReview = async () => {
    const token = getAccessToken()
    if (!token) {
      toast.info("Для оставления отзыва нужно войти в систему")
      router.push("/login?redirect=/point/" + pointId)
      return
    }

    if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) {
      toast.error("Поставьте оценку от 1 до 5")
      return
    }

    setIsSubmittingReview(true)
    try {
      const result = await submitReview(pointId, reviewForm.rating, reviewForm.comment)
      if (result.status === "success") {
        toast.success(result.data?.created ? "Отзыв создан" : "Отзыв обновлен")
        setShowReviewForm(false)
        setReviewForm({ rating: 5, comment: "" })
        
        // Перезагружаем отзывы
        await loadReviews(1)
        
        // Обновляем средний рейтинг точки
        if (point) {
          const pointResult = await fetchPointDetail(pointId)
          if (pointResult.status === "success" && pointResult.data) {
            setPoint(pointResult.data)
          }
        }
      } else {
        toast.error(result.error || "Ошибка при отправке отзыва")
      }
    } catch (err) {
      console.error("Submit review error:", err)
      toast.error("Ошибка при отправке отзыва")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  // Вспомогательные функции
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return ""
    }
  }

  const getWorkingHoursStatus = () => {
    if (!point?.working_hours) return null
    
    const now = new Date()
    const dayKey = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase().slice(0, 3)
    const hours = point.working_hours[dayKey]
    
    if (!hours) return null
    
    try {
      const [openTime, closeTime] = hours.split('–')
      const [openHour, openMinute] = openTime.split(':').map(Number)
      const [closeHour, closeMinute] = closeTime.split(':').map(Number)
      
      const openDate = new Date()
      openDate.setHours(openHour, openMinute, 0)
      
      const closeDate = new Date()
      closeDate.setHours(closeHour, closeMinute, 0)
      
      if (now < openDate) {
        return { status: "closed", text: `Откроется в ${openTime}` }
      } else if (now > closeDate) {
        return { status: "closed", text: `Закрыто до завтра` }
      } else {
        return { status: "open", text: `Открыто до ${closeTime}` }
      }
    } catch {
      return { status: "unknown", text: hours }
    }
  }

  const getTimeIcon = (time: string) => {
    switch (time) {
      case "morning":
        return <Sunrise className="h-4 w-4" />
      case "day":
        return <Sun className="h-4 w-4" />
      case "evening":
        return <Moon className="h-4 w-4" />
      default:
        return <ClockIcon className="h-4 w-4" />
    }
  }

  const getTimeLabel = (time: string) => {
    switch (time) {
      case "morning":
        return "Утро"
    case "afternoon":
        return "Полдень"
      case "day":
        return "День"
      case "evening":
        return "Вечер"
      default:
        return time
    }
  }

  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "romantic":
        return <Heart className="h-4 w-4 text-pink-500" />
      case "inspiration":
        return <Sparkles className="h-4 w-4 text-purple-500" />
      case "chill":
        return <Cloud className="h-4 w-4 text-blue-500" />
      case "explore":
        return <Navigation className="h-4 w-4 text-green-500" />
      case "party":
        return <Users className="h-4 w-4 text-yellow-500" />
      case "spontaneous":
        return <Wind className="h-4 w-4 text-orange-500" />
      default:
        return <Sparkles className="h-4 w-4 text-gray-500" />
    }
  }

  // Рендеринг звезд рейтинга
  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizes = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    }
    
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizes[size]} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : star <= Math.floor(rating) + 0.5
                ? "fill-yellow-300 text-yellow-300"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    )
  }

  // Скелетон загрузки
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !point) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4" />
              Назад
            </Button>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Место не найдено</h3>
                <p className="text-gray-600 mb-6">{error || "Запрашиваемая точка не существует или была удалена"}</p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => router.back()}>
                    Вернуться назад
                  </Button>
                  <Button onClick={() => router.push("/dashboard")}>
                    В личный кабинет
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const workingHoursStatus = getWorkingHoursStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Хлебные крошки и навигация */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4" />
              Назад
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/dashboard" className="hover:text-mint-600 transition-colors">
                Личный кабинет
              </Link>
              <ChevronLeft className="h-3 w-3 rotate-180" />
              <span className="font-medium text-gray-700">{point.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
            >
              {favoriteLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isFavorite ? (
                <>
                  <BookmarkCheck className="h-4 w-4 text-mint-600" />
                  В избранном
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  В избранное
                </>
              )}
            </Button>
            
            

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                const shareUrl = window.location.href
                const shareText = `Посмотрите на ${point.name} в ${point.city}`
                
                if (navigator.share) {
                  navigator.share({
                    title: point.name,
                    text: shareText,
                    url: shareUrl,
                  })
                } else {
                  navigator.clipboard.writeText(shareUrl)
                  toast.success("Ссылка скопирована в буфер обмена")
                }
              }}
            >
              <Share2 className="h-4 w-4" />
              Поделиться
            </Button>
          </div>
        </div>

        {/* Основная информация о точке */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Левая колонка - основная информация */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200 shadow-sm overflow-hidden">
              {/* Изображение */}
              <div className="relative h-64 md:h-80 bg-gradient-to-r from-mint-100 to-sky-100">
                {point.image_url ? (
                  <img
                    src={point.image_url}
                    alt={point.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="h-16 w-16 text-mint-300" />
                  </div>
                )}
                
                {/* Бейдж рейтинга */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-3 py-2 shadow-sm">
                    {renderStars(point.average_rating)}
                    <span className="text-sm font-medium text-gray-700">
                      ({point.reviews_count})
                    </span>
                  </div>
                </div>
                
                {/* Статус работы */}
                {workingHoursStatus && (
                  <div className={`absolute top-4 right-4 rounded-full px-3 py-2 text-sm font-medium ${
                    workingHoursStatus.status === "open" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {workingHoursStatus.text}
                  </div>
                )}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl md:text-3xl text-gray-900 mb-2">
                      {point.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{point.address}, {point.city}</span>
                      {point.area && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-500">{point.area}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Теги и категории */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {point.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-mint-100 text-mint-800 hover:bg-mint-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Описание */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Описание</h3>
                  <p className="text-gray-700 leading-relaxed">{point.description}</p>
                </div>

                <Separator />

                {/* Статистика */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  <div className="text-center">
    <div className="flex items-center justify-center gap-1 mb-1">
      <Clock className="h-4 w-4 text-mint-600" />
      <span className="text-sm font-medium text-gray-700">Время посещения</span>
    </div>
    <p className="text-lg font-bold text-gray-900">{point.average_visit_duration} мин</p>
  </div>
  
  <div className="text-center">
    <div className="flex items-center justify-center gap-1 mb-1">
      <Wallet className="h-4 w-4 text-mint-600" />
      <span className="text-sm font-medium text-gray-700">Средний чек</span>
    </div>
    <p className="text-lg font-bold text-gray-900">{point.average_cost} ₽</p>
  </div>
  
  <div className="text-center">
    <div className="flex items-center justify-center gap-1 mb-1">
      <Users className="h-4 w-4 text-mint-600" />
      <span className="text-sm font-medium text-gray-700">Отзывы</span>
    </div>
    <p className="text-lg font-bold text-gray-900">{point.reviews_count}</p>
  </div>
</div>

                {/* Интересы и настроения */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Подходит для интересов:</h4>
                    <div className="flex flex-wrap gap-2">
                      {point.interests?.map((interest) => (
                        <Badge key={interest.id} variant="outline" className="bg-sky-50 border-sky-200">
                          {interest.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Соответствует настроению:</h4>
                    <div className="flex flex-wrap gap-2">
                      {point.moods?.map((mood) => (
                        <Badge key={mood.id} variant="outline" className="flex items-center gap-1 bg-purple-50 border-purple-200">
                          {getMoodIcon(mood.label)}
                          {mood.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Лучшее время для посещения */}
                {point.best_visit_time && point.best_visit_time.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Лучшее время для посещения:</h4>
                    <div className="flex flex-wrap gap-2">
                      {point.best_visit_time.map((time) => (
                        <Badge key={time} variant="outline" className="flex items-center gap-1 bg-amber-50 border-amber-200">
                          {getTimeIcon(time)}
                          {getTimeLabel(time)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Сезонность */}
                {point.seasonality?.is_seasonal && (
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Сезонное место</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Лучше всего посещать с {point.seasonality.months[0] || 1} по {point.seasonality.months[point.seasonality.months.length - 1] || 12} месяц
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Правая колонка - детали и действия */}
          <div className="space-y-6">
            {/* Карточка с координатами и действиями */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Открыть на карте</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => {
                      const url = `https://yandex.ru/maps/?pt=${point.coordinates.lng},${point.coordinates.lat}&z=16&l=map`
                      window.open(url, '_blank')
                    }}
                  >
                    <Navigation className="h-4 w-4" />
                    Яндекс Карты
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => {
                      const url = `https://www.google.com/maps/search/?api=1&query=${point.coordinates.lat},${point.coordinates.lng}`
                      window.open(url, '_blank')
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Google Карты
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Часы работы */}
            {point.working_hours && Object.keys(point.working_hours).length > 0 && (
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Часы работы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(() => {
  // Определяем формат ключей (2 или 3 буквы)
  const firstKey = Object.keys(point.working_hours)[0];
  const isTwoLetterFormat = firstKey && firstKey.length === 2;
  
  // Порядок дней недели
  const dayOrder = isTwoLetterFormat 
    ? ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    : ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  
  // Преобразуем объект в массив и сортируем
  const sortedEntries = Object.entries(point.working_hours)
    .sort(([dayA], [dayB]) => {
      const indexA = dayOrder.findIndex(d => 
        d.toLowerCase() === dayA.toLowerCase().slice(0, d.length)
      );
      const indexB = dayOrder.findIndex(d => 
        d.toLowerCase() === dayB.toLowerCase().slice(0, d.length)
      );
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
  
  // Получаем сегодняшний день
  const todayShort = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const todayKey = isTwoLetterFormat 
    ? todayShort.slice(0, 2) 
    : todayShort.toLowerCase().slice(0, 3);
  
  // Маппинг для полных названий
  const dayMapping: Record<string, string> = {
    // 2-буквенный формат
    'Mo': 'Понедельник',
    'Tu': 'Вторник', 
    'We': 'Среда',
    'Th': 'Четверг',
    'Fr': 'Пятница',
    'Sa': 'Суббота',
    'Su': 'Воскресенье',
    'mo': 'Понедельник',
  'tu': 'Вторник',
  'we': 'Среда',
  'th': 'Четверг',
  'fr': 'Пятница',
  'sa': 'Суббота',
  'su': 'Воскресенье',
  'mon': 'Понедельник',
  'tue': 'Вторник',
  'wed': 'Среда',
  'thu': 'Четверг',
  'fri': 'Пятница',
  'sat': 'Суббота',
  'sun': 'Воскресенье',
   'Mon': 'Понедельник',
  'Tue': 'Вторник',
  'Wed': 'Среда',
  'Thu': 'Четверг',
  'Fri': 'Пятница',
  'Sat': 'Суббота',
  'Sun': 'Воскресенье',
  };
  
  return sortedEntries.map(([day, hours]) => {
    // Нормализуем день для сравнения
    const normalizedDay = isTwoLetterFormat 
      ? day.slice(0, 2)
      : day.toLowerCase().slice(0, 3);
    
    const isToday = normalizedDay.toLowerCase() === todayKey.toLowerCase();
    
    // Получаем полное название дня
    const displayName = dayMapping[normalizedDay] || dayMapping[day] || day;
    
    return (
      <div key={day} className={`flex justify-between items-center py-2 ${isToday ? 'bg-mint-50 rounded px-2' : ''}`}>
        <span className={`text-sm font-medium ${isToday ? 'text-mint-700' : 'text-gray-700'}`}>
          {displayName}
          {isToday && ' (сегодня)'}
        </span>
        <span className={`text-sm ${isToday ? 'font-semibold text-mint-800' : 'text-gray-600'}`}>
          {hours}
        </span>
      </div>
    );
  });
})()}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Избранное с заметкой */}
            <Card className="border border-mint-200 bg-gradient-to-br from-mint-50 to-sky-50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Избранное</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isFavorite ? (
                  <>
                    <div className="flex items-center gap-2 text-mint-700">
                      <BookmarkCheck className="h-5 w-5" />
                      <span className="font-medium">В вашем избранном</span>
                    </div>
                    
                    {!showNoteForm ? (
                      <>
                        {favoriteNote ? (
                          <div className="rounded-lg bg-white border border-mint-200 p-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
  <h4 className="text-sm font-medium text-gray-700">Ваша заметка:</h4>
  <Button
    variant="ghost"
    size="sm"
    className="h-6 w-6 p-0 flex-shrink-0"
    onClick={() => setShowNoteForm(true)}
  >
    <Edit className="h-3 w-3" />
  </Button>
</div>
<p className="text-sm text-gray-600 italic whitespace-pre-wrap break-words min-h-[20px]">
  {favoriteNote}
</p>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 border-mint-300 text-mint-700 hover:bg-mint-100"
                            onClick={() => setShowNoteForm(true)}
                          >
                            <Edit className="h-4 w-4" />
                            Добавить заметку
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Ваша заметка:
                          </label>
                          <Textarea
                            value={favoriteNote}
                            onChange={(e) => setFavoriteNote(e.target.value)}
                            placeholder="Хочу посетить весной, взять с собой друга..."
                            className="min-h-[100px] resize-none"
                            disabled={isSavingNote}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setShowNoteForm(false)}
                            disabled={isSavingNote}
                          >
                            Отмена
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 gap-2 bg-gradient-to-r from-mint-500 to-sky-500 hover:from-mint-600 hover:to-sky-600"
                            onClick={handleSaveNote}
                            disabled={isSavingNote}
                          >
                            {isSavingNote ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 border-red-300 text-red-700 hover:bg-red-50"
                      onClick={handleToggleFavorite}
                      disabled={favoriteLoading}
                    >
                      {favoriteLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                      Удалить из избранного
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-gray-600 mb-2">
                      Добавьте место в избранное, чтобы сохранить его и добавить заметки
                    </div>
                    <Button
                      size="sm"
                      className="w-full gap-2 bg-gradient-to-r from-mint-500 to-sky-500 hover:from-mint-600 hover:to-sky-600"
                      onClick={handleToggleFavorite}
                      disabled={favoriteLoading}
                    >
                      {favoriteLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                      Добавить в избранное
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Табы с отзывами и другой информацией */}
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Отзывы ({point.reviews_count})
            </TabsTrigger>
            <TabsTrigger value="similar" className="gap-2">
              <MapPin className="h-4 w-4" />
              Похожие места
            </TabsTrigger>
            <TabsTrigger value="routes" className="gap-2">
              <Navigation className="h-4 w-4" />
              Маршруты с этим местом 
            </TabsTrigger>
          </TabsList>

          {/* Вкладка с отзывами */}
          <TabsContent value="reviews" className="space-y-6">
            {/* Форма отзыва */}
            {!showReviewForm ? (
              <Card className="border border-mint-200 bg-gradient-to-br from-mint-50 to-sky-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Оставить отзыв</h3>
                      <p className="text-sm text-gray-600">Поделитесь вашими впечатлениями</p>
                    </div>
                    <Button
                      onClick={() => setShowReviewForm(true)}
                      className="gap-2 bg-gradient-to-r from-mint-500 to-sky-500 hover:from-mint-600 hover:to-sky-600"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Написать отзыв
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-mint-200">
                <CardContent className="-pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Ваш отзыв</h3>
                      <p className="text-sm text-gray-600">Ваше мнение поможет другим пользователям</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReviewForm(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Ваша оценка:
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`p-1 transition-all duration-200 hover:scale-110 ${
                              reviewForm.rating >= star
                                ? 'text-yellow-500 hover:text-yellow-600'
                                : 'text-gray-300 hover:text-gray-400'
                            }`}
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            disabled={isSubmittingReview}
                          >
                            <svg 
                              className="w-8 h-8" 
                              fill="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                      <div className="text-left text-sm text-gray-600">
                        {reviewForm.rating === 1 && "Плохо"}
                        {reviewForm.rating === 2 && "Не очень"}
                        {reviewForm.rating === 3 && "Нормально"}
                        {reviewForm.rating === 4 && "Хорошо"}
                        {reviewForm.rating === 5 && "Отлично!"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Комментарий:
                      </label>
                      <Textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Расскажите о ваших впечатлениях, что понравилось, что можно улучшить..."
                        className="min-h-[120px] resize-none"
                        disabled={isSubmittingReview}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowReviewForm(false)}
                        disabled={isSubmittingReview}
                      >
                        Отмена
                      </Button>
                      <Button
                        className="flex-1 gap-2 bg-gradient-to-r from-mint-500 to-sky-500 hover:from-mint-600 hover:to-sky-600"
                        onClick={handleSubmitReview}
                        disabled={isSubmittingReview}
                      >
                        {isSubmittingReview ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Отправка...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="h-4 w-4" />
                            Отправить отзыв
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Список отзывов */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Отзывы пользователей ({reviewsTotal})
                </h3>
               
              </div>

              {reviewsLoading && reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-mint-600 mb-4" />
                  <p className="text-gray-600">Загружаем отзывы...</p>
                </div>
              ) : reviews.length === 0 ? (
                <Card className="border border-gray-200">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Отзывов пока нет</h4>
                    <p className="text-gray-600 text-center mb-6 max-w-md">
                      Будьте первым, кто поделится впечатлениями об этом месте!
                    </p>
                    <Button
                      onClick={() => setShowReviewForm(true)}
                      className="gap-2 bg-gradient-to-r from-mint-500 to-sky-500 hover:from-mint-600 hover:to-sky-600"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Написать первый отзыв
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <Card key={index} className="border border-gray-200">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-mint-100 text-mint-700">
                                  {review.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {review.username}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(review.created_at)}</span>
                                  <span className="text-gray-400">•</span>
                                  <span>{formatTime(review.created_at)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating, "sm")}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 leading-relaxed mb-4">
                            {review.comment}
                          </p>
                          
                         
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Пагинация */}
                  {reviewsTotal > reviews.length && (
                    <div className="flex justify-center pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const nextPage = reviewsPage + 1
                          setReviewsPage(nextPage)
                          loadReviews(nextPage)
                        }}
                        disabled={reviewsLoading}
                      >
                        {reviewsLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Загрузка...
                          </>
                        ) : (
                          "Загрузить ещё"
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {/* Вкладка с похожими местами */}
          <TabsContent value="similar">
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Похожие места</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Функция поиска похожих мест скоро будет доступна
                  </p>
                  <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    Создать маршрут
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка с маршрутами */}
          <TabsContent value="routes">
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Navigation className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Маршруты с этим местом (скоро)</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Здесь будут отображаться маршруты, в которые входит это место
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => router.push("/dashboard")}>
                      Мои маршруты
                    </Button>
                    <Button onClick={() => router.push("/quiz")}>
                      Создать новый маршрут
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}