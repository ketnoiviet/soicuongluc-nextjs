'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession, hashPassword } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import type { AdminRole } from '@/lib/enums'

async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

export async function createNguoiDungAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const fullName = String(formData.get('fullName') || '').trim() || null
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')
  const role = String(formData.get('role') || 'ADMIN') as AdminRole

  if (!email) return { error: 'Email là bắt buộc.' }
  if (password.length < 6) return { error: 'Mật khẩu phải có ít nhất 6 ký tự.' }

  const passwordHash = await hashPassword(password)
  try {
    await prisma.adminUser.create({ data: { fullName, email, passwordHash, role, isActive: true } })
  } catch {
    return { error: 'Email này đã được sử dụng.' }
  }

  revalidatePath('/admin/nguoi-dung')
  redirect('/admin/nguoi-dung')
}

export async function toggleNguoiDungActiveAction(id: number, isActive: boolean) {
  const session = await requireAdmin()
  if (session.userId === id && !isActive) {
    throw new Error('Bạn không thể tự khóa tài khoản của chính mình.')
  }
  await prisma.adminUser.update({ where: { id }, data: { isActive } })
  revalidatePath('/admin/nguoi-dung')
}

export async function deleteNguoiDungAction(id: number) {
  const session = await requireAdmin()
  if (session.userId === id) {
    throw new Error('Bạn không thể tự xóa tài khoản của chính mình.')
  }
  await prisma.adminUser.delete({ where: { id } })
  revalidatePath('/admin/nguoi-dung')
}

export async function resetNguoiDungPasswordAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const password = String(formData.get('password') || '')
  if (password.length < 6) return { error: 'Mật khẩu phải có ít nhất 6 ký tự.' }

  const passwordHash = await hashPassword(password)
  await prisma.adminUser.update({ where: { id }, data: { passwordHash } })

  revalidatePath('/admin/nguoi-dung')
  redirect('/admin/nguoi-dung')
}

export async function changeOwnPasswordAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()
  const bcrypt = (await import('bcryptjs')).default
  const current = String(formData.get('currentPassword') || '')
  const next = String(formData.get('newPassword') || '')
  const confirm = String(formData.get('confirmPassword') || '')

  if (next.length < 6) return { error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' }
  if (next !== confirm) return { error: 'Xác nhận mật khẩu không khớp.' }

  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } })
  if (!user) return { error: 'Không tìm thấy tài khoản.' }

  const ok = await bcrypt.compare(current, user.passwordHash)
  if (!ok) return { error: 'Mật khẩu hiện tại không đúng.' }

  const passwordHash = await hashPassword(next)
  await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash } })

  return { success: 'Đổi mật khẩu thành công!' }
}
