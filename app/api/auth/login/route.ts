import { type NextRequest, NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/config"


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[app] Login API route called with email:", body.email)

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log("[app] Backend response status:", response.status)
    console.log("[app] Backend response data:", data)

    // ВАЖНО: Проверяем структуру ответа
    if (response.ok && data.access && data.refresh) {
      // Успешный логин - возвращаем токены
      const response = NextResponse.json(data, { status: 200 })
      
      // Можно установить куки, если нужно
      // response.cookies.set('access_token', data.access, { httpOnly: true })
      
      return response
    } else {
      // Ошибка логина
      return NextResponse.json(data, { status: response.status })
    }
  } catch (error) {
    console.error("[app] Login API route error:", error)
    return NextResponse.json({ 
      status: "error", 
      error: "Network error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}