'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { saveUploadedImage } from '@/lib/upload'
import { sanitizeRichText } from '@/lib/sanitize'
import { requireAdminForPath } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import type { ContentStatus } from '@/lib/enums'

async function requireAdmin() {
  return requireAdminForPath('/admin/bai-viet')
}

function readForm(formData: FormData) {
  const title = String(formData.get('title') || '').trim()
  let slug = String(formData.get('slug') || '').trim()
  slug = slugify(slug || title)

  const publishedAtStr = String(formData.get('publishedAt') || '')

  return {
    title,
    slug,
    categoryId: formData.get('categoryId') ? Number(formData.get('categoryId')) : null,
    excerpt: String(formData.get('excerpt') || '') || null,
    contentHtml: sanitizeRichText(String(formData.get('contentHtml') || '')) || null,
    author: String(formData.get('author') || '') || null,
    videoUrl: String(formData.get('videoUrl') || '') || null,
    publishedAt: publishedAtStr ? new Date(publishedAtStr) : undefined,
    status: String(formData.get('status') || 'PUBLISHED') as ContentStatus,
  }
}

export async function createBaiVietAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.title) return { error: 'Tiêu đề bài viết là bắt buộc.' }

  let thumbnailUrl: string | null = null
  let coverImageUrl: string | null = null
  try {
    thumbnailUrl = await saveUploadedImage(formData.get('thumbnailUrl') as File | null, 'bai-viet')
    coverImageUrl = await saveUploadedImage(formData.get('coverImageUrl') as File | null, 'bai-viet')
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  try {
    await prisma.newsArticle.create({ data: { ...data, thumbnailUrl, coverImageUrl: coverImageUrl || thumbnailUrl } })
  } catch {
    return { error: 'Không thể tạo bài viết. Đường dẫn (slug) có thể đã tồn tại.' }
  }

  revalidatePath('/admin/bai-viet')
  redirect('/admin/bai-viet')
}

export async function updateBaiVietAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.title) return { error: 'Tiêu đề bài viết là bắt buộc.' }

  let thumbnailUrl: string | undefined
  let coverImageUrl: string | undefined
  try {
    const n = await saveUploadedImage(formData.get('thumbnailUrl') as File | null, 'bai-viet')
    const l = await saveUploadedImage(formData.get('coverImageUrl') as File | null, 'bai-viet')
    if (n) thumbnailUrl = n
    if (l) coverImageUrl = l
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  try {
    await prisma.newsArticle.update({
      where: { id },
      data: { ...data, ...(thumbnailUrl ? { thumbnailUrl } : {}), ...(coverImageUrl ? { coverImageUrl } : {}) },
    })
  } catch {
    return { error: 'Không thể cập nhật bài viết. Đường dẫn (slug) có thể đã tồn tại.' }
  }

  revalidatePath('/admin/bai-viet')
  redirect('/admin/bai-viet')
}

export async function deleteBaiVietAction(id: number) {
  await requireAdmin()
  await prisma.newsArticle.delete({ where: { id } })
  revalidatePath('/admin/bai-viet')
}
