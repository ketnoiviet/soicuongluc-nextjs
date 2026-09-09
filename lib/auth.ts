import 'server-only'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE, encryptSession, decryptSession, type SessionPayload } from '@/lib/session'
import { isPathAllowed, parsePermissions } from '@/lib/permissions'
import { logSecurityEvent } from '@/lib/security-log'
import { getClientIp } from '@/lib/rate-limit'
import type { AdminRole } from '@/lib/enums'

const SEVEN_DAYS = 60 * 60 * 24 * 7

// Kiểm tra email + mật khẩu, trả về user nếu đúng
export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { email: email.trim().toLowerCase() } })
  if (!user || !user.isActive) return null
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return null
  return user
}

// Tạo cookie phiên đăng nhập (httpOnly)
export async function createSession(user: { id: number; email: string; fullName: string | null; role: string }) {
  const token = await encryptSession({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role as AdminRole,
  })
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SEVEN_DAYS,
  })
}

// Xóa cookie phiên đăng nhập
export function destroySession() {
  cookies().delete(SESSION_COOKIE)
}

// Đọc phiên đăng nhập hiện tại (dùng trong Server Component / Server Action)
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value
  return decryptSession(token)
}

// Đọc lại bản ghi AdminUser mới nhất từ DB thay vì tin JWT đã ký sẵn — cần cho mọi chỗ
// quyết định theo role/permissions/isActive, vì các giá trị này có thể bị người khác
// (vd superadmin) đổi giữa lúc user đang có session hợp lệ (JWT không tự hết hạn theo
// việc đó). Trả null nếu user đã bị xoá hoặc bị khoá (isActive=false).
export async function getCurrentAdminUser() {
  const session = await getSession()
  if (!session) return null
  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } })
  if (!user || !user.isActive) return null
  return user
}

// Băm mật khẩu mới
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

// Kiểm tra 1 user hiện tại có được thao tác trên "trang" (pathname) tương ứng không - tra lại
// DB (getCurrentAdminUser chặn ngay tài khoản vừa bị khoá, không đợi JWT hết hạn tới 7 ngày) VÀ
// đúng quyền theo trang (isPathAllowed - cùng luật đang áp cho việc hiển thị trang ở
// AdminLayout). Không tự redirect/throw ở đây để dùng được cả trong Route Handler (nơi
// next/navigation.redirect() không hợp lệ) lẫn Server Action - nơi gọi tự quyết định cách
// phản hồi (redirect trang vs trả JSON 401/403).
export async function checkAdminPathAccess(
  pathname: string
): Promise<{ ok: true; user: NonNullable<Awaited<ReturnType<typeof getCurrentAdminUser>>> } | { ok: false; reason: 'unauthenticated' | 'forbidden' }> {
  const user = await getCurrentAdminUser()
  if (!user) return { ok: false, reason: 'unauthenticated' }

  const allowedHrefs = parsePermissions(user.permissions)
  if (!isPathAllowed(pathname, user.role as AdminRole, allowedHrefs)) {
    // Không await ở đây để không làm chậm phản hồi cho case bị từ chối (không có gì phải chờ
    // ghi log xong) - logSecurityEvent tự nuốt lỗi (best-effort), không cần .catch thêm.
    void logSecurityEvent('PERMISSION_DENIED', `user=${user.email} path=${pathname}`, getClientIp())
    return { ok: false, reason: 'forbidden' }
  }
  return { ok: true, user }
}

// Dùng ở đầu MỌI Server Action ghi/xoá dữ liệu thay cho việc chỉ gọi getSession(). Trước đây
// mỗi module tự định nghĩa requireAdmin() riêng chỉ giải mã JWT, không tra lại DB và không
// kiểm tra quyền theo trang - một tài khoản bị giới hạn quyền chỉ xem 1 trang vẫn gọi thẳng
// được action của module khác nếu biết action đó tồn tại.
export async function requireAdminForPath(pathname: string) {
  const result = await checkAdminPathAccess(pathname)
  if (result.ok) return result.user

  if (result.reason === 'unauthenticated') redirect('/admin/login')
  // throw (không redirect) cho trường hợp "forbidden" - nhiều nơi gọi action này trực tiếp và
  // bọc try/catch để hiện alert (vd ConfirmDeleteButton); redirect() bên trong sẽ bị catch nuốt
  // mất thành lỗi "NEXT_REDIRECT" thay vì điều hướng thật.
  throw new Error('Bạn không có quyền thực hiện thao tác này.')
}
