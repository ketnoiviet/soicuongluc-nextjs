'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { slugify, stripHtml } from '@/lib/utils'
import { saveProductImage, deleteUploadedFile, extractImageSrcs } from '@/lib/upload'
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
    metaTitle: String(formData.get('metaTitle') || '') || null,
    metaDescription: String(formData.get('metaDescription') || '') || null,
    focusKeyword: String(formData.get('focusKeyword') || '') || null,
  }
}

export async function createSanPhamAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.name) return { error: 'Tên sản phẩm là bắt buộc.' }
  if (!data.categoryId) return { error: 'Vui lòng chọn danh mục sản phẩm.' }
  if (stripHtml(data.shortDescription || '').length > 1000) return { error: 'Mô tả ngắn không được vượt quá 1000 ký tự.' }

  let thumbnailUrl: string | null = null
  let coverImageUrl: string | null = null
  try {
    const img = await saveProductImage(formData.get('productImage') as File | null, data.slug)
    if (img) {
      thumbnailUrl = img.thumbnailUrl
      coverImageUrl = img.coverImageUrl
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  let created
  try {
    created = await prisma.product.create({
      data: { ...data, thumbnailUrl, coverImageUrl },
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
  if (stripHtml(data.shortDescription || '').length > 1000) return { error: 'Mô tả ngắn không được vượt quá 1000 ký tự.' }

  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) return { error: 'Không tìm thấy sản phẩm.' }

  let thumbnailUrl: string | undefined
  let coverImageUrl: string | undefined
  try {
    const img = await saveProductImage(formData.get('productImage') as File | null, data.slug)
    if (img) {
      thumbnailUrl = img.thumbnailUrl
      coverImageUrl = img.coverImageUrl
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }
  }

  const createRedirect = formData.get('createRedirect') === 'on'

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: { ...data, ...(thumbnailUrl ? { thumbnailUrl } : {}), ...(coverImageUrl ? { coverImageUrl } : {}) },
      })
      if (createRedirect && existing.slug && existing.slug !== data.slug) {
        await tx.productRedirect.upsert({
          where: { oldSlug: existing.slug },
          create: { oldSlug: existing.slug, productId: id },
          update: { productId: id },
        })
      }
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

  const product = await prisma.product.findUnique({ where: { id }, include: { images: true } })
  if (!product) return

  await prisma.productImage.deleteMany({ where: { productId: id } })
  await prisma.productDimension.deleteMany({ where: { productId: id } })
  await prisma.productRedirect.deleteMany({ where: { productId: id } })
  await prisma.product.delete({ where: { id } })

  // Dọn toàn bộ file ảnh thuộc sản phẩm: ảnh đại diện (thumbnail/ảnh lớn), ảnh chèn trong các
  // RichTextEditor (mô tả ngắn/chi tiết/thông số/ứng dụng), và thư viện ảnh sản phẩm.
  // Best-effort sau khi đã xoá record chính - lỗi xoá file không được chặn thao tác xoá sản phẩm.
  const urls = new Set<string>()
  ;[product.thumbnailUrl, product.coverImageUrl].forEach((u) => u && urls.add(u))
  product.images.forEach((img) => urls.add(img.imageUrl))
  ;[product.shortDescription, product.descriptionHtml, product.specificationsHtml, product.applicationsHtml].forEach((html) => {
    extractImageSrcs(html).forEach((src) => urls.add(src))
  })
  await Promise.all(Array.from(urls, deleteUploadedFile))

  revalidatePath('/admin/san-pham')
}

// ===== Gallery ảnh phụ =====
// Thêm ảnh gallery (upload hàng loạt, tối đa 30 ảnh/lần) qua app/api/admin/san-pham/[id]/gallery-upload/route.ts
// - dùng route riêng thay vì Server Action để lấy được tiến trình % upload qua XHR ở client.
export async function deleteSanPhamHinhAction(idSP: number, hinhId: number) {
  await requireAdmin()
  const deleted = await prisma.productImage.delete({ where: { id: hinhId } })
  await deleteUploadedFile(deleted.imageUrl)
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

// ===== Chuyển hướng 301 (SEO) =====
export async function deleteProductRedirectAction(idSP: number, redirectId: number) {
  await requireAdmin()
  await prisma.productRedirect.delete({ where: { id: redirectId } })
  revalidatePath(`/admin/san-pham/${idSP}`)
}
