import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, Check, Brain, Map, Calendar, Compass } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface RouteLoadingScreenProps {
  isGeneratingDescription?: boolean
  isGeneratingRoute?: boolean
  routeId?: string | null
  onComplete?: () => void
  apiCompleted?: boolean
}

export function RouteLoadingScreen({ 
  isGeneratingDescription = false, 
  isGeneratingRoute = false,
  routeId, 
  onComplete,
  apiCompleted = false
}: RouteLoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [showCompletion, setShowCompletion] = useState(false)
  const [remainingTime, setRemainingTime] = useState(isGeneratingDescription ? 4 : 40)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const [internalApiCompleted, setInternalApiCompleted] = useState(false)
  
  // Рефы для контроля таймеров
  const animationCompleteRef = useRef<boolean>(false)
  const apiCompleteRef = useRef<boolean>(false)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Шаги для генерации описания
  const descriptionSteps = [
    {
      icon: Brain,
      title: "Анализ предпочтений",
      description: "Изучаем ваши интересы и настроение",
      color: "text-purple-500"
    },
    {
      icon: Map,
      title: "Подбор мест",
      description: "Ищем локации в выбранном районе",
      color: "text-blue-500"
    },
    {
      icon: Compass,
      title: "Создание описания",
      description: "Формируем персонализированный текст",
      color: "text-amber-500"
    }
  ]

  // Шаги для генерации полного маршрута
  const routeSteps = [
    {
      icon: Brain,
      title: "Анализ данных",
      description: "Обрабатываем интересы и настроение",
      color: "text-purple-500"
    },
    {
      icon: Map,
      title: "Поиск локаций",
      description: "Ищем лучшие места по критериям",
      color: "text-blue-500"
    },
    {
      icon: Calendar,
      title: "Построение маршрута",
      description: "Рассчитываем оптимальный путь",
      color: "text-green-500"
    },
    {
      icon: Compass,
      title: "Добавление деталей",
      description: "Генерируем советы и рекомендации",
      color: "text-amber-500"
    },
    {
      icon: Sparkles,
      title: "Финальная оптимизация",
      description: "Проверяем соответствие критериям",
      color: "text-mint-500"
    }
  ]

  const steps = isGeneratingDescription ? descriptionSteps : routeSteps

  useEffect(() => {
    console.log("[RouteLoadingScreen] Mounted/Updated:", {
      isGeneratingDescription,
      isGeneratingRoute,
      routeId,
      apiCompleted,
      hasRouteId: !!routeId
    })
    
    if (isGeneratingDescription || isGeneratingRoute) {
      // Сбрасываем состояния
      setProgress(0)
      setCurrentStep(0)
      setShowCompletion(false)
      setIsAnimationComplete(false)
      setInternalApiCompleted(false)
      animationCompleteRef.current = false
      apiCompleteRef.current = false
      setRemainingTime(isGeneratingDescription ? 4 : 40)
      
      // ТАЙМЕР ОСТАВШЕГОСЯ ВРЕМЕНИ
      timeIntervalRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            if (timeIntervalRef.current) clearInterval(timeIntervalRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // РАЗНЫЕ СКОРОСТИ ДЛЯ ОПИСАНИЯ И МАРШРУТА
      const targetTime = isGeneratingDescription ? 4000 : 40000
      const progressIncrement = isGeneratingDescription ? 4 : 1
      const totalIntervals = 100 / progressIncrement
      const calculatedSpeed = targetTime / totalIntervals
      const stepSpeed = isGeneratingDescription ? 1000 : 7000
      
      // Прогресс-бар
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
            setIsAnimationComplete(true)
            animationCompleteRef.current = true
            checkBothCompleted()
            return 100
          }
          return prev + progressIncrement
        })
      }, calculatedSpeed)

      // Смена шагов
      stepIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            if (stepIntervalRef.current) clearInterval(stepIntervalRef.current)
            return prev
          }
          return prev + 1
        })
      }, stepSpeed)

      return () => {
        cleanupIntervals()
      }
    }
  }, [isGeneratingDescription, isGeneratingRoute, steps.length])

  // Обработка завершения API от родителя
  useEffect(() => {
    console.log("[RouteLoadingScreen] API completion prop changed:", {
      apiCompleted,
      routeId,
      hasRouteId: !!routeId,
      isGeneratingDescription,
      isGeneratingRoute
    })
    
    // Для генерации описания: если есть apiCompleted флаг
    if (isGeneratingDescription && apiCompleted) {
      console.log("[RouteLoadingScreen] API for description marked as completed")
      setInternalApiCompleted(true)
      apiCompleteRef.current = true
      checkBothCompleted()
    }
    
    // Для генерации маршрута: нужен и apiCompleted и routeId
    if (isGeneratingRoute && apiCompleted && routeId) {
      console.log("[RouteLoadingScreen] API for route marked as completed with routeId:", routeId)
      setInternalApiCompleted(true)
      apiCompleteRef.current = true
      checkBothCompleted()
    }
  }, [apiCompleted, routeId, isGeneratingDescription, isGeneratingRoute])

  // Функция для очистки интервалов
  const cleanupIntervals = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    if (stepIntervalRef.current) {
      clearInterval(stepIntervalRef.current)
      stepIntervalRef.current = null
    }
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current)
      timeIntervalRef.current = null
    }
  }

  // Проверяем, что и анимация и API завершились
  const checkBothCompleted = () => {
    console.log("[RouteLoadingScreen] Checking completion:", {
      animationComplete: animationCompleteRef.current,
      apiComplete: apiCompleteRef.current,
      isGeneratingDescription,
      isGeneratingRoute,
      routeId
    })
    
    if (animationCompleteRef.current && apiCompleteRef.current) {
      console.log("[RouteLoadingScreen] Both completed, showing final message")
      cleanupIntervals()
      setShowCompletion(true)
      
      const timer = setTimeout(() => {
        console.log("[RouteLoadingScreen] Calling onComplete callback")
        if (onComplete) onComplete()
      }, isGeneratingDescription ? 500 : 2000)
      
      return () => clearTimeout(timer)
    }
  }

  // Если ничего не загружается, не рендерим ничего
  if (!isGeneratingDescription && !isGeneratingRoute) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-lavender-50 to-sky-50">

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className={`w-full mx-auto border border-gray-200 shadow-2xl animate-in fade-in duration-500 min-h-[500px] flex flex-col`}>
          {/* ЗАГОЛОВОК */}
          <CardHeader className="text-center pb-3 sm:pb-4 flex-shrink-0 px-4 sm:px-6">
            <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-mint-100 to-sky-100">
              {!showCompletion ? (
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-mint-600" />
              ) : (
                <Check className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              )}
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              {!showCompletion ? (
                isGeneratingDescription 
                  ? "Генерируем описание..." 
                  : "Создаем маршрут..."
              ) : (
                isGeneratingDescription 
                  ? "Описание готово!" 
                  : "Маршрут создан!"
              )}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600 px-2 sm:px-0">
              {!showCompletion ? (
                isGeneratingDescription
                  ? "ИИ создает персонализированное описание"
                  : "Оптимизируем и составляем подробный план"
              ) : (
                isGeneratingDescription
                  ? "ИИ успешно создал персонализированное описание"
                  : "Ваш идеальный маршрут успешно создан"
              )}
            </CardDescription>
          </CardHeader>

          {/* КОНТЕНТ */}
          <CardContent className="space-y-3 sm:space-y-4 flex-1 px-4 sm:px-6 pb-4 sm:pb-6">
            {/* СООБЩЕНИЕ О ЗАВЕРШЕНИИ */}
            {showCompletion ? (
              <div className="flex flex-col items-center justify-center py-6 sm:py-8 space-y-3 sm:space-y-4">
                <div className="text-center space-y-2 sm:space-y-3">
                  <div className="inline-flex items-center gap-2 text-gray-600 mb-1 sm:mb-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">
                      {isGeneratingDescription ? "Переходим дальше..." : "Перенаправляем..."}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {isGeneratingDescription 
                      ? "Автоматически через секунду" 
                      : "Автоматически через 2 секунды"}
                  </p>
                </div>
              </div>
            ) : (
              /* АНИМИРОВАННЫЕ ЭТАПЫ */
              <div className="space-y-3 sm:space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Прогресс</span>
                    <span className="font-bold text-mint-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div 
                      className="h-full bg-gradient-to-r from-mint-500 to-sky-500 transition-all duration-300 ease-out" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>

                {/* Animated Steps */}
                <div className="space-y-2 sm:space-y-3 pt-2">
                  <div className="text-sm font-medium text-gray-700">
                    Этапы:
                  </div>
                  
                  <div className="space-y-2">
                    {steps.map((step, index) => {
                      const Icon = step.icon
                      const isActive = index === currentStep
                      const isCompleted = index < currentStep
                      
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-2 sm:gap-3 rounded-lg border p-2.5 sm:p-3 transition-all duration-500 ${
                            isActive
                              ? "border-mint-300 bg-gradient-to-r from-mint-50 to-sky-50 shadow-sm"
                              : isCompleted
                              ? "border-green-200 bg-green-50"
                              : "border-gray-200 bg-white"
                          }`}
                          style={{
                            opacity: isActive ? 1 : isCompleted ? 0.9 : 0.8
                          }}
                        >
                          <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full flex-shrink-0 ${
                            isActive 
                              ? "bg-gradient-to-br from-mint-500 to-sky-500" 
                              : isCompleted 
                              ? "bg-green-100" 
                              : "bg-gray-100"
                          }`}>
                            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${
                              isActive ? "text-white" : isCompleted ? "text-green-600" : "text-gray-400"
                            }`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <h3 className={`font-semibold text-sm sm:text-base ${
                                isActive ? "text-gray-900" : isCompleted ? "text-green-800" : "text-gray-600"
                              }`}>
                                {step.title}
                              </h3>
                              {isActive && (
                                <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-mint-400 flex-shrink-0" />
                              )}
                            </div>
                            <p className={`text-xs sm:text-sm ${
                              isActive ? "text-gray-700" : isCompleted ? "text-green-600" : "text-gray-500"
                            }`}>
                              {step.description}
                            </p>
                          </div>
                          
                          <div className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted 
                              ? "bg-green-500 text-white" 
                              : "bg-gray-200 text-gray-400"
                          }`}>
                            {isCompleted ? (
                              <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            ) : (
                              <span className="text-xs font-bold">{index + 1}</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Estimated Time */}
                <div className="text-center pt-3 sm:pt-5">
                  <p className="text-xs sm:text-sm text-gray-500">
                    {isGeneratingDescription 
                      ? "Генерация описания займет несколько секунд" 
                      : "Создание идеального маршрута требует времени (до 40 секунд)"}
                  </p>
                  {isGeneratingRoute && (
                    <p className="text-xs sm:text-sm text-mint-600 font-medium mt-1">
                      Пожалуйста, не закрывайте страницу
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}