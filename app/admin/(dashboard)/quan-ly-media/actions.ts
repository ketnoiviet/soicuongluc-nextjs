'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminForPath } from '@/lib/auth'
import { deleteUploadedFile } from '@/lib/upload'

async function requireAdmin() {
  return requireAdminForPath('/admin/quan-ly-media')
}

// Xoá 1 hoặc nhiều file vật lý trong public/uploads/ theo URL - dùng chung cho nút xoá đơn lẻ
// và xoá hàng loạt trên trang Quản lý Media. Không đụng tới dữ liệu DB (nếu file đang được
// tham chiếu ở đâu đó, ảnh sẽ vỡ ở nơi đó - admin đã được cảnh báo rõ trước khi xác nhận xoá).
export async function deleteMediaFilesAction(urls: string[]) {
  await requireAdmin()
  for (const url of urls) await deleteUploadedFile(url)
  revalidatePath('/admin/quan-ly-media')
}
