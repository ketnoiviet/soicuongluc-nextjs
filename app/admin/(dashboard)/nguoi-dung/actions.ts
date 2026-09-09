'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireAdminForPath, hashPassword } from '@/lib/auth'
import { canManageRole } from '@/lib/permissions'
import { navItemsFlat } from '@/app/admin/_components/nav-data'
import { MIN_PASSWORD_LENGTH } from '@/lib/constants'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import type { AdminRole } from '@/lib/enums'

async function requireAdmin() {
  return requireAdminForPath('/admin/nguoi-dung')
}

// Áp cùng 1 luật rank(target) <= rank(viewer) cho mọi thao tác quản lý user khác -
// đây là chỗ duy nhất chặn admin thường đụng vào tài khoản superadmin.
async function requireManageableTarget(viewerRole: AdminRole, targetId: number) {
  const target = await prisma.adminUser.findUnique({ where: { id: targetId } })
  if (!target || !canManageRole(viewerRole, target.role as AdminRole)) {
    throw new Error('Không tìm thấy tài khoản hoặc bạn không có quyền thao tác với tài khoản này.')
  }
  return target
}

export async function createNguoiDungAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireAdmin()
  const fullName = String(formData.get('fullName') || '').trim() || null
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')
  const role = String(formData.get('role') || 'EDITOR') as AdminRole

  if (!email) return { error: 'Email là bắt buộc.' }
  if (password.length < MIN_PASSWORD_LENGTH) return { error: `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.` }
  if (!canManageRole(viewer.role as AdminRole, role)) return { error: 'Bạn không có quyền tạo tài khoản với vai trò này.' }

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
  const viewer = await requireAdmin()
  if (viewer.id === id && !isActive) {
    throw new Error('Bạn không thể tự khóa tài khoản của chính mình.')
  }
  await requireManageableTarget(viewer.role as AdminRole, id)
  await prisma.adminUser.update({ where: { id }, data: { isActive } })
  revalidatePath('/admin/nguoi-dung')
}

export async function deleteNguoiDungAction(id: number) {
  const viewer = await requireAdmin()
  if (viewer.id === id) {
    throw new Error('Bạn không thể tự xóa tài khoản của chính mình.')
  }
  await requireManageableTarget(viewer.role as AdminRole, id)
  await prisma.adminUser.delete({ where: { id } })
  revalidatePath('/admin/nguoi-dung')
}

// Trang "Sửa tài khoản": đổi mật khẩu (bỏ trống nếu không đổi), vai trò, và danh sách
// trang quản trị được phép truy cập - gộp 1 action theo đúng thiết kế của trang.
export async function updateNguoiDungAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireAdmin()
  if (viewer.id === id) {
    return { error: 'Không thể tự chỉnh sửa quyền của chính mình ở đây - dùng trang Đổi mật khẩu.' }
  }
  let target: Awaited<ReturnType<typeof requireManageableTarget>>
  try {
    target = await requireManageableTarget(viewer.role as AdminRole, id)
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Có lỗi xảy ra.' }
  }

  const role = String(formData.get('role') || target.role) as AdminRole
  if (!canManageRole(viewer.role as AdminRole, role)) {
    return { error: 'Bạn không có quyền gán vai trò này.' }
  }

  const password = String(formData.get('password') || '')
  if (password && password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Mật khẩu mới phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.` }
  }

  const fullAccess = formData.get('fullAccess') === 'on'
  const validHrefs = new Set(navItemsFlat.map((i) => i.href))
  const selectedHrefs: string[] = []
  formData.forEach((value, key) => {
    if (key.startsWith('perm_') && value === 'on') {
      const href = key.slice('perm_'.length)
      if (validHrefs.has(href)) selectedHrefs.push(href)
    }
  })

  const data: { role: AdminRole; permissions: string | null; passwordHash?: string } = {
    role,
    permissions: fullAccess ? null : JSON.stringify(selectedHrefs),
  }
  if (password) data.passwordHash = await hashPassword(password)

  await prisma.adminUser.update({ where: { id }, data })

  revalidatePath('/admin/nguoi-dung')
  redirect('/admin/nguoi-dung')
}

export async function changeOwnPasswordAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireAdmin()
  const bcrypt = (await import('bcryptjs')).default
  const current = String(formData.get('currentPassword') || '')
  const next = String(formData.get('newPassword') || '')
  const confirm = String(formData.get('confirmPassword') || '')

  if (next.length < MIN_PASSWORD_LENGTH) return { error: `Mật khẩu mới phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.` }
  if (next !== confirm) return { error: 'Xác nhận mật khẩu không khớp.' }

  const ok = await bcrypt.compare(current, viewer.passwordHash)
  if (!ok) return { error: 'Mật khẩu hiện tại không đúng.' }

  const passwordHash = await hashPassword(next)
  await prisma.adminUser.update({ where: { id: viewer.id }, data: { passwordHash } })

  return { success: 'Đổi mật khẩu thành công!' }
}
