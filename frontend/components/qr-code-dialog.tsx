"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { getBaseUrl } from "@/lib/utils"
import Image from "next/image"

interface QrCodeDialogProps {
  shortUrl: string
  children: React.ReactNode
}

export function QrCodeDialog({ shortUrl, children }: QrCodeDialogProps) {
  const [loading, setLoading] = useState(false)

  const downloadQrCode = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/qr/${shortUrl}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `qr-${shortUrl}.png`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Failed to download QR code:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>Scan this QR code to access your shortened URL</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-lg">
            <Image
              src={`/api/qr/${shortUrl}`}
              alt="QR Code"
              width={200}
              height={200}
              className="rounded"
            />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground font-mono">
              {getBaseUrl()}/{shortUrl}
            </p>
            <Button onClick={downloadQrCode} disabled={loading} size="sm">
              <Download className="h-4 w-4 mr-2" />
              {loading ? "Downloading..." : "Download QR Code"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
