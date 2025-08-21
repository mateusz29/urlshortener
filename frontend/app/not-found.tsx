import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home, Search, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-2 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">404 - Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              The page you're looking for doesn't exist.
            </p>
          </div>
          <div className="grid gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
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
