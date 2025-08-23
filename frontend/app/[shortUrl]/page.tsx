"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home, Search, ExternalLink } from "lucide-react"
import Link from "next/link"

interface RedirectPageProps {
  params: { shortUrl: string }
}

export default function RedirectPage({ params }: RedirectPageProps) {
  const { shortUrl } = params
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const reservedRoutes = ["analytics", "dashboard", "stats", "api"]
        if (reservedRoutes.includes(shortUrl.toLowerCase())) {
          setError("Page not found")
          setLoading(false)
          return
        }

        const checkResponse = await fetch(`/api/check/${shortUrl}`)

        if (!checkResponse.ok) {
          if (checkResponse.status === 404) {
            const errorData = await checkResponse.json()
            setError(errorData.detail || "This short URL does not exist or has expired.")
          } else {
            setError("An error occurred while processing this URL.")
          }
          setLoading(false)
          return
        }

        setRedirecting(true)
        window.location.href = `/api/redirect/${shortUrl}`
      } catch (err) {
        setError("Unable to process this URL. Please check your connection.")
        setLoading(false)
      }
    }

    handleRedirect()
  }, [shortUrl])

  if (loading || redirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Redirecting...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border-2 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">Short URL Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                The short URL{" "}
                <span className="font-mono bg-background px-2 py-1 rounded border font-semibold">/{shortUrl}</span>{" "}
                could not be found or may have expired.
              </p>
            </div>
            <div className="grid gap-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Create Short URL
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="w-full bg-transparent">
                <Link href="/dashboard">
                  <Search className="mr-2 h-4 w-4" />
                  Browse All URLs
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="w-full bg-transparent">
                <Link href="/analytics">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Check URL Stats
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
