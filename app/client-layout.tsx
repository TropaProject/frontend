// app/client-layout.tsx
"use client"

import { useEffect } from "react"
import { initializeAuth } from "@/lib/api"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Инициализируем авторизацию при загрузке приложения
    initializeAuth().then(authenticated => {
      console.log("[app] Auth initialized, authenticated:", authenticated)
    })
    
    // Периодическая проверка токена
    const interval = setInterval(() => {
      initializeAuth().catch(() => {
        console.log("[app] Periodic auth check failed")
      })
    }, 15 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return <>{children}</>
}