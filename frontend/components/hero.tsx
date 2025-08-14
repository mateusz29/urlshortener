import { Zap, Shield, BarChart3 } from "lucide-react"

export function Hero() {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground">
          Shorten URLs
          <br />
          <span className="text-primary">Lightning Fast</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Create short, memorable links in seconds. Track clicks, generate QR codes, and manage your URLs with
          enterprise-grade analytics.
        </p>
      </div>

      <div className="flex items-center justify-center gap-12 pt-8">
        <div className="flex flex-col items-center gap-3 group">
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 group-hover:scale-110 transition-transform">
            <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <span className="text-sm font-medium">Instant</span>
        </div>
        <div className="flex flex-col items-center gap-3 group">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 group-hover:scale-110 transition-transform">
            <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-sm font-medium">Secure</span>
        </div>
        <div className="flex flex-col items-center gap-3 group">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform">
            <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm font-medium">Analytics</span>
        </div>
      </div>
    </div>
  )
}
