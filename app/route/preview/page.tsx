"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2, Check, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

export default function RoutePreviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const routeId = searchParams.get("id")
  const [isGenerating, setIsGenerating] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          return 100
        }
        return prev + 10
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  const steps = [
    { label: "Анализ предпочтений", done: progress >= 25 },
    { label: "Подбор локаций", done: progress >= 50 },
    { label: "Оптимизация маршрута", done: progress >= 75 },
    { label: "Финальные рекомендации", done: progress >= 100 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-secondary/10">
      <Header />

      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 md:px-6">
        <Card className="w-full max-w-2xl border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              {isGenerating ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <Check className="h-8 w-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isGenerating ? "Создаем ваш идеальный маршрут" : "Маршрут готов!"}
            </CardTitle>
            <CardDescription className="text-base">
              {isGenerating
                ? "Наш ИИ анализирует ваши предпочтения и создает персонализированный план"
                : "Ваш персонализированный маршрут успешно создан"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress Steps */}
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 rounded-lg border p-4 transition-all ${
                    step.done ? "border-primary/50 bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.done ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </div>
                  <span className={`font-medium ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Loading Bar */}
            {isGenerating && (
              <div className="space-y-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-center text-sm text-muted-foreground">{progress}%</p>
              </div>
            )}

            {/* Success Message */}
            {!isGenerating && (
              <div className="space-y-4">
                <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-6 text-center">
                  <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
                  <p className="leading-relaxed text-muted-foreground">
                    Мы создали для вас уникальный маршрут с учетом всех ваших предпочтений. Готовы к приключению?
                  </p>
                </div>

                <Button
                  className="w-full gap-2 text-base"
                  size="lg"
                  onClick={() => router.push(`/route/${routeId || "1"}`)}
                >
                  Посмотреть маршрут
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
