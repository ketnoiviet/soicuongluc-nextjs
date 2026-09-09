'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { saveVideoThumbnail, deleteUploadedFile, extractImageSrcs } from '@/lib/upload'
import { detectVideoSource } from '@/lib/video'
import { sanitizeRichText } from '@/lib/sanitize'
import { requireAdminForPath } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import type { ContentStatus } from '@/lib/enums'

async function requireAdmin() {
  return requireAdminForPath('/admin/videos')
}

function readForm(formData: FormData) {
  const videoUrl = String(formData.get('videoUrl') || '').trim()
  return {
    title: String(formData.get('title') || '').trim() || null,
    sortOrder: formData.get('sortOrder') ? Number(formData.get('sortOrder')) : 0,
    videoUrl,
    videoSource: detectVideoSource(videoUrl),
    descriptionHtml: sanitizeRichText(String(formData.get('descriptionHtml') || '')) || null,
    status: String(formData.get('status') || 'PUBLISHED') as ContentStatus,
  }
}

export async function createVideoAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.videoUrl) return { error: 'URL video là bắt buộc.' }

  let thumbnailUrl: string | null = null
  try {
    thumbnailUrl = await saveVideoThumbnail(formData.get('thumbnailUrl') as File | null)
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  await prisma.video.create({ data: { ...data, thumbnailUrl } })

  revalidatePath('/admin/videos')
  redirect('/admin/videos')
}

export async function updateVideoAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.videoUrl) return { error: 'URL video là bắt buộc.' }

  let thumbnailUrl: string | undefined
  try {
    const uploaded = await saveVideoThumbnail(formData.get('thumbnailUrl') as File | null)
    if (uploaded) thumbnailUrl = uploaded
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  await prisma.video.update({ where: { id }, data: { ...data, ...(thumbnailUrl ? { thumbnailUrl } : {}) } })

  revalidatePath('/admin/videos')
  redirect('/admin/videos')
}

export async function deleteVideoAction(id: number) {
  await requireAdmin()
  const deleted = await prisma.video.delete({ where: { id } })
  await deleteUploadedFile(deleted.thumbnailUrl)
  for (const src of extractImageSrcs(deleted.descriptionHtml)) await deleteUploadedFile(src)
  revalidatePath('/admin/videos')
}
