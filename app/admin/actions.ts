'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { destroySession } from '@/lib/auth'

export async function logoutAction() {
  await destroySession()
  // Xem ghi chú trong app/admin/login/actions.ts - tránh Router Cache phía client giữ
  // lại dữ liệu (vai trò/quyền truy cập) của phiên vừa đăng xuất.
  revalidatePath('/', 'layout')
  redirect('/admin/login')
}
