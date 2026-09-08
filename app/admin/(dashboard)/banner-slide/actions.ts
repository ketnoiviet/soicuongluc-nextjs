'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { saveUploadedImage } from '@/lib/upload'
import { getSession } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'

async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

function readForm(formData: FormData) {
  return {
    sortOrder: formData.get('sortOrder') ? Number(formData.get('sortOrder')) : 0,
    linkUrl: String(formData.get('linkUrl') || '') || null,
    caption: String(formData.get('caption') || '') || null,
  }
}

export async function createBannerSlideAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)

  let imageUrl: string | null = null
  try {
    imageUrl = await saveUploadedImage(formData.get('anh') as File | null, 'banner')
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }
  if (!imageUrl) return { error: 'Vui lòng chọn ảnh banner.' }

  await prisma.bannerSlide.create({ data: { ...data, imageUrl } })

  revalidatePath('/admin/banner-slide')
  redirect('/admin/banner-slide')
}

export async function updateBannerSlideAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)

  let imageUrl: string | undefined
  try {
    const uploaded = await saveUploadedImage(formData.get('anh') as File | null, 'banner')
    if (uploaded) imageUrl = uploaded
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  await prisma.bannerSlide.update({
    where: { id },
    data: { ...data, ...(imageUrl ? { imageUrl } : {}) },
  })

  revalidatePath('/admin/banner-slide')
  redirect('/admin/banner-slide')
}

export async function deleteBannerSlideAction(id: number) {
  await requireAdmin()
  await prisma.bannerSlide.delete({ where: { id } })
  revalidatePath('/admin/banner-slide')
}
