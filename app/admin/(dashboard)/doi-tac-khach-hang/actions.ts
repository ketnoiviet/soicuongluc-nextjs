'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { savePartnerLogo, deleteUploadedFile } from '@/lib/upload'
import { requireAdminForPath } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import type { ContentStatus } from '@/lib/enums'

async function requireAdmin() {
  return requireAdminForPath('/admin/doi-tac-khach-hang')
}

function readForm(formData: FormData) {
  return {
    name: String(formData.get('name') || '').trim(),
    website: String(formData.get('website') || '').trim() || null,
    sortOrder: formData.get('sortOrder') ? Number(formData.get('sortOrder')) : 0,
    status: String(formData.get('status') || 'PUBLISHED') as ContentStatus,
  }
}

export async function createDoiTacAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.name) return { error: 'Tên đối tác/khách hàng là bắt buộc.' }

  let logoUrl: string | null = null
  try {
    logoUrl = await savePartnerLogo(formData.get('logoUrl') as File | null)
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải logo lên.' }
  }

  await prisma.partner.create({ data: { ...data, logoUrl } })

  revalidatePath('/admin/doi-tac-khach-hang')
  redirect('/admin/doi-tac-khach-hang')
}

export async function updateDoiTacAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.name) return { error: 'Tên đối tác/khách hàng là bắt buộc.' }

  let logoUrl: string | undefined
  try {
    const uploaded = await savePartnerLogo(formData.get('logoUrl') as File | null)
    if (uploaded) logoUrl = uploaded
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Lỗi khi tải logo lên.' }
  }

  await prisma.partner.update({ where: { id }, data: { ...data, ...(logoUrl ? { logoUrl } : {}) } })

  revalidatePath('/admin/doi-tac-khach-hang')
  redirect('/admin/doi-tac-khach-hang')
}

export async function deleteDoiTacAction(id: number) {
  await requireAdmin()
  const deleted = await prisma.partner.delete({ where: { id } })
  await deleteUploadedFile(deleted.logoUrl)
  revalidatePath('/admin/doi-tac-khach-hang')
}
