import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { UrlShortener } from "@/components/url-shortener"

export default function HomePage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <Hero />
        <div className="mt-20">
          <UrlShortener />
        </div>
        <div className="mt-32">
          <Features />
        </div>
      </div>
    </div>
  )
}
