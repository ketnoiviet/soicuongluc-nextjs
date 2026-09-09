'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { saveUploadedImage, deleteUploadedFile, extractImageSrcs } from '@/lib/upload'
import { sanitizeRichText } from '@/lib/sanitize'
import { requireAdminForPath } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import type { ContentStatus } from '@/lib/enums'

async function requireAdmin() {
  return requireAdminForPath('/admin/gioi-thieu')
}

function readForm(formData: FormData) {
  const title = String(formData.get('title') || '').trim()
  let slug = String(formData.get('slug') || '').trim()
  slug = slugify(slug || title)

  return {
    title,
    slug,
    sortOrder: formData.get('sortOrder') ? Number(formData.get('sortOrder')) : 0,
    contentHtml: sanitizeRichText(String(formData.get('contentHtml') || '')) || null,
    status: String(formData.get('status') || 'PUBLISHED') as ContentStatus,
  }
}

export async function createGioiThieuAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.title) return { error: 'Tiêu đề là bắt buộc.' }

  let thumbnailUrl: string | null = null
  try {
    thumbnailUrl = await saveUploadedImage(formData.get('thumbnailUrl') as File | null, 'gioi-thieu')
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  try {
    await prisma.aboutArticle.create({ data: { ...data, thumbnailUrl } })
  } catch {
    return { error: 'Không thể tạo bài viết. Đường dẫn (slug) có thể đã tồn tại.' }
  }

  revalidatePath('/admin/gioi-thieu')
  revalidatePath('/gioi-thieu')
  redirect('/admin/gioi-thieu')
}

export async function updateGioiThieuAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.title) return { error: 'Tiêu đề là bắt buộc.' }

  let thumbnailUrl: string | undefined
  try {
    const uploaded = await saveUploadedImage(formData.get('thumbnailUrl') as File | null, 'gioi-thieu')
    if (uploaded) thumbnailUrl = uploaded
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  try {
    await prisma.aboutArticle.update({ where: { id }, data: { ...data, ...(thumbnailUrl ? { thumbnailUrl } : {}) } })
  } catch {
    return { error: 'Không thể cập nhật bài viết. Đường dẫn (slug) có thể đã tồn tại.' }
  }

  revalidatePath('/admin/gioi-thieu')
  revalidatePath('/gioi-thieu')
  redirect('/admin/gioi-thieu')
}

export async function deleteGioiThieuAction(id: number) {
  await requireAdmin()
  const deleted = await prisma.aboutArticle.delete({ where: { id } })
  await deleteUploadedFile(deleted.thumbnailUrl)
  for (const src of extractImageSrcs(deleted.contentHtml)) await deleteUploadedFile(src)
  revalidatePath('/admin/gioi-thieu')
  revalidatePath('/gioi-thieu')
}
