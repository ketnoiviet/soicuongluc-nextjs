import 'server-only'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { extractImageSrcs } from '@/lib/upload'

const UPLOADS_ROOT = path.join(process.cwd(), 'public', 'uploads')

export type MediaFile = {
  /** Đường dẫn public dùng làm src ảnh / khoá xoá file, vd "/uploads/imgproducts/x.webp" */
  url: string
  /** Thư mục con chứa file, rỗng nếu nằm ngay gốc uploads/ */
  folder: string
  name: string
  ext: string
  size: number
  mtimeMs: number
}

/** Quét đệ quy toàn bộ public/uploads/ - đây là nơi duy nhất mọi ảnh/video upload qua admin
 * được ghi vào (xem lib/upload.ts), nên liệt kê thư mục này là đủ cho "Quản lý Media". */
export async function scanUploadedFiles(): Promise<MediaFile[]> {
  const results: MediaFile[] = []

  async function walk(dir: string, relFolder: string) {
    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(full, relFolder ? `${relFolder}/${entry.name}` : entry.name)
      } else if (entry.isFile()) {
        const st = await stat(full)
        const relPath = relFolder ? `${relFolder}/${entry.name}` : entry.name
        results.push({
          url: `/uploads/${relPath}`.replace(/\\/g, '/'),
          folder: relFolder,
          name: entry.name,
          ext: path.extname(entry.name).slice(1).toLowerCase(),
          size: st.size,
          mtimeMs: st.mtimeMs,
        })
      }
    }
  }

  await walk(UPLOADS_ROOT, '')
  return results
}

function normalizeUrl(url: string | null | undefined): string | null {
  if (!url) return null
  return url.replace('/uploadwb/', '/uploads/')
}

/** Quét toàn bộ field ảnh/video + nội dung richtext trên MỌI model để biết file nào đang
 * "sống" (đang được tham chiếu) - dùng để đối chiếu với danh sách file vật lý, xác định
 * file nào là rác (upload rồi không dùng, hoặc bản ghi tham chiếu đã bị xoá). Phải cập nhật
 * hàm này mỗi khi thêm field ảnh/video mới ở model khác, nếu không file mới sẽ luôn bị báo
 * nhầm là "chưa sử dụng". */
export async function getUsedFileUrls(): Promise<Set<string>> {
  const used = new Set<string>()
  const add = (url: string | null | undefined) => {
    const n = normalizeUrl(url)
    if (n) used.add(n)
  }
  const addHtml = (html: string | null | undefined) => {
    extractImageSrcs(html).forEach(add)
  }

  const [
    products,
    productImages,
    categories,
    newsCategories,
    newsArticles,
    aboutArticles,
    galleryPhotos,
    videos,
    suppliers,
    banners,
    panels,
    whyChooseUs,
    testimonials,
    partners,
    contentPages,
    faqs,
    seoSetting,
  ] = await Promise.all([
    prisma.product.findMany({
      select: { thumbnailUrl: true, coverImageUrl: true, shortDescription: true, descriptionHtml: true, specificationsHtml: true, applicationsHtml: true },
    }),
    prisma.productImage.findMany({ select: { imageUrl: true } }),
    prisma.productCategory.findMany({ select: { imageUrl: true, descriptionHtml: true } }),
    prisma.newsCategory.findMany({ select: { descriptionHtml: true } }),
    prisma.newsArticle.findMany({ select: { thumbnailUrl: true, coverImageUrl: true, contentHtml: true } }),
    prisma.aboutArticle.findMany({ select: { thumbnailUrl: true, contentHtml: true } }),
    prisma.galleryPhoto.findMany({ select: { imageUrl: true } }),
    prisma.video.findMany({ select: { thumbnailUrl: true, descriptionHtml: true } }),
    prisma.supplier.findMany({ select: { logoUrl: true, descriptionHtml: true } }),
    prisma.bannerSlide.findMany({ select: { imageUrl: true } }),
    prisma.adPanel.findMany({ select: { imageUrl: true } }),
    prisma.whyChooseUsItem.findMany({ select: { iconUrl: true } }),
    prisma.testimonial.findMany({ select: { avatarUrl: true } }),
    prisma.partner.findMany({ select: { logoUrl: true } }),
    prisma.contentPage.findMany({ select: { contentHtml: true } }),
    prisma.faq.findMany({ select: { answerHtml: true } }),
    prisma.seoSetting.findUnique({ where: { id: 1 }, select: { logoUrl: true, faviconUrl: true, appleTouchIconUrl: true } }),
  ])

  products.forEach((p) => {
    add(p.thumbnailUrl)
    add(p.coverImageUrl)
    addHtml(p.shortDescription)
    addHtml(p.descriptionHtml)
    addHtml(p.specificationsHtml)
    addHtml(p.applicationsHtml)
  })
  productImages.forEach((i) => add(i.imageUrl))
  categories.forEach((c) => {
    add(c.imageUrl)
    addHtml(c.descriptionHtml)
  })
  newsCategories.forEach((c) => addHtml(c.descriptionHtml))
  newsArticles.forEach((a) => {
    add(a.thumbnailUrl)
    add(a.coverImageUrl)
    addHtml(a.contentHtml)
  })
  aboutArticles.forEach((a) => {
    add(a.thumbnailUrl)
    addHtml(a.contentHtml)
  })
  galleryPhotos.forEach((p) => add(p.imageUrl))
  videos.forEach((v) => {
    add(v.thumbnailUrl)
    addHtml(v.descriptionHtml)
  })
  suppliers.forEach((s) => {
    add(s.logoUrl)
    addHtml(s.descriptionHtml)
  })
  banners.forEach((b) => add(b.imageUrl))
  panels.forEach((p) => add(p.imageUrl))
  whyChooseUs.forEach((w) => add(w.iconUrl))
  testimonials.forEach((t) => add(t.avatarUrl))
  partners.forEach((p) => add(p.logoUrl))
  contentPages.forEach((p) => addHtml(p.contentHtml))
  faqs.forEach((f) => addHtml(f.answerHtml))
  if (seoSetting) {
    add(seoSetting.logoUrl)
    add(seoSetting.faviconUrl)
    add(seoSetting.appleTouchIconUrl)
  }

  return used
}
