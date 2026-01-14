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
    const limit = searchParams.get("limit") || "100" // По умолчанию 100
    const page = searchParams.get("page") || "1"
    const pageSize = searchParams.get("page_size") || "100" // Можно увеличить до 500
    
    // Формируем URL для бэкенда с параметрами
    let backendUrl = `${API_BASE_URL}/user/list`
    const params = new URLSearchParams()
    
    if (status) params.append("status", status)
    if (limit) params.append("limit", limit)
    if (page) params.append("page", page)
    if (pageSize) params.append("page_size", pageSize)
    
    // Пробуем добавить все возможные параметры пагинации
    params.append("page", page)
    params.append("page_size", "100") // Запрашиваем по 100 за раз
    params.append("limit", "1000") // Общий лимит
    
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
        console.log("[app] /api/user/list: backend response data structure:", {
          isArray: Array.isArray(data),
          keys: Object.keys(data),
          totalCount: data.count || data.total || 0,
          resultsLength: data.results ? data.results.length : 0,
          dataLength: data.data ? data.data.length : 0
        })
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
    let routesData = []
    
    if (data.status === "success" && Array.isArray(data.data)) {
      // Бэкенд возвращает правильный формат
      routesData = data.data
    } 
    else if (Array.isArray(data)) {
      // Бэкенд возвращает просто массив
      routesData = data
    }
    else if (data.results && Array.isArray(data.results)) {
      // Пагинированный ответ Django REST Framework
      routesData = data.results
    }
    else if (data.data && Array.isArray(data.data)) {
      // Альтернативный формат
      routesData = data.data
    }
    else if (data.items && Array.isArray(data.items)) {
      // Еще один возможный формат
      routesData = data.items
    }
    else {
      // Неизвестная структура
      console.log("[app] /api/user/list: Unexpected response structure:", data)
      return NextResponse.json({
        status: "error",
        error: "Unexpected response format from backend",
        backend_response: data
      }, { status: 500 })
    }
    
    console.log(`[app] /api/user/list: Success! Found ${routesData.length} routes`)
    
    // Возвращаем с информацией о пагинации
    return NextResponse.json({
      status: "success",
      data: routesData,
      pagination: {
        count: data.count || data.total || routesData.length,
        next: data.next,
        previous: data.previous,
        page: parseInt(page),
        page_size: parseInt(pageSize)
      }
    }, { status: 200 })
    
  } catch (error) {
    console.error("[app] /api/user/list: error:", error)
    return NextResponse.json({ 
      status: "error", 
      error: "Network error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}