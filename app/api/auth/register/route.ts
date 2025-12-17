import { type NextRequest, NextResponse } from "next/server"

import { API_BASE_URL } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[API] /auth/register called with:", { 
      email: body.email, 
      hasPassword: !!body.password,
      userType: body["Type-user"] 
    })

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("[API] /auth/register backend status:", response.status)
    
    let data = {}
    try {
      data = await response.json()
      console.log("[API] /auth/register backend response:", data)
    } catch (jsonError) {
      console.error("[API] /auth/register JSON parse error:", jsonError)
    }

    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Cache-Control': 'no-store',
      }
    })
  } catch (error) {
    console.error("[API] /auth/register error:", error)
    return NextResponse.json(
      { 
        status: "error", 
        error: "Network error",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
}