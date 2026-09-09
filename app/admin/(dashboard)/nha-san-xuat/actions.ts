'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { saveSupplierLogo, deleteUploadedFile, extractImageSrcs } from '@/lib/upload'
import { deleteProductWithFiles } from '@/lib/product-delete'
import { sanitizeRichText } from '@/lib/sanitize'
import { requireAdminForPath } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'

async function requireAdmin() {
  return requireAdminForPath('/admin/nha-san-xuat')
}

function readForm(formData: FormData) {
  return {
    name: String(formData.get('name') || '').trim(),
    website: String(formData.get('website') || '').trim() || null,
    descriptionHtml: sanitizeRichText(String(formData.get('descriptionHtml') || '')) || null,
  }
}

export async function createNhaSanXuatAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.name) return { error: 'Tên nhà sản xuất là bắt buộc.' }

  let logoUrl: string | null = null
  try {
    logoUrl = await saveSupplierLogo(formData.get('logoUrl') as File | null)
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải logo lên.' }
  }

  await prisma.supplier.create({ data: { ...data, logoUrl } })

  revalidatePath('/admin/nha-san-xuat')
  redirect('/admin/nha-san-xuat')
}

export async function updateNhaSanXuatAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.name) return { error: 'Tên nhà sản xuất là bắt buộc.' }

  let logoUrl: string | undefined
  try {
    const uploaded = await saveSupplierLogo(formData.get('logoUrl') as File | null)
    if (uploaded) logoUrl = uploaded
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải logo lên.' }
  }

  await prisma.supplier.update({ where: { id }, data: { ...data, ...(logoUrl ? { logoUrl } : {}) } })

  revalidatePath('/admin/nha-san-xuat')
  redirect('/admin/nha-san-xuat')
}

// Xoá nhà sản xuất kéo theo xoá TOÀN BỘ sản phẩm của nhà sản xuất đó (yêu cầu nghiệp vụ,
// không phải để categoryId/supplierId mồ côi) - dùng chung rule dọn file ảnh vật lý với
// xoá sản phẩm đơn lẻ (lib/product-delete.ts) cho từng sản phẩm trước khi xoá supplier.
export async function deleteNhaSanXuatAction(id: number) {
  await requireAdmin()
  const supplier = await prisma.supplier.findUnique({ where: { id }, select: { logoUrl: true, descriptionHtml: true } })
  if (!supplier) return

  const productIds = await prisma.product.findMany({ where: { supplierId: id }, select: { id: true } })
  for (const { id: productId } of productIds) await deleteProductWithFiles(productId)

  await prisma.supplier.delete({ where: { id } })
  await deleteUploadedFile(supplier.logoUrl)
  for (const src of extractImageSrcs(supplier.descriptionHtml)) await deleteUploadedFile(src)

  revalidatePath('/admin/nha-san-xuat')
  revalidatePath('/admin/san-pham')
}
