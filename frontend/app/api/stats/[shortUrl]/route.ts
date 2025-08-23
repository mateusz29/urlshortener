import { type NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: { shortUrl: string } }) {
  try {
    const response = await fetch(`${getApiUrl()}/stats/${params.shortUrl}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ detail: "URL not found" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      }
    })
  } catch (error) {
    return NextResponse.json({ detail: "Failed to fetch stats" }, { status: 500 })
  }
}
