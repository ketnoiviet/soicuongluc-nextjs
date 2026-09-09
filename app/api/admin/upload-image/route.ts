import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/auth'
import { saveEditorImage } from '@/lib/upload'

// Endpoint upload ảnh chèn vào nội dung rich-text (TinyMCE image_upload_handler), dùng chung
// cho RichTextEditor ở mọi trang nên không gắn với 1 quyền theo trang cụ thể nào - chỉ cần
// còn là tài khoản admin hợp lệ. Dùng getCurrentAdminUser() (tra DB) thay vì getSession() (chỉ
// giải mã JWT) để tài khoản vừa bị khoá không upload được nữa ngay, không phải đợi JWT hết hạn.
// Middleware.ts không chặn /api/*, nên phải tự kiểm tra ở đây.
export async function POST(req: NextRequest) {
  const user = await getCurrentAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  try {
    const location = await saveEditorImage(file)
    if (!location) {
      return NextResponse.json({ error: 'Vui lòng chọn ảnh để tải lên.' }, { status: 400 })
    }
    return NextResponse.json({ location })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Lỗi khi tải ảnh lên.' }, { status: 400 })
  }
}
