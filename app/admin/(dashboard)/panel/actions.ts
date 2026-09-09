'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { saveUploadedImage } from '@/lib/upload'
import { requireAdminForPath } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import type { ContentStatus } from '@/lib/enums'

async function requireAdmin() {
  return requireAdminForPath('/admin/panel')
}

function readForm(formData: FormData) {
  return {
    sortOrder: formData.get('sortOrder') ? Number(formData.get('sortOrder')) : 0,
    linkUrl: String(formData.get('linkUrl') || '') || null,
    widthPx: formData.get('widthPx') ? Number(formData.get('widthPx')) : null,
    heightPx: formData.get('heightPx') ? Number(formData.get('heightPx')) : null,
    status: String(formData.get('status') || 'PUBLISHED') as ContentStatus,
  }
}

export async function createPanelAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)

  let imageUrl: string | null = null
  try {
    imageUrl = await saveUploadedImage(formData.get('anh') as File | null, 'panel')
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }
  if (!imageUrl) return { error: 'Vui lòng chọn ảnh panel.' }

  await prisma.adPanel.create({ data: { ...data, imageUrl } })

  revalidatePath('/admin/panel')
  redirect('/admin/panel')
}

export async function updatePanelAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)

  let imageUrl: string | undefined
  try {
    const uploaded = await saveUploadedImage(formData.get('anh') as File | null, 'panel')
    if (uploaded) imageUrl = uploaded
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  await prisma.adPanel.update({
    where: { id },
    data: { ...data, ...(imageUrl ? { imageUrl } : {}) },
  })

  revalidatePath('/admin/panel')
  redirect('/admin/panel')
}

export async function deletePanelAction(id: number) {
  await requireAdmin()
  await prisma.adPanel.delete({ where: { id } })
  revalidatePath('/admin/panel')
}
