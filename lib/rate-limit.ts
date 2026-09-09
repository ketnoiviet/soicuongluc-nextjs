import 'server-only'
import { headers } from 'next/headers'

// Rate-limit đơn giản kiểu fixed-window, lưu trong bộ nhớ tiến trình. Đủ dùng cho quy mô 1
// instance Node của dự án này (không có Redis/hạ tầng chia sẻ nào khác) - mục tiêu là chặn
// brute-force/spam tự động, không phải chống DDoS phân tán.
type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

// Dọn định kỳ để Map không phình vô hạn theo thời gian sống của tiến trình.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
const cleanupTimer = setInterval(() => {
  const now = Date.now()
  buckets.forEach((bucket, key) => {
    if (bucket.resetAt < now) buckets.delete(key)
  })
}, CLEANUP_INTERVAL_MS)
cleanupTimer.unref?.()

export function checkRateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfterSec: 0 }
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  bucket.count += 1
  return { ok: true, retryAfterSec: 0 }
}

// Đọc IP client từ header do reverse proxy gắn (x-forwarded-for/x-real-ip) - Next.js không lộ
// IP kết nối TCP thật trực tiếp cho Server Action. Nếu không có header nào (vd chạy local
// không qua proxy) thì gộp chung 1 khoá "unknown" - vẫn còn tốt hơn không giới hạn gì.
export function getClientIp(requestHeaders?: Headers): string {
  const h = requestHeaders ?? headers()
  const forwardedFor = h.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return h.get('x-real-ip') || 'unknown'
}
