'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { sanitizeRichText } from '@/lib/sanitize'
import { requireAdminForPath } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import type { ContentStatus } from '@/lib/enums'

async function requireAdmin() {
  return requireAdminForPath('/admin/bai-viet-loai')
}

function readForm(formData: FormData) {
  const name = String(formData.get('name') || '').trim()
  let slug = String(formData.get('slug') || '').trim()
  slug = slugify(slug || name)

  return {
    name,
    slug,
    parentId: formData.get('parentId') ? Number(formData.get('parentId')) : null,
    sortOrder: formData.get('sortOrder') ? Number(formData.get('sortOrder')) : 0,
    status: String(formData.get('status') || 'PUBLISHED') as ContentStatus,
    descriptionHtml: sanitizeRichText(String(formData.get('descriptionHtml') || '')) || null,
  }
}

export async function createBaiVietLoaiAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.name) return { error: 'Tên danh mục là bắt buộc.' }

  try {
    await prisma.newsCategory.create({ data })
  } catch {
    return { error: 'Không thể tạo danh mục. Đường dẫn (slug) có thể đã tồn tại.' }
  }

  revalidatePath('/admin/bai-viet-loai')
  redirect('/admin/bai-viet-loai')
}

export async function updateBaiVietLoaiAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.name) return { error: 'Tên danh mục là bắt buộc.' }
  if (data.parentId === id) return { error: 'Danh mục không thể là danh mục cha của chính nó.' }

  try {
    await prisma.newsCategory.update({ where: { id }, data })
  } catch {
    return { error: 'Không thể cập nhật danh mục. Đường dẫn (slug) có thể đã tồn tại.' }
  }

  revalidatePath('/admin/bai-viet-loai')
  redirect('/admin/bai-viet-loai')
}

export async function deleteBaiVietLoaiAction(id: number) {
  await requireAdmin()
  const soBV = await prisma.newsArticle.count({ where: { categoryId: id } })
  const soCon = await prisma.newsCategory.count({ where: { parentId: id } })
  if (soBV > 0 || soCon > 0) {
    throw new Error('Không thể xóa: danh mục này còn bài viết hoặc danh mục con bên trong.')
  }
  await prisma.newsCategory.delete({ where: { id } })
  revalidatePath('/admin/bai-viet-loai')
}
