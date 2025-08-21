import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { shortUrl: string } }) {
  try {
    const response = await fetch(`${process.env.API_URL}/check/${params.shortUrl}`)

    if (!response.ok) {
      return NextResponse.json({ detail: "URL not found or expired" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ detail: "Failed to check URL" }, { status: 500 })
  }
}
