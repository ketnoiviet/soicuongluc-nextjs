import 'server-only'
import { prisma } from '@/lib/prisma'

export const SECURITY_EVENT_TYPES = ['LOGIN_FAILED', 'LOGIN_RATE_LIMITED', 'PERMISSION_DENIED'] as const
export type SecurityEventType = (typeof SECURITY_EVENT_TYPES)[number]

/**
 * Ghi log 1 sự kiện bảo mật (đăng nhập thất bại, bị chặn do rate-limit, từ chối quyền truy cập)
 * để có thể truy vết khi có sự cố - trước đây không hề có log nào cho 3 việc này. Best-effort:
 * không bao giờ throw, vì việc ghi log thất bại không được phép làm hỏng request chính đang xử lý.
 */
export async function logSecurityEvent(eventType: SecurityEventType, detail?: string, ipAddress?: string): Promise<void> {
  try {
    await prisma.securityLog.create({ data: { eventType, detail, ipAddress } })
  } catch (e) {
    console.error('[security-log] Không thể ghi log:', e)
  }
}
