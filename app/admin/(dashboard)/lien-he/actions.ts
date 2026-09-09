'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdminForPath } from '@/lib/auth'
import type { ContactStatus } from '@/lib/enums'

async function requireAdmin() {
  return requireAdminForPath('/admin/lien-he')
}

export async function setLienHeStatusAction(id: number, status: ContactStatus) {
  await requireAdmin()
  await prisma.contactSubmission.update({ where: { id }, data: { status } })
  revalidatePath('/admin/lien-he')
  revalidatePath(`/admin/lien-he/${id}`)
}

export async function deleteLienHeAction(id: number) {
  await requireAdmin()
  await prisma.contactSubmission.delete({ where: { id } })
  revalidatePath('/admin/lien-he')
}
