import { type NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: { shortUrl: string } }) {
  try {
    const response = await fetch(`${getApiUrl()}/qr/${params.shortUrl}`)

    if (!response.ok) {
      return NextResponse.json({ detail: "Failed to generate QR code" }, { status: response.status })
    }

    const blob = await response.blob()
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "image/png",
      },
    })
  } catch (error) {
    return NextResponse.json({ detail: "Failed to generate QR code" }, { status: 500 })
  }
}
