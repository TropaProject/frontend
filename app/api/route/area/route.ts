import { type NextRequest, NextResponse } from "next/server"

import { API_BASE_URL } from "@/lib/config"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cityId = searchParams.get("city_id")

    if (!cityId) {
      return NextResponse.json({ status: "error", error: "city_id is required" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}/route/area?city_id=${cityId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", error: data.message || "Failed to fetch areas" },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Area API error:", error)
    return NextResponse.json({ status: "error", error: "Internal server error" }, { status: 500 })
  }
}
