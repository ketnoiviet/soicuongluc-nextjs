import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { saveEditorImage } from '@/lib/upload'

// Endpoint upload ảnh chèn vào nội dung rich-text (TinyMCE image_upload_handler).
// Xác thực bằng session admin (middleware.ts không chặn /api/*, nên tự kiểm tra ở đây).
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
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
