// app/api/route/add_food_point/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    // 1. Проверка авторизации
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { detail: "Учетные данные не были предоставлены." }, 
        { status: 401 }
      )
    }
    
    // 2. Парсинг тела запроса
    const body = await request.json()
    console.log("[api/route/add_food_point] Request body:", body)
    
    // 3. Отправка к бэкенду
    const backendUrl = `${API_BASE_URL}/route/add_food_point/`
    console.log("[api/route/add_food_point] Proxying to:", backendUrl)
    
    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(body),
    })
    
    console.log("[api/route/add_food_point] Backend response status:", backendResponse.status)
    
    const responseText = await backendResponse.text()
    console.log("[api/route/add_food_point] Backend response first 200 chars:", responseText.substring(0, 200))
    
    // Проверяем, является ли ответ HTML
    const isHtml = responseText.includes('<!DOCTYPE') || 
                   responseText.includes('<html') || 
                   responseText.includes('<!doctype')
    
    if (isHtml) {
      console.error("[api/route/add_food_point] Backend returned HTML instead of JSON")
      
      // Если это 404 HTML страница
      if (responseText.includes('404') || responseText.includes('Not Found')) {
        return NextResponse.json(
          { 
            detail: "Endpoint /route/add_food_point/ не найден на бэкенде",
            suggestion: "Проверьте, реализован ли этот endpoint на бэкенде",
            backend_status: backendResponse.status
          },
          { status: 404 }
        )
      }
      
      // Если это 500 или другая HTML ошибка
      return NextResponse.json(
        { 
          detail: "Бэкенд вернул HTML страницу вместо JSON",
          backend_status: backendResponse.status,
          response_preview: responseText.substring(0, 300)
        },
        { status: 502 }
      )
    }
    
    let responseData: any = {}
    if (responseText) {
      try {
        responseData = JSON.parse(responseText)
      } catch (error) {
        console.error("[api/route/add_food_point] JSON parse error:", error)
        // Если не JSON, возвращаем как текст
        return NextResponse.json(
          { 
            detail: "Неверный формат ответа от бэкенда",
            raw_response: responseText.substring(0, 500)
          },
          { status: 502 }
        )
      }
    }
    
    // 4. Проксируем ответ от бэкенда
    return NextResponse.json(responseData, { 
      status: backendResponse.status,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error: any) {
    console.error("[api/route/add_food_point] Fetch error:", error)
    
    // Проверяем, не ошибка ли сети
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return NextResponse.json(
        { 
          detail: "Не удалось подключиться к бэкенду",
          error: error.message,
          suggestion: `Проверьте доступность бэкенда по адресу ${API_BASE_URL}`
        }, 
        { status: 502 }
      )
    }
    
    return NextResponse.json(
      { 
        detail: "Внутренняя ошибка сервера",
        error: error.message
      }, 
      { status: 500 }
    )
  }
}