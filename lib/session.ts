import { SignJWT, jwtVerify } from 'jose'
import type { AdminRole } from '@/lib/enums'

// Khóa ký JWT - bắt buộc phải có trong môi trường. KHÔNG dùng giá trị fallback hard-code: một
// khoá mặc định ai đọc mã nguồn cũng biết sẽ cho phép giả mạo JWT hợp lệ (kể cả session
// superadmin) nếu biến môi trường vô tình chưa được nạp lúc deploy - thà app không chạy được
// còn hơn chạy "fail-open" với khoá đoán trước được.
const secretKey = process.env.JWT_SECRET
if (!secretKey) {
  throw new Error('Thiếu biến môi trường JWT_SECRET - xem .env.example.')
}
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
