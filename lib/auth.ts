import 'server-only'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE, encryptSession, decryptSession, type SessionPayload } from '@/lib/session'
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

// Băm mật khẩu mới
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}
