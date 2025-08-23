import { type NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: { shortUrl: string } }) {
  try {
    const response = await fetch(`${getApiUrl()}/check/${params.shortUrl}`)

    if (!response.ok) {
      return NextResponse.json({ detail: "URL not found or expired" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ detail: "Failed to check URL" }, { status: 500 })
  }
}
