import { type NextRequest, NextResponse } from "next/server"

import { API_BASE_URL } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/route/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ status: "error", error: "Network error" }, { status: 500 })
  }
}
