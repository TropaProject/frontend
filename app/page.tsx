"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { ArrowRight, Map, Sparkles, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { getAccessToken, initializeAuth } from "@/lib/api"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      const token = getAccessToken()
      
      if (token) {
        // Если есть токен, проверяем его валидность
        const authenticated = await initializeAuth()
        setIsAuthenticated(authenticated)
      } else {
        setIsAuthenticated(false)
      }
      
      setIsLoading(false)
    }
    
    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-secondary/20" />
        <div className="container relative mx-auto px-4 py-24 md:px-6 md:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Планируйте идеальные маршруты для прогулок
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              Тропа создает персонализированные маршруты, которые идеально подходят вашим предпочтениям и интересам.
              Откройте для себя новые места и незабываемые впечатления.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {isAuthenticated ? (
                // Если авторизован - только одна кнопка "Мой кабинет"
                <Button size="lg" asChild className="gap-2 text-base px-8">
                  <Link href="/dashboard">
                    Мой кабинет
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                // Если не авторизован - две кнопки
                <>
                  <Button size="lg" asChild className="gap-2 text-base">
                    <Link href="/register">
                      Начать бесплатно
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
                    <Link href="/login">Войти в аккаунт</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-card py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-card-foreground md:text-4xl">
              Почему выбирают Тропу
            </h2>
            <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
              Создавайте уникальные путешествия за считанные минуты
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-2xl border bg-background p-8 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Умные рекомендации</h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Алгоритм создает маршруты на основе ваших предпочтений, учитывая время, бюджет и интересы.
              </p>
            </div>

            <div className="group rounded-2xl border bg-background p-8 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/50 text-secondary-foreground transition-transform group-hover:scale-110">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Детальные маршруты</h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Получайте подробные планы с местами, временем посещения и полезными рекомендациями.
              </p>
            </div>

            <div className="group rounded-2xl border bg-background p-8 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/50 text-accent-foreground transition-transform group-hover:scale-110">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Статистика</h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Отслеживайте свои путешествия, сохраняйте любимые места и анализируйте свой опыт.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {isAuthenticated 
                ? "Продолжайте исследовать с Тропой" 
                : "Начните планировать свое следующее путешествие"}
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {isAuthenticated 
                ? "Ваши персонализированные маршруты ждут вас" 
                : "Создайте аккаунт бесплатно и откройте мир персонализированных маршрутов"}
            </p>

            <Button size="lg" asChild className="gap-2 text-base">
              <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                {isAuthenticated ? "Перейти в личный кабинет" : "Зарегистрироваться сейчас"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-10">
        <div className="container mx-auto px-4 text-center md:px-6">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>© 2025 Тропа. Все права защищены.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}