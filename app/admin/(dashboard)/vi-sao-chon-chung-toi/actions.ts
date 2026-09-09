'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { saveUploadedImage, deleteUploadedFile } from '@/lib/upload'
import { requireAdminForPath } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import type { ContentStatus } from '@/lib/enums'

async function requireAdmin() {
  return requireAdminForPath('/admin/vi-sao-chon-chung-toi')
}

function readForm(formData: FormData) {
  return {
    title: String(formData.get('title') || '').trim(),
    description: String(formData.get('description') || '').trim() || null,
    sortOrder: formData.get('sortOrder') ? Number(formData.get('sortOrder')) : 0,
    status: String(formData.get('status') || 'PUBLISHED') as ContentStatus,
  }
}

export async function createVisaoAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.title) return { error: 'Tiêu đề là bắt buộc.' }

  let iconUrl: string | null = null
  try {
    iconUrl = await saveUploadedImage(formData.get('iconUrl') as File | null, 'vi-sao-chon-chung-toi')
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  await prisma.whyChooseUsItem.create({ data: { ...data, iconUrl } })

  revalidatePath('/admin/vi-sao-chon-chung-toi')
  redirect('/admin/vi-sao-chon-chung-toi')
}

export async function updateVisaoAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.title) return { error: 'Tiêu đề là bắt buộc.' }

  let iconUrl: string | undefined
  try {
    const uploaded = await saveUploadedImage(formData.get('iconUrl') as File | null, 'vi-sao-chon-chung-toi')
    if (uploaded) iconUrl = uploaded
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  await prisma.whyChooseUsItem.update({ where: { id }, data: { ...data, ...(iconUrl ? { iconUrl } : {}) } })

  revalidatePath('/admin/vi-sao-chon-chung-toi')
  redirect('/admin/vi-sao-chon-chung-toi')
}

export async function deleteVisaoAction(id: number) {
  await requireAdmin()
  const deleted = await prisma.whyChooseUsItem.delete({ where: { id } })
  await deleteUploadedFile(deleted.iconUrl)
  revalidatePath('/admin/vi-sao-chon-chung-toi')
}
