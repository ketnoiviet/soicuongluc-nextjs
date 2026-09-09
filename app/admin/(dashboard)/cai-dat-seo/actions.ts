'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdminForPath } from '@/lib/auth'
import { deleteUploadedFile, saveSeoLogo, saveFavicon, saveAppleTouchIcon } from '@/lib/upload'
import { writeRobotsTxt } from '@/lib/seo-files'
import { STRUCTURED_DATA_TYPES } from '@/lib/enums'
import type { ActionState } from '@/app/admin/_components/ActionForm'

async function requireAdmin() {
  return requireAdminForPath('/admin/cai-dat-seo')
}

function revalidateSeo() {
  revalidatePath('/admin/cai-dat-seo')
  revalidatePath('/')
}

// Danh sách field text được phép ghi qua saveSeoFieldAction - chặn field lạ dù bound arg của
// Server Action bị can thiệp trực tiếp (bound args gửi qua request không được ký/mã hoá).
const EDITABLE_TEXT_FIELDS = [
  'metaTitle',
  'metaDescription',
  'canonicalUrl',
  'robotsMeta',
  'ogType',
  'ogUrl',
  'ogTitle',
  'ogDescription',
  'ogImage',
  'twitterCard',
  'twitterTitle',
  'twitterDescription',
  'twitterImage',
  'faviconUrl',
  'appleTouchIconUrl',
] as const
export type EditableSeoField = (typeof EDITABLE_TEXT_FIELDS)[number]

export async function saveSeoFieldAction(field: EditableSeoField, value: string): Promise<{ error?: string } | void> {
  await requireAdmin()
  if (!EDITABLE_TEXT_FIELDS.includes(field)) return { error: 'Trường không hợp lệ.' }

  await prisma.seoSetting.upsert({
    where: { id: 1 },
    create: { id: 1, [field]: value },
    update: { [field]: value },
  })
  revalidateSeo()
}

export async function saveSeoLogoAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const file = formData.get('logo') as File | null
  if (!file || file.size === 0) return { error: 'Vui lòng chọn 1 ảnh.' }

  let url: string | null
  try {
    url = await saveSeoLogo(file)
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Không thể tải ảnh lên.' }
  }

  const current = await prisma.seoSetting.findUnique({ where: { id: 1 } })
  await prisma.seoSetting.upsert({
    where: { id: 1 },
    create: { id: 1, logoUrl: url },
    update: { logoUrl: url },
  })
  if (current?.logoUrl) await deleteUploadedFile(current.logoUrl)

  revalidateSeo()
  return { success: 'Đã cập nhật logo.' }
}

export async function saveFaviconFileAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const file = formData.get('favicon') as File | null
  if (!file || file.size === 0) return { error: 'Vui lòng chọn 1 ảnh.' }

  let url: string | null
  try {
    url = await saveFavicon(file)
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Không thể tải ảnh lên.' }
  }
  if (!url) return { error: 'Không thể tải ảnh lên.' }

  const current = await prisma.seoSetting.findUnique({ where: { id: 1 } })
  await prisma.seoSetting.upsert({
    where: { id: 1 },
    create: { id: 1, faviconUrl: url },
    update: { faviconUrl: url },
  })
  if (current?.faviconUrl?.startsWith('/uploads/')) await deleteUploadedFile(current.faviconUrl)

  revalidateSeo()
  return { success: 'Đã cập nhật favicon.' }
}

export async function saveAppleTouchIconFileAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const file = formData.get('appleTouchIcon') as File | null
  if (!file || file.size === 0) return { error: 'Vui lòng chọn 1 ảnh.' }

  let url: string | null
  try {
    url = await saveAppleTouchIcon(file)
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Không thể tải ảnh lên.' }
  }
  if (!url) return { error: 'Không thể tải ảnh lên.' }

  const current = await prisma.seoSetting.findUnique({ where: { id: 1 } })
  await prisma.seoSetting.upsert({
    where: { id: 1 },
    create: { id: 1, appleTouchIconUrl: url },
    update: { appleTouchIconUrl: url },
  })
  if (current?.appleTouchIconUrl?.startsWith('/uploads/')) await deleteUploadedFile(current.appleTouchIconUrl)

  revalidateSeo()
  return { success: 'Đã cập nhật apple-touch-icon.' }
}

export async function saveStructuredDataAction(type: string, json: string): Promise<{ error?: string } | void> {
  await requireAdmin()
  if (!STRUCTURED_DATA_TYPES.includes(type as (typeof STRUCTURED_DATA_TYPES)[number])) {
    return { error: 'Loại dữ liệu không hợp lệ.' }
  }

  if (json.trim()) {
    try {
      JSON.parse(json)
    } catch {
      return { error: 'JSON không hợp lệ. Vui lòng kiểm tra lại cú pháp.' }
    }
  }

  await prisma.seoSetting.upsert({
    where: { id: 1 },
    create: { id: 1, structuredDataType: type, structuredDataJson: json || null },
    update: { structuredDataType: type, structuredDataJson: json || null },
  })
  revalidateSeo()
}

export async function saveRobotsTxtAction(content: string): Promise<{ error?: string } | void> {
  await requireAdmin()
  await writeRobotsTxt(content)
  revalidatePath('/robots.txt')
}
