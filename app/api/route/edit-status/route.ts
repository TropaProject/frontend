// app/api/route/edit-status/route.ts
import { type NextRequest, NextResponse } from "next/server"

import { API_BASE_URL } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const body = await request.json()

    console.log("[API Route] Edit status request to backend:", {
      url: `${API_BASE_URL}/route/edit-status/`,
      body,
      hasAuthHeader: !!authHeader,
      authHeaderPreview: authHeader?.substring(0, 30) + "..."
    })

    // ВАЖНО: Уберите слеш в конце URL!
    const response = await fetch(`${API_BASE_URL}/route/edit-status/`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    })

    console.log("[API Route] Backend response status:", response.status)
    
    const responseText = await response.text()
    console.log("[API Route] Backend response raw:", responseText)
    
    let data
    try {
      data = JSON.parse(responseText)
      console.log("[API Route] Backend response parsed:", data)
    } catch (parseError) {
      console.error("[API Route] JSON parse error:", parseError)
      data = { error: "Invalid JSON response", raw: responseText }
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[API Route] Fetch error:", error)
    return NextResponse.json({ 
      status: "error", 
      error: error instanceof Error ? error.message : "Network error" 
    }, { status: 500 })
  }
}