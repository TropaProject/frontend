import { type NextRequest, NextResponse } from "next/server"

import { API_BASE_URL } from "@/lib/config"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    console.log("[app] /api/user: fetching user data with auth:", !!authHeader)

    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    const data = await response.json()

    console.log("[app] /api/user: backend response status:", response.status)
    console.log("[app] /api/user: backend response data:", data)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[app] /api/user: error:", error)
    return NextResponse.json({ status: "error", error: "Network error" }, { status: 500 })
  }
}
