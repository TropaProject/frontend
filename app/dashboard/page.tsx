"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, MapPin, Calendar, TrendingUp, Clock, Star, Loader2, AlertCircle, User, Navigation, Trophy, Wallet, Target, Users, Route } from "lucide-react"
import Link from "next/link"
import { getUser, getUserRoutes, getUserStatistics, getAccessToken } from "@/lib/api"
import type { UserData, RouteListItem, UserStatistics } from "@/lib/api"
import { useRouter } from "next/navigation"
import {  CheckCircle, XCircle } from "lucide-react"
import { updateRouteStatus } from "@/lib/api"

interface BackendUserData {
  id?: number
  user_id?: number
  email?: string
  username?: string
  first_name?: string
  last_name?: string
  date_joined?: string
  created_at?: string
  [key: string]: any
}

export default function DashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [stats, setStats] = useState<UserStatistics | null>(null)
  const [routes, setRoutes] = useState<RouteListItem[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const loadDashboardData = async () => {
      const token = getAccessToken()
      console.log("[app] Dashboard: checking token...", !!token)

      if (!token) {
        console.log("[app] Dashboard: no token, redirecting to login")
        router.push("/login")
        return
      }

      try {
        console.log("[app] Dashboard: loading data...")

        // Загружаем последовательно, чтобы видеть ошибки
        const userResponse = await getUser()
        console.log("[app] Dashboard: user response:", userResponse)

        if (userResponse.status === "success") {
          const backendData = userResponse.data as BackendUserData
          console.log("[app] Dashboard: backend user data structure:", backendData)
          
          const formattedUserData: UserData = {
            id: backendData.id || backendData.user_id || 0,
            email: backendData.email || "Не указано",
            username: backendData.username || 
                     backendData.first_name || 
                     backendData.email?.split('@')[0] || 
                     "Пользователь",
            date_joined: backendData.date_joined || 
                        backendData.created_at || 
                        new Date().toISOString()
          }
          
          console.log("[app] Dashboard: formatted user data:", formattedUserData)
          setUserData(formattedUserData)
        } else {
          console.error("[app] Dashboard: user API error:", userResponse.error)
          if (userResponse.error?.includes("Token") || userResponse.error?.includes("expired")) {
            router.push("/login")
            return
          }
        }

        // Загружаем статистику
        const statsResponse = await getUserStatistics()
        console.log("[app] Dashboard: stats response:", statsResponse)
        console.log("[app] Dashboard: RAW stats response:", statsResponse);
console.log("[app] Dashboard: total_distance_km value:", statsResponse.data?.total_distance_km);
        
        if (statsResponse.status === "success" && statsResponse.data) {
          console.log("[app] Dashboard: setting stats:", statsResponse.data)
          
          const formattedStats: UserStatistics = {
            total_routes: statsResponse.data.total_routes || 0,
            completed_routes: statsResponse.data.completed_routes || 0,
            active_routes: statsResponse.data.active_routes || 0,
            total_duration_minutes: statsResponse.data.total_duration_minutes || 
                                   statsResponse.data.total_duration || 0,
            total_distance_km: statsResponse.data.total_distance_km || 0,
            total_cost: statsResponse.data.total_cost || 0,
            unique_places: statsResponse.data.unique_places || 0,
            favourite_city: statsResponse.data.favourite_city || "Не указан",
            last_activity: statsResponse.data.last_activity || new Date().toISOString()
          }
          
          setStats(formattedStats)
        }

        // Загружаем маршруты
        // Загружаем маршруты
        const routesResponse = await getUserRoutes()
        console.log("[app] Dashboard: routes response:", routesResponse)

        if (routesResponse.status === "success" && routesResponse.data) {
          console.log("[app] Dashboard: setting routes:", routesResponse.data)
          
          // Приводим статусы к нужному типу
          const typedRoutes = routesResponse.data.map(route => ({
            ...route,
            status: (route.status as "going" | "done" | "cancelled") || "going"
          }))
          
          setRoutes(typedRoutes)
        }

      } catch (err) {
        console.error("[app] Dashboard: error loading data:", err)
        setError("Не удалось загрузить данные. Попробуйте обновить страницу.")
        
        if (err instanceof Error && err.message.includes("401")) {
          router.push("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [router, mounted])

  const getInitials = (email: string | undefined) => {
    if (!email) return "УП"
    const emailPart = email.split('@')[0]
    return emailPart.substring(0, 2).toUpperCase()
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("ru-RU", { 
        day: "numeric", 
        month: "long", 
        year: "numeric" 
      })
    } catch {
      return "Не указано"
    }
  }

  const formatShortDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("ru-RU", { 
        day: "numeric", 
        month: "short" 
      })
    } catch {
      return ""
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "done":
        return { 
          label: "Пройден", 
          className: "bg-green-100 text-green-800 border-green-200" 
        }
      case "going":
        return { 
          label: "В процессе", 
          className: "bg-blue-100 text-blue-800 border-blue-200" 
        }
      case "cancelled":
        return { 
          label: "Отменен", 
          className: "bg-gray-100 text-gray-800 border-gray-200" 
        }
      default:
        return { 
          label: status, 
          className: "bg-gray-100 text-gray-800 border-gray-200" 
        }
    }
  }

  // Показываем скелетон пока грузится
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-sky-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {/* Скелетон профиля */}
          <div className="mb-8">
            <div className="animate-pulse rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-48 rounded bg-gray-200"></div>
                  <div className="h-4 w-64 rounded bg-gray-200"></div>
                  <div className="h-3 w-32 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Скелетон статистики */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse rounded-lg bg-white p-4 shadow-sm">
                <div className="h-4 w-20 rounded bg-gray-200 mb-2"></div>
                <div className="h-8 w-12 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
          
          {/* Скелетон маршрутов */}
          <div className="space-y-4">
            <div className="h-8 w-48 rounded bg-gray-200"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-lg bg-white p-6 shadow-sm">
                  <div className="space-y-3">
                    <div className="h-5 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-4 w-20 rounded bg-gray-200"></div>
                      <div className="h-4 w-20 rounded bg-gray-200"></div>
                    </div>
                    <div className="h-9 w-full rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-sky-50">
        <Header />
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
          <Card className="w-full max-w-md border border-gray-200 shadow-lg">
            <CardContent className="flex flex-col items-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-lg font-semibold">Ошибка загрузки</h3>
              <p className="mt-2 text-sm text-gray-600">{error}</p>
              <div className="mt-6 flex gap-3">
                <Button onClick={() => window.location.reload()} variant="default">
                  Попробовать снова
                </Button>
                <Button onClick={() => router.push("/login")} variant="outline">
                  Войти заново
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

      <div className="container mx-auto px-4 py-8">
        {/* User Profile Section - УПРОЩЕННАЯ */}
        <div className="mb-8">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-mint-200 shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-mint-100 to-sky-100 text-lg font-semibold text-mint-700">
                      {userData ? getInitials(userData.email) : <User className="h-6 w-6" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {userData?.username || "Пользователь"}
                    </h1>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Участник с {userData?.date_joined ? formatDate(userData.date_joined) : "недавнего времени"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => console.log("Edit profile clicked")}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Редактировать профиль
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Statistics Section - ОДНА ЕДИНАЯ СЕКЦИЯ */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ваша активность</h2>
              <p className="text-sm text-gray-600">Общая статистика по маршрутам</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Обновлено: {stats?.last_activity ? formatShortDate(stats.last_activity) : "сегодня"}</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* Всего маршрутов */}
            <Card className="border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Всего маршрутов</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{stats?.total_routes || 0}</p>
                  </div>
                  <div className="rounded-lg bg-mint-100 p-2">
                    <Route className="h-5 w-5 text-mint-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{stats?.active_routes || 0} активных</span>
                  <span>{stats?.completed_routes || 0} завершено</span>
                </div>
              </CardContent>
            </Card>

            {/* Пройдено км */}
            <Card className="border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Пройдено км</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stats?.total_distance_km?.toFixed(1) || "0.0"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Navigation className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  {stats?.total_duration_minutes 
                    ? `${Math.round(stats.total_duration_minutes / 60)} ч ${stats.total_duration_minutes % 60} мин` 
                    : "0 мин"} в пути
                </div>
              </CardContent>
            </Card>

            {/* Уникальных мест */}
            <Card className="border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Уникальных мест</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{stats?.unique_places || 0}</p>
                  </div>
                  <div className="rounded-lg bg-purple-100 p-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  {stats?.total_routes 
                    ? `${Math.round((stats.unique_places / stats.total_routes) * 10) / 10} мест/маршрут` 
                    : "0 мест/маршрут"}
                </div>
              </CardContent>
            </Card>

            {/* Затрачено */}
            <Card className="border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Затрачено</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{stats?.total_cost || 0} ₽</p>
                  </div>
                  <div className="rounded-lg bg-amber-100 p-2">
                    <Wallet className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  {stats?.total_routes 
                    ? `${Math.round(stats.total_cost / stats.total_routes)} ₽/маршрут` 
                    : "0 ₽/маршрут"}
                </div>
              </CardContent>
            </Card>

            {/* Эффективность */}
            <Card className="border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Эффективность</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stats?.total_routes && stats.total_routes > 0 
                        ? `${Math.round((stats.completed_routes / stats.total_routes) * 100)}%` 
                        : "0%"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-100 p-2">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  {stats?.completed_routes || 0} из {stats?.total_routes || 0} завершено
                </div>
              </CardContent>
            </Card>

            {/* Любимый город */}
            <Card className="border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Любимый город</p>
                    <p className="mt-1 text-lg font-bold text-gray-900 line-clamp-1">
                      {stats?.favourite_city || "Не указан"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-rose-100 p-2">
                    <Trophy className="h-5 w-5 text-rose-600" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Самый посещаемый город
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Прогресс-бар успеха (только если есть маршруты) */}
          {stats && stats.total_routes > 0 && (
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-700">Прогресс по маршрутам</span>
                <span className="font-medium text-gray-900">
                  {Math.round((stats.completed_routes / stats.total_routes) * 100)}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-mint-500 to-sky-500 transition-all duration-500"
                  style={{ width: `${(stats.completed_routes / stats.total_routes) * 100}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>{stats.completed_routes} завершено</span>
                <span>{stats?.total_routes} осталось</span>
              </div>
            </div>
          )}
        </div>

        {/* Routes Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Мои маршруты</h2>
            <p className="text-sm text-gray-600">История ваших путешествий</p>
          </div>
          <Button asChild className="gap-2 bg-gradient-to-r from-mint-500 to-sky-500 hover:from-mint-600 hover:to-sky-600">
            <Link href="/quiz">
              <Plus className="h-4 w-4" />
              Новый маршрут
            </Link>
          </Button>
        </div>

        {routes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

{routes.map((route) => {
  const statusInfo = getStatusBadge(route.status)
  
  // Функция для обновления статуса
  const handleUpdateStatus = async (newStatus: "going" | "done" | "cancelled") => {
    try {
      const result = await updateRouteStatus(route.route_id, newStatus)
      if (result.status === "success") {
        // Обновляем список маршрутов
        const updatedRoutes = routes.map(r => 
          r.route_id === route.route_id ? { ...r, status: newStatus } : r
        )
        setRoutes(updatedRoutes)
        alert(`Маршрут отмечен как ${newStatus === "done" ? "завершенный" : "отменен"}`)
      } else {
        alert(`Ошибка: ${result.error || "Неизвестная ошибка"}`)
      }
    } catch (err) {
      console.error("Ошибка обновления статуса:", err)
      alert("Произошла ошибка при обновлении статуса")
    }
  }

  return (
    <Card 
      key={route.route_id} 
      className="group border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-mint-700">
              {route.description || "Без названия"}
            </CardTitle>
          </div>
          <Badge className={`border ${statusInfo.className}`}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{route.total_duration} мин</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Star className="h-4 w-4" />
            <span>{route.total_cost} ₽</span>
          </div>
          <div className="col-span-2 flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Создан: {formatShortDate(route.created_at)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 py-2 border-gray-300 hover:bg-gray-50 hover:border-mint-300" 
            asChild
          >
            <Link href={`/route/${route.route_id}`}>
              Подробнее
            </Link>
          </Button>
        
        </div>
      </CardContent>
    </Card>
  )
})}
          </div>
        ) : (
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-gradient-to-br from-mint-100 to-sky-100 p-4">
                <Route className="h-12 w-12 text-mint-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Пока нет маршрутов</h3>
              <p className="mb-6 text-sm text-gray-600 max-w-md">
                Создайте свой первый персонализированный маршрут и начните исследовать город
              </p>
              <Button asChild className="gap-2 bg-gradient-to-r from-mint-500 to-sky-500 hover:from-mint-600 hover:to-sky-600">
                <Link href="/quiz">
                  <Plus className="h-4 w-4" />
                  Создать первый маршрут
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Информационная панель для новых пользователей */}
        {routes.length === 0 && stats && (
          <div className="mt-8">
            <Card className="border border-mint-200 bg-gradient-to-r from-mint-50 to-sky-50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                  <div className="mb-4 md:mb-0 md:mr-6">
                    <div className="inline-flex rounded-full bg-white p-3 shadow-sm">
                      <Users className="h-8 w-8 text-mint-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Добро пожаловать в Тропа!</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Вы новый участник нашего сообщества. Создайте свой первый маршрут и начните исследовать город 
                      с персонализированными рекомендациями на основе ваших интересов и настроения.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <div className="rounded-lg bg-white px-3 py-2 text-xs">
                        <span className="font-medium text-mint-700">✓</span> Персонализированные маршруты
                      </div>
                      <div className="rounded-lg bg-white px-3 py-2 text-xs">
                        <span className="font-medium text-mint-700">✓</span> Умные рекомендации
                      </div>
                      <div className="rounded-lg bg-white px-3 py-2 text-xs">
                        <span className="font-medium text-mint-700">✓</span> Поддержка Яндекс.Карт
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}