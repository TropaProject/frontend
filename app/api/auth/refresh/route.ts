import { type NextRequest, NextResponse } from "next/server"

import { API_BASE_URL } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[API] /auth/refresh called with refresh token:", 
      body.refresh ? "yes" : "no")

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("[API] /auth/refresh backend status:", response.status)
    
    const data = await response.json()
    console.log("[API] /auth/refresh backend response:", {
      hasAccess: !!data.access,
      hasRefresh: !!data.refresh
    })
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[API] /auth/refresh error:", error)
    return NextResponse.json(
      { error: "Network error" }, 
      { status: 500 }
    )
  }
}