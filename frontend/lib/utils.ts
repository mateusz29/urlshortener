import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Running on the client
    return window.location.origin
  }

  // Running on the server
  return (process.env.BASE_URL as string).replace(/\/+$/, "") // strip all trailing slashes
}

export function getApiUrl(): string {
  return (process.env.API_URL as string).replace(/\/+$/, "")
}
