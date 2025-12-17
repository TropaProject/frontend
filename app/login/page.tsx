"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Sparkles, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("[app] Attempting login with email:", formData.email)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log("[app] Login response:", result)

      if (response.ok && result.status === "success" && result.data) {
        const { access, refresh } = result.data

        if (access && refresh) {
          console.log("[app] Login successful, saving tokens")
          localStorage.setItem("access_token", access)
          localStorage.setItem("refresh_token", refresh)

          console.log("[app] Redirecting to dashboard")
          router.push("/dashboard")
        } else {
          console.log("[app] Login response missing tokens:", result)
          setError("Ошибка авторизации: токены не получены")
        }
      } else {
        console.log("[app] Login failed:", result)
        setError(result.detail || result.error || "Неверный email или пароль")
      }
    } catch (err) {
      console.error("[app] Login error:", err)
      setError("Произошла ошибка при входе")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-secondary/10">
      <Header />

      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 md:px-6">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Добро пожаловать</CardTitle>
            <CardDescription className="text-base">Войдите в свой аккаунт Тропа</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="h-11"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  className="h-11"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="h-11 w-full text-base font-medium" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Вход...
                  </>
                ) : (
                  "Войти"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">или</span>
              </div>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Нет аккаунта? </span>
              <Link href="/register" className="font-medium text-primary transition-colors hover:text-primary/80">
                Зарегистрироваться
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
