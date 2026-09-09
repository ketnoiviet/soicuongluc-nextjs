'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { deleteUploadedFile, extractImageSrcs } from '@/lib/upload'
import { sanitizeRichText } from '@/lib/sanitize'
import { requireAdminForPath } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import type { ContentStatus } from '@/lib/enums'

async function requireAdmin() {
  return requireAdminForPath('/admin/trang-noi-dung')
}

function readForm(formData: FormData) {
  const title = String(formData.get('title') || '').trim()
  let slug = String(formData.get('slug') || '').trim()
  slug = slugify(slug || title)

  return {
    title,
    slug,
    contentHtml: sanitizeRichText(String(formData.get('contentHtml') || '')) || null,
    sortOrder: formData.get('sortOrder') ? Number(formData.get('sortOrder')) : 0,
    status: String(formData.get('status') || 'PUBLISHED') as ContentStatus,
  }
}

export async function createTrangNoiDungAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.title) return { error: 'Tiêu đề là bắt buộc.' }

  try {
    await prisma.contentPage.create({ data })
  } catch {
    return { error: 'Không thể tạo trang. Đường dẫn (slug) có thể đã tồn tại.' }
  }

  revalidatePath('/admin/trang-noi-dung')
  redirect('/admin/trang-noi-dung')
}

export async function updateTrangNoiDungAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.title) return { error: 'Tiêu đề là bắt buộc.' }

  try {
    await prisma.contentPage.update({ where: { id }, data })
  } catch {
    return { error: 'Không thể cập nhật trang. Đường dẫn (slug) có thể đã tồn tại.' }
  }

  revalidatePath('/admin/trang-noi-dung')
  redirect('/admin/trang-noi-dung')
}

export async function deleteTrangNoiDungAction(id: number) {
  await requireAdmin()
  const deleted = await prisma.contentPage.delete({ where: { id } })
  for (const src of extractImageSrcs(deleted.contentHtml)) await deleteUploadedFile(src)
  revalidatePath('/admin/trang-noi-dung')
}
