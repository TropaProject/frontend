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
    
    // 3. Валидация обязательных полей
    const requiredFields = [
      'city_id', 'time_of_day', 'interests', 'mood', 
      'budget', 'transport', 'duration_minutes'
    ]
    
    const missingFields = requiredFields.filter(field => {
      const value = body[field]
      return value === undefined || value === null || value === ''
    })
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          detail: "Отсутствуют обязательные поля",
          missing_fields: missingFields
        },
        { status: 400 }
      )
    }
    
    // 4. Проверка массивов
    if (!Array.isArray(body.interests) || body.interests.length === 0) {
      return NextResponse.json(
        { detail: "Поле interests должно быть непустым массивом" },
        { status: 400 }
      )
    }
    
    if (!Array.isArray(body.mood) || body.mood.length === 0) {
      return NextResponse.json(
        { detail: "Поле mood должно быть непустым массивом" },
        { status: 400 }
      )
    }
    
    // 5. Проверка начальной точки
    if (!body.start_point && !body.start_area) {
      return NextResponse.json(
        { detail: "Не указана начальная точка (start_point) или район (start_area)" },
        { status: 400 }
      )
    }
    
    // 6. Формирование запроса к бэкенду
    const backendBody = {
      city_id: String(body.city_id).trim(),
      time_of_day: String(body.time_of_day).trim(),
      interests: body.interests.map((i: any) => String(i).trim()),
      mood: body.mood.map((m: any) => String(m).trim()),
      budget: String(body.budget).trim(),
      transport: String(body.transport).trim(),
      duration_minutes: Number(body.duration_minutes),
      ...(body.start_point && { start_point: String(body.start_point).trim() }),
      ...(body.start_area && { start_area: String(body.start_area).trim() }),
      ...(body.radius_km && { radius_km: Number(body.radius_km) }),
      ...(body.description && { description: String(body.description).trim() }),
      ...(body.gpt_description && { gpt_description: String(body.gpt_description).trim() }),
    }
    
    // 7. Отправка запроса к бэкенду с таймаутом
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 45000)
    
    let backendResponse: Response
    try {
      backendResponse = await fetch(`${API_BASE_URL}/route/generate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
        },
        body: JSON.stringify(backendBody),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { detail: "Таймаут запроса к серверу генерации маршрутов" },
          { status: 504 }
        )
      }
      
      return NextResponse.json(
        { 
          detail: "Ошибка соединения с сервером генерации маршрутов",
          error: fetchError.message
        },
        { status: 502 }
      )
    }
    
    // 8. Обработка ответа от бэкенда
    const responseText = await backendResponse.text()
    let responseData: any = {}
    
    if (responseText) {
      try {
        responseData = JSON.parse(responseText)
      } catch {
        responseData = { raw_response: responseText }
      }
    }
    
    // 9. Возврат ответа
    return NextResponse.json(responseData, { 
      status: backendResponse.status,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error: any) {
    // Обработка ошибок парсинга JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { detail: "Неверный формат JSON в теле запроса" },
        { status: 400 }
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