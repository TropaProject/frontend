import { type NextRequest, NextResponse } from "next/server"

import { API_BASE_URL } from "@/lib/config"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    const response = await fetch(`${API_BASE_URL}/route/form/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ status: "error", error: "Network error" }, { status: 500 })
  }
}
