'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { saveUploadedImage, deleteUploadedFile } from '@/lib/upload'
import { requireAdminForPath } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import type { ContentStatus } from '@/lib/enums'

async function requireAdmin() {
  return requireAdminForPath('/admin/nhan-xet-khach-hang')
}

function readForm(formData: FormData) {
  const rating = Number(formData.get('rating') || 5)
  return {
    customerName: String(formData.get('customerName') || '').trim(),
    position: String(formData.get('position') || '').trim() || null,
    content: String(formData.get('content') || '').trim() || null,
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, rating)) : 5,
    sortOrder: formData.get('sortOrder') ? Number(formData.get('sortOrder')) : 0,
    status: String(formData.get('status') || 'PUBLISHED') as ContentStatus,
  }
}

export async function createNhanXetAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.customerName) return { error: 'Tên khách hàng là bắt buộc.' }

  let avatarUrl: string | null = null
  try {
    avatarUrl = await saveUploadedImage(formData.get('avatarUrl') as File | null, 'nhan-xet-khach-hang')
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  await prisma.testimonial.create({ data: { ...data, avatarUrl } })

  revalidatePath('/admin/nhan-xet-khach-hang')
  redirect('/admin/nhan-xet-khach-hang')
}

export async function updateNhanXetAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.customerName) return { error: 'Tên khách hàng là bắt buộc.' }

  let avatarUrl: string | undefined
  try {
    const uploaded = await saveUploadedImage(formData.get('avatarUrl') as File | null, 'nhan-xet-khach-hang')
    if (uploaded) avatarUrl = uploaded
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  await prisma.testimonial.update({ where: { id }, data: { ...data, ...(avatarUrl ? { avatarUrl } : {}) } })

  revalidatePath('/admin/nhan-xet-khach-hang')
  redirect('/admin/nhan-xet-khach-hang')
}

export async function deleteNhanXetAction(id: number) {
  await requireAdmin()
  const deleted = await prisma.testimonial.delete({ where: { id } })
  await deleteUploadedFile(deleted.avatarUrl)
  revalidatePath('/admin/nhan-xet-khach-hang')
}
