import { type NextRequest, NextResponse } from "next/server"

import { API_BASE_URL } from "@/lib/config"

export async function POST(request: NextRequest) {
  console.log("=== [API] /gen-description POST ===")
  
  try {
    const body = await request.json()
    console.log("[API] Request body:", JSON.stringify(body, null, 2))
    
    const backendUrl = `${API_BASE_URL}/route/gen-description/`
    console.log("[API] Calling backend:", backendUrl)
    
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    
    console.log("[API] Backend response status:", response.status)
    
    let data: any = {}
    try {
      const text = await response.text()
      console.log("[API] Backend response raw:", text.substring(0, 500))
      
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.error("[API] JSON parse error:", parseError)
          data = { raw: text, error: "Invalid JSON response" }
        }
      }
    } catch (e) {
      console.error("[API] Failed to read response:", e)
      data = { error: "Failed to read response" }
    }
    
    return NextResponse.json(data, { status: response.status })
    
  } catch (error) {
    console.error("[API] /gen-description error:", error)
    
    return NextResponse.json(
      { 
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        detail: "Ошибка при обращении к серверу генерации описания"
      }, 
      { status: 500 }
    )
  }
}