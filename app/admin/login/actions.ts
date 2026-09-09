'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { verifyCredentials, createSession } from '@/lib/auth'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { logSecurityEvent } from '@/lib/security-log'
import type { ActionState } from '@/app/admin/_components/ActionForm'

const LOGIN_WINDOW_MS = 15 * 60 * 1000

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const redirectTo = String(formData.get('redirectTo') || '/admin')

  if (!email || !password) {
    return { error: 'Vui lòng nhập đầy đủ email và mật khẩu.' }
  }

  // Giới hạn theo cả IP (chặn 1 nguồn dò nhiều tài khoản) lẫn theo email (chặn nhiều nguồn
  // cùng dò 1 tài khoản) - brute-force/credential-stuffing cần vượt qua cả 2 mới thử tiếp được.
  const ip = getClientIp()
  const ipLimit = checkRateLimit(`login:ip:${ip}`, 20, LOGIN_WINDOW_MS)
  const emailLimit = checkRateLimit(`login:email:${email.toLowerCase()}`, 5, LOGIN_WINDOW_MS)
  if (!ipLimit.ok || !emailLimit.ok) {
    const retryAfterSec = Math.max(ipLimit.retryAfterSec, emailLimit.retryAfterSec)
    const minutes = Math.ceil(retryAfterSec / 60)
    await logSecurityEvent('LOGIN_RATE_LIMITED', `email=${email}`, ip)
    return { error: `Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau ${minutes} phút.` }
  }

  const user = await verifyCredentials(email, password)
  if (!user) {
    await logSecurityEvent('LOGIN_FAILED', `email=${email}`, ip)
    return { error: 'Email hoặc mật khẩu không đúng.' }
  }

  await createSession({ id: user.id, email: user.email, fullName: user.fullName, role: user.role })
  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

  // Next.js cache Router Cache phía client theo URL, không theo cookie phiên đăng nhập -
  // nếu không revalidate, sidebar/trang có thể hiển thị dữ liệu (quyền truy cập, vai trò)
  // của người vừa đăng xuất trong vài chục giây trước khi tự làm mới.
  revalidatePath('/', 'layout')
  redirect(redirectTo.startsWith('/admin') ? redirectTo : '/admin')
}
