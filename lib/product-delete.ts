import 'server-only'
import { prisma } from '@/lib/prisma'
import { deleteUploadedFile, extractImageSrcs } from '@/lib/upload'

/**
 * Xoá 1 sản phẩm + toàn bộ file ảnh vật lý liên quan (ảnh đại diện, ảnh chèn trong các
 * RichTextEditor, thư viện ảnh phụ). Dùng chung cho xoá đơn lẻ (san-pham/actions.ts),
 * xoá hàng loạt, và xoá theo Nhà sản xuất (khi xoá 1 supplier phải xoá theo mọi sản
 * phẩm của supplier đó) - viết 1 lần duy nhất để 3 chỗ gọi không lệch quy tắc dọn file.
 */
export async function deleteProductWithFiles(id: number): Promise<void> {
  const product = await prisma.product.findUnique({ where: { id }, include: { images: true } })
  if (!product) return

  await prisma.productImage.deleteMany({ where: { productId: id } })
  await prisma.productDimension.deleteMany({ where: { productId: id } })
  await prisma.productRedirect.deleteMany({ where: { productId: id } })
  await prisma.product.delete({ where: { id } })

  const urls = new Set<string>()
  ;[product.thumbnailUrl, product.coverImageUrl].forEach((u) => u && urls.add(u))
  product.images.forEach((img) => urls.add(img.imageUrl))
  ;[product.shortDescription, product.descriptionHtml, product.specificationsHtml, product.applicationsHtml].forEach((html) => {
    extractImageSrcs(html).forEach((src) => urls.add(src))
  })
  await Promise.all(Array.from(urls, deleteUploadedFile))
}
