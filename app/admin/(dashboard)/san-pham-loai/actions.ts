'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { saveUploadedImage } from '@/lib/upload'
import { getSession } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import type { ContentStatus } from '@/lib/enums'

async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

function readForm(formData: FormData) {
  const name = String(formData.get('name') || '').trim()
  let slug = String(formData.get('slug') || '').trim()
  if (!slug) slug = slugify(name)
  else slug = slugify(slug)

  return {
    name,
    slug,
    parentId: formData.get('parentId') ? Number(formData.get('parentId')) : null,
    sortOrder: formData.get('sortOrder') ? Number(formData.get('sortOrder')) : 0,
    status: String(formData.get('status') || 'PUBLISHED') as ContentStatus,
    shortDescription: String(formData.get('shortDescription') || '') || null,
    descriptionHtml: String(formData.get('descriptionHtml') || '') || null,
  }
}

export async function createSanPhamLoaiAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.name) return { error: 'Tên danh mục là bắt buộc.' }

  let imageUrl: string | null = null
  try {
    imageUrl = await saveUploadedImage(formData.get('imageUrl') as File | null, 'san-pham-loai')
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  try {
    await prisma.productCategory.create({ data: { ...data, imageUrl, level: data.parentId ? 2 : 1 } })
  } catch {
    return { error: 'Không thể tạo danh mục. Đường dẫn (slug) có thể đã tồn tại.' }
  }

  revalidatePath('/admin/san-pham-loai')
  redirect('/admin/san-pham-loai')
}

export async function updateSanPhamLoaiAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.name) return { error: 'Tên danh mục là bắt buộc.' }
  if (data.parentId === id) return { error: 'Danh mục không thể là danh mục cha của chính nó.' }

  let imageUrl: string | undefined
  try {
    const uploaded = await saveUploadedImage(formData.get('imageUrl') as File | null, 'san-pham-loai')
    if (uploaded) imageUrl = uploaded
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  try {
    await prisma.productCategory.update({
      where: { id },
      data: { ...data, level: data.parentId ? 2 : 1, ...(imageUrl ? { imageUrl } : {}) },
    })
  } catch {
    return { error: 'Không thể cập nhật danh mục. Đường dẫn (slug) có thể đã tồn tại.' }
  }

  revalidatePath('/admin/san-pham-loai')
  redirect('/admin/san-pham-loai')
}

export async function deleteSanPhamLoaiAction(id: number) {
  await requireAdmin()
  const soSP = await prisma.product.count({ where: { categoryId: id } })
  const soCon = await prisma.productCategory.count({ where: { parentId: id } })
  if (soSP > 0 || soCon > 0) {
    throw new Error('Không thể xóa: danh mục này còn sản phẩm hoặc danh mục con bên trong.')
  }
  await prisma.productCategory.delete({ where: { id } })
  revalidatePath('/admin/san-pham-loai')
}
