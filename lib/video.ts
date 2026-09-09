import type { VideoSource } from '@/lib/enums'

// Không đánh dấu 'server-only' - dùng cả ở admin action (server) lẫn component xem trước (client).

/// Nhận dạng nguồn video từ URL người dùng nhập (hỗ trợ các dạng URL YouTube/Facebook phổ biến).
export function detectVideoSource(url: string): VideoSource {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    if (host === 'youtube.com' || host === 'youtu.be' || host === 'm.youtube.com') return 'YOUTUBE'
    if (host === 'facebook.com' || host === 'fb.watch' || host === 'm.facebook.com') return 'FACEBOOK'
  } catch {
    // URL không hợp lệ - coi như nguồn khác, không chặn lưu (chỉ ảnh hưởng khả năng nhúng xem trước).
  }
  return 'OTHER'
}

function extractYoutubeId(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') return u.pathname.slice(1) || null
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (u.searchParams.get('v')) return u.searchParams.get('v')
      const match = u.pathname.match(/\/(embed|shorts)\/([^/?]+)/)
      if (match) return match[2]
    }
  } catch {
    return null
  }
  return null
}

/// URL nhúng để play trong popup - null nếu không xác định được cách nhúng (nguồn OTHER).
export function getEmbedUrl(url: string, source: VideoSource): string | null {
  if (source === 'YOUTUBE') {
    const id = extractYoutubeId(url)
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null
  }
  if (source === 'FACEBOOK') {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1`
  }
  return null
}
