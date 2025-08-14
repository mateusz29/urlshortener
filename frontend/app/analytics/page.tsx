"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, BarChart3, TrendingUp, MousePointer, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AnalyticsPage() {
  const [shortUrl, setShortUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shortUrl.trim()) return

    setLoading(true)

    let cleanShortUrl = shortUrl.trim()
    if (cleanShortUrl.includes("/")) {
      cleanShortUrl = cleanShortUrl.split("/").pop() || ""
    }

    router.push(`/stats/${cleanShortUrl}`)
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-4">URL Analytics</h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
            Enter any short URL to view detailed statistics including click counts, creation date, and expiration
            status.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12 sm:mb-16">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-background to-muted/20 backdrop-blur">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl sm:text-2xl flex items-center justify-center gap-3">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Get URL Statistics
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Enter a short URL or just the short code to view its analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="shortUrl" className="text-sm sm:text-base font-medium">
                    Short URL or Code
                  </Label>
                  <Input
                    id="shortUrl"
                    type="text"
                    placeholder="abc123 or https://shortlink.lol/abc123"
                    value={shortUrl}
                    onChange={(e) => setShortUrl(e.target.value)}
                    required
                    className="h-10 sm:h-12 text-sm sm:text-base"
                  />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    You can enter just the short code (e.g., "abc123") or the full URL
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 sm:h-12 text-sm sm:text-base font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <MousePointer className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm sm:text-base">
                Click Tracking
              </h3>
              <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                See exactly how many times your URL has been clicked
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 text-sm sm:text-base">
                Creation Date
              </h3>
              <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">
                View when the short URL was originally created
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 text-sm sm:text-base">
                Status Tracking
              </h3>
              <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">
                Check if the URL is active and when it expires
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2 text-sm sm:text-base">
                Detailed Stats
              </h3>
              <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300">
                Get comprehensive analytics for any short URL
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
