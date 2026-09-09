import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { checkAdminPathAccess } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { saveProductGalleryImage } from '@/lib/upload'
import { PRODUCT_GALLERY_MAX_FILES as MAX_FILES } from '@/lib/constants'

// Upload hàng loạt ảnh cho "Thư viện ảnh sản phẩm" (tối đa 30 ảnh/lần, tự resize + chuyển WebP
// qua saveProductGalleryImage, lưu phẳng vào uploads/imgproducts theo tên slug sản phẩm).
// Dùng route riêng (không phải Server Action) để client theo dõi được % tiến trình upload qua XHR.
export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const access = await checkAdminPathAccess('/admin/san-pham')
  if (!access.ok) return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: access.reason === 'unauthenticated' ? 401 : 403 })

  const productId = Number(params.id)
  if (!Number.isFinite(productId)) return NextResponse.json({ error: 'Sản phẩm không hợp lệ.' }, { status: 400 })

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { slug: true } })
  if (!product) return NextResponse.json({ error: 'Không tìm thấy sản phẩm.' }, { status: 404 })

  const formData = await req.formData()
  const files = formData.getAll('anh').filter((f): f is File => f instanceof File && f.size > 0)
  if (files.length === 0) return NextResponse.json({ error: 'Vui lòng chọn ảnh để tải lên.' }, { status: 400 })
  if (files.length > MAX_FILES) return NextResponse.json({ error: `Chỉ được tải tối đa ${MAX_FILES} ảnh mỗi lần.` }, { status: 400 })

  // Số thứ tự (sortOrder/tên file) của từng ảnh được tính trước, đồng bộ - nhờ đó có thể xử lý
  // resize/WebP của tất cả ảnh song song (Promise.allSettled) thay vì lần lượt từng ảnh một,
  // mà vẫn đảm bảo thứ tự/tên file không phụ thuộc vào ảnh nào xử lý xong trước.
  const startCount = await prisma.productImage.count({ where: { productId } })

  const results = await Promise.allSettled(
    files.map((file, i) => saveProductGalleryImage(file, product.slug, startCount + i + 1))
  )

  const errors: string[] = []
  const creates: ReturnType<typeof prisma.productImage.create>[] = []
  results.forEach((result, i) => {
    const file = files[i]
    if (result.status === 'fulfilled' && result.value) {
      const sortOrder = startCount + i + 1
      creates.push(prisma.productImage.create({ data: { productId, imageUrl: result.value, sortOrder, altText: file.name || null } }))
    } else if (result.status === 'rejected') {
      errors.push(`${file.name}: ${result.reason instanceof Error ? result.reason.message : 'lỗi không xác định'}`)
    }
  })
  await Promise.all(creates)

  revalidatePath(`/admin/san-pham/${productId}`)
  return NextResponse.json({ created: creates.length, errors })
}
