import { type NextRequest, NextResponse } from "next/server"

import { API_BASE_URL } from "@/lib/config"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      console.log("[app] /api/user/list: No authorization header")
      return NextResponse.json(
        { status: "error", error: "Authorization header required" }, 
        { status: 401 }
      )
    }

    console.log("[app] /api/user/list: fetching user routes with auth:", authHeader.substring(0, 20) + "...")

    // Получаем параметры запроса
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")
    
    // Формируем URL для бэкенда с параметрами
    let backendUrl = `${API_BASE_URL}/user/list`
    const params = new URLSearchParams()
    
    if (status) params.append("status", status)
    if (limit) params.append("limit", limit)
    if (offset) params.append("offset", offset)
    
    const queryString = params.toString()
    if (queryString) {
      backendUrl += `?${queryString}`
    }

    console.log("[app] /api/user/list: Calling backend URL:", backendUrl)

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    })

    console.log("[app] /api/user/list: backend response status:", response.status)

    // Пробуем прочитать ответ
    let data: any = {}
    const text = await response.text()
    
    if (text) {
      try {
        data = JSON.parse(text)
        console.log("[app] /api/user/list: backend response data:", data)
      } catch (e) {
        console.error("[app] /api/user/list: JSON parse error:", e)
        console.log("[app] /api/user/list: Raw response:", text.substring(0, 500))
      }
    }

    if (response.status === 401) {
      console.log("[app] /api/user/list: Token expired or invalid")
      return NextResponse.json(
        { 
          status: "error", 
          error: "Token expired",
          code: "token_expired",
          detail: data.detail || "Unauthorized"
        }, 
        { status: 401 }
      )
    }

    if (!response.ok) {
      console.log("[app] /api/user/list: Backend error")
      return NextResponse.json(
        { 
          status: "error", 
          error: data.detail || data.message || `Failed to fetch user routes (${response.status})`,
          backend_data: data // Для отладки
        }, 
        { status: response.status }
      )
    }

    // Успешный ответ - проверяем структуру
    if (data.status === "success" && Array.isArray(data.data)) {
      // Бэкенд возвращает правильный формат
      console.log(`[app] /api/user/list: Success! Found ${data.data.length} routes`)
      return NextResponse.json({
        status: "success",
        data: data.data
      }, { status: 200 })
    } else if (Array.isArray(data)) {
      // Бэкенд может возвращать просто массив
      console.log(`[app] /api/user/list: Success! Found ${data.length} routes (direct array)`)
      return NextResponse.json({
        status: "success",
        data: data
      }, { status: 200 })
    } else {
      // Неизвестная структура
      console.log("[app] /api/user/list: Unexpected response structure:", data)
      return NextResponse.json({
        status: "error",
        error: "Unexpected response format from backend",
        backend_response: data
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error("[app] /api/user/list: error:", error)
    return NextResponse.json({ 
      status: "error", 
      error: "Network error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}