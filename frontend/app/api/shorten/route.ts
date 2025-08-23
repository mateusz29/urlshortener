import { type NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${getApiUrl()}/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ detail: "Network error. Please try again." }, { status: 500 })
  }
}
