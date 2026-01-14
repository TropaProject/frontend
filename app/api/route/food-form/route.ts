import { type NextRequest, NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/config"

export async function GET(request: NextRequest) {
  try {
    // 1. Проверка авторизации
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { detail: "Учетные данные не были предоставлены." }, 
        { status: 401 }
      )
    }
    
    // 2. Отправка запроса к бэкенду
    const backendUrl = `${API_BASE_URL}/route/food-form/`
    console.log("[api/route/food-form] Fetching from backend:", backendUrl)
    
    const backendResponse = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    })
    
    console.log("[api/route/food-form] Backend response status:", backendResponse.status)
    
    const responseText = await backendResponse.text()
    
    // 3. Проверка ответа
    if (backendResponse.ok) {
      try {
        const responseData = JSON.parse(responseText)
        
        // Проверяем структуру ответа
        if (responseData.status === "success" && responseData.data?.interests) {
          return NextResponse.json(responseData, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        } else {
          // Неправильная структура ответа
          return NextResponse.json(
            {
              status: "error",
              detail: "Неправильная структура ответа от бэкенда",
              backend_response: responseData
            },
            { status: 502 }
          )
        }
      } catch (error) {
        console.error("[api/route/food-form] JSON parse error:", error)
        return NextResponse.json(
          {
            status: "error",
            detail: "Неверный формат ответа от бэкенда",
            raw_response: responseText.substring(0, 500)
          },
          { status: 502 }
        )
      }
    } else {
      // Ошибка от бэкенда
      let errorData: any = {}
      try {
        errorData = JSON.parse(responseText)
      } catch {
        errorData = { raw_response: responseText }
      }
      
      return NextResponse.json(
        {
          status: "error",
          detail: errorData.detail || `Бэкенд вернул ошибку ${backendResponse.status}`,
          backend_response: errorData
        },
        { 
          status: backendResponse.status > 400 ? backendResponse.status : 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
  } catch (error: any) {
    console.error("[api/route/food-form] Error:", error)
    
    // Проверяем, не ошибка ли сети
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return NextResponse.json(
        { 
          status: "error",
          detail: "Не удалось подключиться к бэкенду",
          error: error.message,
          suggestion: `Проверьте доступность бэкенда по адресу ${API_BASE_URL}`
        }, 
        { status: 502 }
      )
    }
    
    return NextResponse.json(
      { 
        status: "error",
        detail: "Внутренняя ошибка сервера",
        error: error.message
      }, 
      { status: 500 }
    )
  }
}

