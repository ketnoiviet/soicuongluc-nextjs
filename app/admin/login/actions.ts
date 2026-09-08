'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { verifyCredentials, createSession } from '@/lib/auth'
import type { ActionState } from '@/app/admin/_components/ActionForm'

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const redirectTo = String(formData.get('redirectTo') || '/admin')

  if (!email || !password) {
    return { error: 'Vui lòng nhập đầy đủ email và mật khẩu.' }
  }

  const user = await verifyCredentials(email, password)
  if (!user) {
    return { error: 'Email hoặc mật khẩu không đúng.' }
  }

  await createSession({ id: user.id, email: user.email, fullName: user.fullName, role: user.role })
  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

  redirect(redirectTo.startsWith('/admin') ? redirectTo : '/admin')
}
