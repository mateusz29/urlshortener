"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink, Calendar, Activity, ChevronLeft, ChevronRight, QrCode, Copy, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import type { URLListResponse } from "@/types/api"
import { QrCodeDialog } from "@/components/qr-code-dialog"

export default function DashboardPage() {
  const [urls, setUrls] = useState<URLListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const fetchUrls = async (page: number, size: number) => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/urls?page=${page}&page_size=${size}`)
      if (response.ok) {
        const data = await response.json()
        setUrls(data)
      }
    } catch (error) {
      console.error("Failed to fetch URLs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUrls(currentPage, pageSize)
  }, [currentPage, pageSize])

  const copyToClipboard = async (shortUrl: string) => {
    const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${shortUrl}`
    await navigator.clipboard.writeText(fullUrl)
    setCopiedUrl(shortUrl)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const displayUrls = urls?.urls || []

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  const PaginationComponent = () => {
    if (!urls) return null

    const totalPages = urls.total_pages

    const getVisiblePages = () => {
      const pages = []

      if (totalPages > 0) pages.push(1)

      if (currentPage > 4 && totalPages > 7) {
        pages.push("...")
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }

      if (currentPage < totalPages - 3 && totalPages > 5) {
        pages.push("...")
      }

      if (totalPages > 1 && !pages.includes(totalPages)) {
        pages.push(totalPages)
      }

      return pages
    }

    return (
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, urls.total)} of{" "}
                {urls.total} URLs
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getVisiblePages().map((page, index) => {
                  if (page === "...") {
                    return (
                      <span key={`dots-${index}`} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    )
                  }

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page as number)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(urls.total_pages, p + 1))}
                  disabled={currentPage === urls.total_pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number.parseInt(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">All URLs</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Browse and explore all shortened URLs created by everyone
          </p>
        </div>

        {displayUrls.length > 0 ? (
          <>
            <div className="grid gap-4 mb-8">
              {displayUrls.map((url) => (
                <Card key={url.short_url} className="border shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <Badge variant={url.is_active ? "default" : "secondary"} className="px-3 py-1">
                            {url.is_active ? "Active" : "Inactive"}
                          </Badge>
                          {url.expires_at && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Expires {formatDistanceToNow(new Date(url.expires_at), { addSuffix: true })}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Original URL</p>
                            <a
                              href={url.original_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground hover:text-primary transition-colors truncate block font-medium"
                            >
                              {url.original_url}
                            </a>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Short URL</p>
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                {process.env.NEXT_PUBLIC_BASE_URL}/{url.short_url}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(url.short_url)}
                                className="h-8 w-8 p-0"
                              >
                                {copiedUrl === url.short_url ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/stats/${url.short_url}`}>
                            <Activity className="h-4 w-4 mr-2" />
                            View Stats
                          </Link>
                        </Button>

                        <QrCodeDialog shortUrl={url.short_url}>
                          <Button variant="outline" size="sm">
                            <QrCode className="h-4 w-4 mr-2" />
                            QR Code
                          </Button>
                        </QrCodeDialog>

                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`${process.env.NEXT_PUBLIC_BASE_URL}/${url.short_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <PaginationComponent />
          </>
        ) : (
          <Card className="text-center py-16 border shadow-sm">
            <CardContent>
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">No URLs found</h3>
                  <p className="text-muted-foreground mb-6">No URLs have been created yet.</p>
                  <Button asChild>
                    <Link href="/">Create the first short URL</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
