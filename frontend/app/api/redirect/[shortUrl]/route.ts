import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { shortUrl: string } }) {
  try {
    const response = await fetch(`${process.env.API_URL}/${params.shortUrl}`, {
      redirect: "manual",
    })

    if (response.status === 307 || response.status === 308) {
      const location = response.headers.get("location")
      if (location) {
        return NextResponse.redirect(location)
      }
    }

    return NextResponse.json({ detail: "URL not found or expired" }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ detail: "Failed to redirect" }, { status: 500 })
  }
}
