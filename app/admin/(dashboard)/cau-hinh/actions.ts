'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'

async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

export async function createCauHinhAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const key = String(formData.get('key') || '').trim()
  const value = String(formData.get('value') || '')
  const description = String(formData.get('description') || '') || null
  if (!key) return { error: 'Khóa cấu hình (key) là bắt buộc.' }

  try {
    await prisma.siteSetting.create({ data: { key, value, description } })
  } catch {
    return { error: 'Khóa cấu hình này đã tồn tại.' }
  }

  revalidatePath('/admin/cau-hinh')
  redirect('/admin/cau-hinh')
}

export async function updateCauHinhAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const value = String(formData.get('value') || '')
  const description = String(formData.get('description') || '') || null

  await prisma.siteSetting.update({ where: { id }, data: { value, description } })

  revalidatePath('/admin/cau-hinh')
  redirect('/admin/cau-hinh')
}

export async function deleteCauHinhAction(id: number) {
  await requireAdmin()
  await prisma.siteSetting.delete({ where: { id } })
  revalidatePath('/admin/cau-hinh')
}
