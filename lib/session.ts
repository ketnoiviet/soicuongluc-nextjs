import { SignJWT, jwtVerify } from 'jose'
import type { AdminRole } from '@/lib/enums'

// Khóa ký JWT - đọc từ biến môi trường, có fallback cho môi trường dev
const secretKey = process.env.JWT_SECRET || 'dev-only-secret-change-in-env'
const encodedKey = new TextEncoder().encode(secretKey)

export const SESSION_COOKIE = 'admin_session'

export interface SessionPayload {
  userId: number
  email: string
  fullName: string | null
  role: AdminRole
  [key: string]: unknown
}

// Tạo JWT từ payload phiên đăng nhập
export async function encryptSession(payload: SessionPayload, expiresIn = '7d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedKey)
}

// Giải mã + xác thực JWT, trả về null nếu không hợp lệ/hết hạn
export async function decryptSession(token?: string | null): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ['HS256'] })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
