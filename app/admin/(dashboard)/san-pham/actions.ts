'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { slugify, stripHtml } from '@/lib/utils'
import { saveProductImage, deleteUploadedFile } from '@/lib/upload'
import { deleteProductWithFiles } from '@/lib/product-delete'
import { sanitizeRichText } from '@/lib/sanitize'
import { requireAdminForPath } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import { CONTENT_STATUS_LABELS, type ContentStatus } from '@/lib/enums'

async function requireAdmin() {
  return requireAdminForPath('/admin/san-pham')
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
    supplierId: num(formData, 'supplierId'),
    sortOrder: num(formData, 'sortOrder') ?? 0,
    price: num(formData, 'price'),
    salePrice: num(formData, 'salePrice'),
    unit: String(formData.get('unit') || '') || null,
    shortDescription: sanitizeRichText(String(formData.get('shortDescription') || '')) || null,
    descriptionHtml: sanitizeRichText(String(formData.get('descriptionHtml') || '')) || null,
    specificationsHtml: sanitizeRichText(String(formData.get('specificationsHtml') || '')) || null,
    applicationsHtml: sanitizeRichText(String(formData.get('applicationsHtml') || '')) || null,
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
  await deleteProductWithFiles(id)
  revalidatePath('/admin/san-pham')
}

// Xoá hàng loạt (chọn checkbox trên danh sách) - cùng rule dọn file vật lý như xoá đơn lẻ,
// chạy tuần tự (không Promise.all) để tránh nhiều tiến trình sharp xử lý ảnh cùng lúc khi
// admin chọn xoá số lượng lớn.
export async function bulkDeleteSanPhamAction(ids: number[]) {
  await requireAdmin()
  for (const id of ids) await deleteProductWithFiles(id)
  revalidatePath('/admin/san-pham')
}

// ===== Nhập Excel (xem lib/product-excel.ts cho thứ tự cột dùng chung với route export) =====
export async function importSanPhamExcelAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { error: 'Vui lòng chọn file Excel (.xlsx) để nhập.' }

  const ExcelJS = (await import('exceljs')).default
  const workbook = new ExcelJS.Workbook()
  try {
    await workbook.xlsx.load(await file.arrayBuffer())
  } catch {
    return { error: 'File không đúng định dạng Excel (.xlsx).' }
  }

  const sheet = workbook.worksheets[0]
  if (!sheet) return { error: 'File Excel không có dữ liệu.' }

  const categories = await prisma.productCategory.findMany({ select: { id: true, name: true } })
  const categoryByName = new Map(categories.map((c) => [c.name.trim().toLowerCase(), c.id]))
  const statusByLabel = new Map(
    Object.entries(CONTENT_STATUS_LABELS).map(([status, label]) => [label.trim().toLowerCase(), status as ContentStatus])
  )

  let created = 0
  let updated = 0
  const errors: string[] = []

  // Dòng 1 là header (theo đúng thứ tự PRODUCT_EXCEL_COLUMNS ở trên) - bắt đầu đọc từ dòng 2.
  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
    const row = sheet.getRow(rowNumber)
    if (row.cellCount === 0 || !row.getCell(1).value) continue

    const name = String(row.getCell(1).value || '').trim()
    const sku = String(row.getCell(2).value || '').trim() || null
    const price = row.getCell(3).value ? Number(row.getCell(3).value) : null
    const unit = String(row.getCell(4).value || '').trim() || null
    const salePrice = row.getCell(5).value ? Number(row.getCell(5).value) : null
    const categoryName = String(row.getCell(6).value || '').trim()
    const statusLabel = String(row.getCell(7).value || '').trim()

    if (!name) {
      errors.push(`Dòng ${rowNumber}: thiếu tên sản phẩm.`)
      continue
    }

    const categoryId = categoryName ? categoryByName.get(categoryName.toLowerCase()) : undefined
    if (categoryName && !categoryId) {
      errors.push(`Dòng ${rowNumber}: không tìm thấy danh mục "${categoryName}".`)
      continue
    }

    const status = statusLabel ? statusByLabel.get(statusLabel.toLowerCase()) : undefined
    if (statusLabel && !status) {
      errors.push(`Dòng ${rowNumber}: không nhận dạng được tình trạng "${statusLabel}".`)
      continue
    }

    const data = {
      name,
      price: price ?? null,
      unit,
      salePrice: salePrice ?? null,
      ...(categoryId ? { categoryId } : {}),
      ...(status ? { status } : {}),
    }

    try {
      const existing = sku ? await prisma.product.findUnique({ where: { sku } }) : null
      if (existing) {
        await prisma.product.update({ where: { id: existing.id }, data })
        updated++
      } else {
        if (!categoryId) {
          errors.push(`Dòng ${rowNumber}: sản phẩm mới bắt buộc phải có Danh mục hợp lệ.`)
          continue
        }
        await prisma.product.create({ data: { ...data, sku, slug: slugify(name) + '-' + Date.now(), categoryId } })
        created++
      }
    } catch (e) {
      errors.push(`Dòng ${rowNumber}: ${e instanceof Error ? e.message : 'lỗi không xác định'}`)
    }
  }

  revalidatePath('/admin/san-pham')

  if (created === 0 && updated === 0 && errors.length > 0) {
    return { error: `Không nhập được dòng nào. ${errors.join(' ')}` }
  }
  return {
    success: `Đã tạo mới ${created}, cập nhật ${updated} sản phẩm.${errors.length > 0 ? ` ${errors.length} dòng lỗi: ${errors.join(' ')}` : ''}`,
  }
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
