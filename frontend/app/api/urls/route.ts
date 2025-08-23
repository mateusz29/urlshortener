import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page") || "1"
    const pageSize = searchParams.get("page_size") || "10"

    const response = await fetch(`${process.env.API_URL}/urls?page=${page}&page_size=${pageSize}`)

    if (!response.ok) {
      return NextResponse.json({ detail: "Failed to fetch URLs" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ detail: "Network error. Please try again." }, { status: 500 })
  }
}
