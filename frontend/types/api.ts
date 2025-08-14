export interface URLCreate {
  original_url: string
  expires_in: "1h" | "6h" | "24h" | "7d" | "30d" | "365d" | "never"
  custom_alias?: string
}

export interface URLResponse {
  original_url: string
  short_url: string
  is_active: boolean
  expires_at: string | null
}

export interface URLStats {
  original_url: string
  short_url: string
  created_at: string
  expires_at: string | null
  is_active: boolean
  click_count: number
}

export interface URLListResponse {
  urls: URLResponse[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
