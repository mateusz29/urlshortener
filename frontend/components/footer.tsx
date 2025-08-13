import Link from "next/link"
import { LinkIcon, Github, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <LinkIcon className="h-6 w-6 text-primary" />
              ShortLink
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Fast, reliable URL shortening service. Create short links, track clicks, and generate QR codes instantly.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Create Short URL
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse All URLs
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-muted-foreground hover:text-foreground transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

         <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Connect</h3>
            <div className="space-y-3">
              <a
                href="https://github.com/mateusz29/urlshortener"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ShortLink. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
