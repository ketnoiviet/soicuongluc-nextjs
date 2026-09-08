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

function num(formData: FormData, key: string): number | null {
  const v = formData.get(key)
  if (v === null || v === '') return null
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}

function readForm(formData: FormData) {
  const name = String(formData.get('name') || '').trim()
  let slug = String(formData.get('slug') || '').trim()
  if (!slug) slug = slugify(name)
  else slug = slugify(slug)

  return {
    name,
    slug,
    categoryId: num(formData, 'categoryId'),
    sku: String(formData.get('sku') || '') || null,
    manufacturer: String(formData.get('manufacturer') || '') || null,
    sortOrder: num(formData, 'sortOrder') ?? 0,
    price: num(formData, 'price'),
    salePrice: num(formData, 'salePrice'),
    unit: String(formData.get('unit') || '') || null,
    shortDescription: String(formData.get('shortDescription') || '') || null,
    descriptionHtml: String(formData.get('descriptionHtml') || '') || null,
    specificationsHtml: String(formData.get('specificationsHtml') || '') || null,
    applicationsHtml: String(formData.get('applicationsHtml') || '') || null,
    status: String(formData.get('status') || 'PUBLISHED') as ContentStatus,
    isFeatured: formData.get('isFeatured') === 'on',
    isNew: formData.get('isNew') === 'on',
    isOnSale: formData.get('isOnSale') === 'on',
  }
}

export async function createSanPhamAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.name) return { error: 'Tên sản phẩm là bắt buộc.' }
  if (!data.categoryId) return { error: 'Vui lòng chọn danh mục sản phẩm.' }

  let thumbnailUrl: string | null = null
  let coverImageUrl: string | null = null
  try {
    thumbnailUrl = await saveUploadedImage(formData.get('thumbnailUrl') as File | null, 'san-pham')
    coverImageUrl = await saveUploadedImage(formData.get('coverImageUrl') as File | null, 'san-pham')
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  let created
  try {
    created = await prisma.product.create({
      data: { ...data, thumbnailUrl, coverImageUrl: coverImageUrl || thumbnailUrl },
    })
  } catch {
    return { error: 'Không thể tạo sản phẩm. Đường dẫn (slug) có thể đã tồn tại.' }
  }

  revalidatePath('/admin/san-pham')
  redirect(`/admin/san-pham/${created.id}`)
}

export async function updateSanPhamAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.name) return { error: 'Tên sản phẩm là bắt buộc.' }
  if (!data.categoryId) return { error: 'Vui lòng chọn danh mục sản phẩm.' }

  let thumbnailUrl: string | undefined
  let coverImageUrl: string | undefined
  try {
    const n = await saveUploadedImage(formData.get('thumbnailUrl') as File | null, 'san-pham')
    const l = await saveUploadedImage(formData.get('coverImageUrl') as File | null, 'san-pham')
    if (n) thumbnailUrl = n
    if (l) coverImageUrl = l
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  try {
    await prisma.product.update({
      where: { id },
      data: { ...data, ...(thumbnailUrl ? { thumbnailUrl } : {}), ...(coverImageUrl ? { coverImageUrl } : {}) },
    })
  } catch {
    return { error: 'Không thể cập nhật sản phẩm. Đường dẫn (slug) có thể đã tồn tại.' }
  }

  revalidatePath('/admin/san-pham')
  revalidatePath(`/admin/san-pham/${id}`)
  redirect(`/admin/san-pham/${id}`)
}

export async function deleteSanPhamAction(id: number) {
  await requireAdmin()
  await prisma.productImage.deleteMany({ where: { productId: id } })
  await prisma.productDimension.deleteMany({ where: { productId: id } })
  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/san-pham')
}

// ===== Gallery ảnh phụ =====
export async function addSanPhamHinhAction(idSP: number, formData: FormData) {
  await requireAdmin()
  const file = formData.get('anh') as File | null
  const imageUrl = await saveUploadedImage(file, 'san-pham-gallery')
  if (!imageUrl) throw new Error('Vui lòng chọn ảnh để tải lên.')
  const count = await prisma.productImage.count({ where: { productId: idSP } })
  await prisma.productImage.create({ data: { productId: idSP, imageUrl, sortOrder: count + 1, altText: file?.name || null } })
  revalidatePath(`/admin/san-pham/${idSP}`)
}

export async function deleteSanPhamHinhAction(idSP: number, hinhId: number) {
  await requireAdmin()
  await prisma.productImage.delete({ where: { id: hinhId } })
  revalidatePath(`/admin/san-pham/${idSP}`)
}

// ===== Kích thước sản phẩm =====
export async function addProductDimensionAction(idSP: number, formData: FormData) {
  await requireAdmin()
  const value = String(formData.get('value') || '').trim()
  if (!value) throw new Error('Vui lòng nhập kích thước.')
  const count = await prisma.productDimension.count({ where: { productId: idSP } })
  await prisma.productDimension.create({ data: { productId: idSP, value, sortOrder: count + 1 } })
  revalidatePath(`/admin/san-pham/${idSP}`)
}

export async function deleteProductDimensionAction(idSP: number, dimensionId: number) {
  await requireAdmin()
  await prisma.productDimension.delete({ where: { id: dimensionId } })
  revalidatePath(`/admin/san-pham/${idSP}`)
}
