import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { checkAdminPathAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { saveGalleryPhoto } from '@/lib/upload'
import { GALLERY_ALBUM_MAX_FILES as MAX_FILES } from '@/lib/constants'

// Upload hàng loạt ảnh cho 1 album (tối đa 30 ảnh/lần), cùng cơ chế với gallery-upload của
// Sản phẩm: route riêng (không phải Server Action) để client theo dõi % tiến trình qua XHR,
// xử lý song song qua Promise.allSettled và trả lỗi riêng cho từng ảnh thay vì fail cả batch.
export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const access = await checkAdminPathAccess('/admin/hinh-anh')
  if (!access.ok) return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: access.reason === 'unauthenticated' ? 401 : 403 })

  const albumId = Number(params.id)
  if (!Number.isFinite(albumId)) return NextResponse.json({ error: 'Album không hợp lệ.' }, { status: 400 })

  const album = await prisma.galleryAlbum.findUnique({ where: { id: albumId }, select: { id: true } })
  if (!album) return NextResponse.json({ error: 'Không tìm thấy album.' }, { status: 404 })

  const formData = await req.formData()
  const files = formData.getAll('anh').filter((f): f is File => f instanceof File && f.size > 0)
  if (files.length === 0) return NextResponse.json({ error: 'Vui lòng chọn ảnh để tải lên.' }, { status: 400 })
  if (files.length > MAX_FILES) return NextResponse.json({ error: `Chỉ được tải tối đa ${MAX_FILES} ảnh mỗi lần.` }, { status: 400 })

  const startCount = await prisma.galleryPhoto.count({ where: { albumId } })
  // 1 timestamp dùng chung cho cả lượt chọn ảnh này - tên file = <timestamp>-<số thứ tự trong lượt>.webp
  const batchTimestamp = Date.now()

  const results = await Promise.allSettled(files.map((file, i) => saveGalleryPhoto(file, batchTimestamp, i + 1)))

  const errors: string[] = []
  const creates: ReturnType<typeof prisma.galleryPhoto.create>[] = []
  results.forEach((result, i) => {
    const file = files[i]
    if (result.status === 'fulfilled' && result.value) {
      const sortOrder = startCount + i + 1
      creates.push(prisma.galleryPhoto.create({ data: { albumId, imageUrl: result.value, sortOrder } }))
    } else if (result.status === 'rejected') {
      errors.push(`${file.name}: ${result.reason instanceof Error ? result.reason.message : 'lỗi không xác định'}`)
    }
  })
  await Promise.all(creates)

  revalidatePath(`/admin/hinh-anh/${albumId}`)
  revalidatePath('/admin/hinh-anh')
  return NextResponse.json({ created: creates.length, errors })
}
