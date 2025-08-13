"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LinkIcon, LayoutDashboard, Moon, Sun, BarChart3 } from "lucide-react"
import { useTheme } from "next-themes"

export function Navigation() {
  const { setTheme, theme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <LinkIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          ShortLink
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              All URLs
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
