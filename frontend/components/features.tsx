import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, BarChart3, Calendar, Zap, Shield, Link } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate short URLs instantly with our optimized infrastructure.",
  },
  {
    icon: QrCode,
    title: "QR Code Generation",
    description: "Automatically generate QR codes for easy sharing and mobile access.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description: "Track clicks and monitor the performance of your shortened URLs.",
  },
  {
    icon: Calendar,
    title: "Custom Expiration",
    description: "Set expiration dates from 1 hour to never expire.",
  },
  {
    icon: Link,
    title: "Custom Aliases",
    description: "Create memorable custom aliases for your important links.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee.",
  },
]

export function Features() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Why Choose Our URL Shortener?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Powerful features designed to make link management simple and effective.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
