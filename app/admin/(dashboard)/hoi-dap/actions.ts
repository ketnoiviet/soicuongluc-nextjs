'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { deleteUploadedFile, extractImageSrcs } from '@/lib/upload'
import { sanitizeRichText } from '@/lib/sanitize'
import { requireAdminForPath } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'
import type { ContentStatus } from '@/lib/enums'

async function requireAdmin() {
  return requireAdminForPath('/admin/hoi-dap')
}

function readForm(formData: FormData) {
  return {
    question: String(formData.get('question') || '').trim(),
    answerHtml: sanitizeRichText(String(formData.get('answerHtml') || '')) || null,
    sortOrder: formData.get('sortOrder') ? Number(formData.get('sortOrder')) : 0,
    status: String(formData.get('status') || 'PUBLISHED') as ContentStatus,
  }
}

export async function createFaqAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.question) return { error: 'Câu hỏi là bắt buộc.' }

  await prisma.faq.create({ data })

  revalidatePath('/admin/hoi-dap')
  redirect('/admin/hoi-dap')
}

export async function updateFaqAction(id: number, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const data = readForm(formData)
  if (!data.question) return { error: 'Câu hỏi là bắt buộc.' }

  await prisma.faq.update({ where: { id }, data })

  revalidatePath('/admin/hoi-dap')
  redirect('/admin/hoi-dap')
}

export async function deleteFaqAction(id: number) {
  await requireAdmin()
  const deleted = await prisma.faq.delete({ where: { id } })
  for (const src of extractImageSrcs(deleted.answerHtml)) await deleteUploadedFile(src)
  revalidatePath('/admin/hoi-dap')
}
