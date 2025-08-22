"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar, MousePointer, ChevronLeft, QrCode, Copy, CheckCircle } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import Link from "next/link"
import type { URLStats } from "@/types/api"
import { QrCodeDialog } from "@/components/qr-code-dialog"
import { getBaseUrl } from "@/lib/utils"

interface StatsPageProps {
  params: {
    shortUrl: string
  }
}

export default function StatsPage({ params }: StatsPageProps) {
  const { shortUrl } = params
  const [stats, setStats] = useState<URLStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/stats/${shortUrl}`)
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          setError("URL not found")
        }
      } catch (error) {
        setError("Failed to fetch stats")
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [shortUrl])

  const copyToClipboard = async () => {
    if (stats) {
      const shortUrl = `${getBaseUrl()}/${stats.short_url}`
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12 border-0 shadow-lg">
            <CardContent>
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <MousePointer className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{error || "URL not found"}</h3>
                  <p className="text-muted-foreground mb-6">This short URL doesn't exist or may have been removed.</p>
                  <div className="flex gap-3 justify-center">
                    <Button asChild variant="outline">
                      <Link href="/dashboard">Browse All URLs</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/">Create New URL</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to All URLs
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            URL Analytics
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Detailed statistics for this shortened URL</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  URL Information
                  <Badge variant={stats.is_active ? "default" : "secondary"}>
                    {stats.is_active ? "Active" : "Inactive"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Original URL</label>
                  <div className="flex items-center gap-2 mt-2">
                    <a
                      href={stats.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all text-lg"
                    >
                      {stats.original_url}
                    </a>
                    <ExternalLink className="h-4 w-4 flex-shrink-0" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Short URL</label>
                  <div className="flex items-center gap-3 mt-2">
                    <code className="bg-muted px-3 py-2 rounded-lg font-mono text-lg flex-1">
                      {getBaseUrl()}/{stats.short_url}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex-shrink-0 bg-transparent"
                    >
                      {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                    <p className="mt-1 text-lg">{format(new Date(stats.created_at), "PPP 'at' p")}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(stats.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {stats.expires_at && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Expires</label>
                      <p className="mt-1 text-lg">{format(new Date(stats.expires_at), "PPP 'at' p")}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(stats.expires_at) > new Date()
                          ? formatDistanceToNow(new Date(stats.expires_at), { addSuffix: true })
                          : "Expired"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer className="h-5 w-5" />
                  Click Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold text-primary">{stats.click_count}</div>
                  <p className="text-muted-foreground">Total Clicks</p>
                  <div className="text-sm text-muted-foreground">
                    Since {format(new Date(stats.created_at), "MMM d, yyyy")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <QrCodeDialog shortUrl={stats.short_url}>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <QrCode className="h-4 w-4 mr-2" />
                    View QR Code
                  </Button>
                </QrCodeDialog>

                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <a
                    href={`${getBaseUrl()}/${stats.short_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Short URL
                  </a>
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <a href={stats.original_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Original URL
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Status</span>
                  <Badge variant={stats.is_active ? "default" : "secondary"}>
                    {stats.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {stats.expires_at && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Expiration</span>
                      <Badge variant={new Date(stats.expires_at) > new Date() ? "outline" : "destructive"}>
                        {new Date(stats.expires_at) > new Date() ? "Valid" : "Expired"}
                      </Badge>
                    </div>
                    <p className="text-sm">
                      {new Date(stats.expires_at) > new Date()
                        ? `Expires ${formatDistanceToNow(new Date(stats.expires_at), { addSuffix: true })}`
                        : `Expired ${formatDistanceToNow(new Date(stats.expires_at), { addSuffix: true })}`}
                    </p>
                  </div>
                )}

                {!stats.expires_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Expiration</span>
                    <Badge variant="outline">Never</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
