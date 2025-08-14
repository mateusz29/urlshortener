"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, QrCode, BarChart3, CheckCircle, Sparkles } from "lucide-react"
import type { URLCreate, URLResponse } from "@/types/api"
import { QrCodeDialog } from "./qr-code-dialog"
import Link from "next/link"

const expirationOptions = [
  { value: "1h", label: "1 Hour" },
  { value: "6h", label: "6 Hours" },
  { value: "24h", label: "1 Day" },
  { value: "7d", label: "1 Week" },
  { value: "30d", label: "1 Month" },
  { value: "365d", label: "1 Year" },
  { value: "never", label: "Never" },
]

export function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [expiresIn, setExpiresIn] = useState("never")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<URLResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const payload: URLCreate = {
        original_url: originalUrl,
        expires_in: expiresIn as any,
        custom_alias: customAlias || undefined,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
        setOriginalUrl("")
        setCustomAlias("")
        setExpiresIn("never")
      } else {
        const errorData = await response.json()
        setError(errorData.detail || "Failed to shorten URL")
      }
    } catch (error) {
      setError("Network error. Please try again.")
      console.error("Error shortening URL:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (result) {
      const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${result.short_url}`
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-background to-muted/20 backdrop-blur">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Shorten Your URL
          </CardTitle>
          <CardDescription className="text-lg">
            Transform long URLs into short, shareable links with advanced features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="url" className="text-base font-medium">
                URL to shorten
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very-long-url-that-needs-shortening"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="alias" className="text-base font-medium">
                  Custom alias (optional)
                </Label>
                <Input
                  id="alias"
                  placeholder="my-custom-link"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  minLength={3}
                  maxLength={20}
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  3-20 characters, letters, numbers, hyphens, and underscores only
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="expires" className="text-base font-medium">
                  Expires in
                </Label>
                <Select value={expiresIn} onValueChange={setExpiresIn}>
                  <SelectTrigger className="h-12">
                    <span>{expirationOptions.find(o => o.value === expiresIn)?.label || "Never"}</span>
                  </SelectTrigger>
                  <SelectContent>
                    {expirationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base font-medium" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Shortening...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Shorten URL
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3 text-green-700 dark:text-green-400">
              <CheckCircle className="h-6 w-6" />
              URL Shortened Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Your shortened URL</Label>
              <div className="flex items-center gap-3">
                <Input
                  value={`${process.env.NEXT_PUBLIC_BASE_URL}/${result.short_url}`}
                  readOnly
                  className="font-mono text-base h-12 bg-background"
                />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={copyToClipboard}
                  className="flex-shrink-0 h-12 px-6 bg-transparent"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Badge variant="secondary" className="px-3 py-1">
                {result.is_active ? "Active" : "Inactive"}
              </Badge>
              {result.expires_at && (
                <span className="text-muted-foreground">
                  Expires: {new Date(result.expires_at).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button variant="outline" size="lg" asChild>
                <a
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/${result.short_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Link
                </a>
              </Button>

              <QrCodeDialog shortUrl={result.short_url}>
                <Button variant="outline" size="lg">
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </Button>
              </QrCodeDialog>

              <Button variant="outline" size="lg" asChild>
                <Link href={`/stats/${result.short_url}`}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Stats
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
