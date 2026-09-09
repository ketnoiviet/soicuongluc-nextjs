import 'server-only'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { slugify } from '@/lib/utils'

const PUBLIC_ROOT = path.join(process.cwd(), 'public')
const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads', 'admin')
const PRODUCT_IMG_ROOT = path.join(process.cwd(), 'public', 'uploads', 'imgproducts')
const GALLERY_ROOT = path.join(process.cwd(), 'public', 'uploads', 'gallery')
const VIDEO_IMG_ROOT = path.join(process.cwd(), 'public', 'uploads', 'video-imgs')
const SUPPLIER_ROOT = path.join(process.cwd(), 'public', 'uploads', 'supplier')
const CUSTOMERS_ROOT = path.join(process.cwd(), 'public', 'uploads', 'customers')
const SEO_ROOT = path.join(process.cwd(), 'public', 'uploads', 'seo')
const MAX_WIDTH = 1600
const MAX_SIZE = 8 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function validateImage(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP, GIF.')
  }
  if (file.size > MAX_SIZE) {
    throw new Error('Ảnh quá lớn (tối đa 8MB).')
  }
}

// Favicon chấp nhận thêm .ico so với ảnh thường (sharp không đọc được .ico nên phải giữ nguyên
// file gốc cho loại đó). CỐ Ý KHÔNG nhận .svg: SVG có thể chứa <script>/onload... và bị coi là
// ảnh nên dễ lọt qua các bước kiểm tra khác - chấp nhận SVG ở đây từng là 1 lỗ hổng XSS thật sự.
const ICON_EXTRA_TYPES = ['image/x-icon', 'image/vnd.microsoft.icon']
const MAX_ICON_SIZE = 2 * 1024 * 1024

function validateIcon(file: File) {
  if (![...ALLOWED_TYPES, ...ICON_EXTRA_TYPES].includes(file.type)) {
    throw new Error('Định dạng không hợp lệ. Chỉ chấp nhận PNG, ICO, JPG, WEBP, GIF.')
  }
  if (file.size > MAX_ICON_SIZE) {
    throw new Error('File quá lớn (tối đa 2MB).')
  }
}

// Tên file duy nhất, an toàn (đã slugify) - random suffix để tránh trùng khi 2 upload xảy ra cùng mili-giây
function uniqueFileName(file: File, ext: string) {
  const baseName = slugify(file.name.replace(/\.[^/.]+$/, '')).slice(0, 60) || 'anh'
  const random = Math.random().toString(36).slice(2, 8)
  return `${baseName}-${Date.now()}-${random}.${ext}`
}

/**
 * Lưu 1 file ảnh upload từ FormData vào public/uploads/admin/<folder>/, giữ nguyên định dạng gốc.
 * Trả về đường dẫn public (vd: /uploads/admin/san-pham/ten-anh-16999999-ab12cd.jpg) hoặc null nếu không có file.
 */
export async function saveUploadedImage(file: File | null, folder: string): Promise<string | null> {
  if (!file || file.size === 0) return null
  validateImage(file)

  const targetDir = path.join(UPLOAD_ROOT, folder)
  await mkdir(targetDir, { recursive: true })

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : file.type === 'image/gif' ? 'gif' : 'jpg'
  const fileName = uniqueFileName(file, ext)
  const filePath = path.join(targetDir, fileName)
  const buffer = Buffer.from(await file.arrayBuffer())

  if (ext === 'gif') {
    // sharp không resize được gif động tốt, giữ nguyên file gốc
    await writeFile(filePath, buffer)
    return `/uploads/admin/${folder}/${fileName}`
  }

  try {
    const img = sharp(buffer).rotate()
    const meta = await img.metadata()
    const pipeline = meta.width && meta.width > MAX_WIDTH ? img.resize({ width: MAX_WIDTH }) : img
    if (ext === 'png') await pipeline.png({ quality: 85 }).toFile(filePath)
    else if (ext === 'webp') await pipeline.webp({ quality: 85 }).toFile(filePath)
    else await pipeline.jpeg({ quality: 85 }).toFile(filePath)
  } catch {
    // Không ghi buffer gốc ra đĩa khi sharp không đọc được - tránh lưu file không phải ảnh thật dưới đuôi ảnh.
    throw new Error('Không thể xử lý ảnh. Vui lòng thử ảnh khác.')
  }

  return `/uploads/admin/${folder}/${fileName}`
}

/**
 * Lưu ảnh chèn trong nội dung rich-text (TinyMCE) - luôn chuyển đổi sang WebP để tối ưu dung lượng,
 * bất kể định dạng gốc là gì.
 */
export async function saveEditorImage(file: File | null, folder = 'editor'): Promise<string | null> {
  if (!file || file.size === 0) return null
  validateImage(file)

  const targetDir = path.join(UPLOAD_ROOT, folder)
  await mkdir(targetDir, { recursive: true })

  const fileName = uniqueFileName(file, 'webp')
  const filePath = path.join(targetDir, fileName)
  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const img = sharp(buffer, { animated: file.type === 'image/gif' }).rotate()
    const meta = await img.metadata()
    const pipeline = meta.width && meta.width > MAX_WIDTH ? img.resize({ width: MAX_WIDTH }) : img
    await pipeline.webp({ quality: 85 }).toFile(filePath)
  } catch {
    throw new Error('Không thể xử lý ảnh. Vui lòng thử ảnh khác.')
  }

  return `/uploads/admin/${folder}/${fileName}`
}

// Các thành phần ngày/giờ hiện tại (đã pad 2 chữ số) dùng chung cho các hàm sinh tên file ảnh
// sản phẩm bên dưới - mỗi hàm tự ghép theo đúng thứ tự được yêu cầu riêng, tránh lặp logic pad.
function dateTimeParts(d = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    ss: pad(d.getSeconds()),
    mm: pad(d.getMinutes()),
    HH: pad(d.getHours()),
    dd: pad(d.getDate()),
    MM: pad(d.getMonth() + 1),
    yyyy: String(d.getFullYear()),
  }
}

// dd-mm-yyyy-HHmm theo đúng tinh thần "slug + loại + ngày" nhưng có thêm giờ:phút để mỗi lần
// re-upload trong cùng ngày ra tên file/URL mới - tránh ghi đè khiến cache trình duyệt/CDN còn
// giữ ảnh cũ dưới URL cũ.
function ddmmyyyyHHmm() {
  const { dd, MM, yyyy, HH, mm } = dateTimeParts()
  return `${dd}-${MM}-${yyyy}-${HH}${mm}`
}

/**
 * Lưu 1 ảnh sản phẩm (upload duy nhất ở Form) thành 2 bản WebP: thumbnail (tối đa 640px)
 * và ảnh lớn/chi tiết (tối đa 1000px), tên file theo slug sản phẩm + loại + ngày.
 * Ghi vào public/uploads/imgproducts/ - không đụng tới các ảnh cũ ở uploads/admin hay uploadwb.
 */
export async function saveProductImage(
  file: File | null,
  slug: string
): Promise<{ thumbnailUrl: string; coverImageUrl: string } | null> {
  if (!file || file.size === 0) return null
  validateImage(file)

  await mkdir(PRODUCT_IMG_ROOT, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  const base = slugify(slug) || 'san-pham'
  const dateStr = ddmmyyyyHHmm()
  const thumbName = `${base}-thumbnail-${dateStr}.webp`
  const largeName = `${base}-large-${dateStr}.webp`

  try {
    await sharp(buffer).rotate().resize({ width: 640, withoutEnlargement: true }).webp({ quality: 85 }).toFile(path.join(PRODUCT_IMG_ROOT, thumbName))
    await sharp(buffer).rotate().resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 85 }).toFile(path.join(PRODUCT_IMG_ROOT, largeName))
  } catch {
    throw new Error('Không thể xử lý ảnh. Vui lòng thử ảnh khác.')
  }

  return {
    thumbnailUrl: `/uploads/imgproducts/${thumbName}`,
    coverImageUrl: `/uploads/imgproducts/${largeName}`,
  }
}

// "giây-phút-giờ-ngày-tháng-năm" hiện tại - dùng cho tên ảnh Thư viện ảnh sản phẩm, đủ độ chi tiết
// (tới giây) để nhiều ảnh chọn tải lên cùng lúc không trùng giây; số thứ tự ảnh ở cuối tên file
// xử lý nốt trường hợp trùng giây trong cùng 1 lần chọn nhiều ảnh.
function giayPhutGioNgayThangNam() {
  const { ss, mm, HH, dd, MM, yyyy } = dateTimeParts()
  return `${ss}-${mm}-${HH}-${dd}-${MM}-${yyyy}`
}

/**
 * Lưu 1 ảnh cho "Thư viện ảnh sản phẩm": resize tối đa 1000px (giữ nguyên nếu ảnh gốc đã nhỏ hơn),
 * luôn chuyển WebP, ghi phẳng vào public/uploads/imgproducts/ (không tạo thư mục con).
 * Tên file: <slug>-<giây-phút-giờ-ngày-tháng-năm>-<số thứ tự ảnh>.webp
 */
export async function saveProductGalleryImage(file: File | null, slug: string, index: number): Promise<string | null> {
  if (!file || file.size === 0) return null
  validateImage(file)

  await mkdir(PRODUCT_IMG_ROOT, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  const base = slugify(slug) || 'san-pham'
  const fileName = `${base}-${giayPhutGioNgayThangNam()}-${index}.webp`

  try {
    await sharp(buffer, { animated: file.type === 'image/gif' })
      .rotate()
      .resize({ width: 1000, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(PRODUCT_IMG_ROOT, fileName))
  } catch {
    throw new Error('Không thể xử lý ảnh. Vui lòng thử ảnh khác.')
  }

  return `/uploads/imgproducts/${fileName}`
}

/**
 * Lưu 1 ảnh cho "Album ảnh" (mục Hình ảnh): cùng rule resize/định dạng như
 * saveProductGalleryImage (tối đa 1000px, luôn WebP) nhưng ghi phẳng vào
 * public/uploads/gallery/ và đặt tên theo <timestamp của cả lượt upload>-<số thứ tự ảnh>.webp
 * (timestamp dùng chung cho cả batch, truyền vào từ route để nhiều ảnh cùng 1 lần chọn
 * đứng cạnh nhau khi sắp theo tên file, thay vì mỗi ảnh 1 mốc thời gian riêng lẻ).
 */
export async function saveGalleryPhoto(file: File | null, batchTimestamp: number, index: number): Promise<string | null> {
  if (!file || file.size === 0) return null
  validateImage(file)

  await mkdir(GALLERY_ROOT, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = `${batchTimestamp}-${index}.webp`

  try {
    await sharp(buffer, { animated: file.type === 'image/gif' })
      .rotate()
      .resize({ width: 1000, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(GALLERY_ROOT, fileName))
  } catch {
    throw new Error('Không thể xử lý ảnh. Vui lòng thử ảnh khác.')
  }

  return `/uploads/gallery/${fileName}`
}

/**
 * Lưu ảnh đại diện Video: luôn WebP, tối đa 1000px, ghi vào public/uploads/video-imgs/.
 */
export async function saveVideoThumbnail(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null
  validateImage(file)

  await mkdir(VIDEO_IMG_ROOT, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = uniqueFileName(file, 'webp')

  try {
    const img = sharp(buffer, { animated: file.type === 'image/gif' }).rotate()
    const meta = await img.metadata()
    const pipeline = meta.width && meta.width > 1000 ? img.resize({ width: 1000 }) : img
    await pipeline.webp({ quality: 85 }).toFile(path.join(VIDEO_IMG_ROOT, fileName))
  } catch {
    throw new Error('Không thể xử lý ảnh. Vui lòng thử ảnh khác.')
  }

  return `/uploads/video-imgs/${fileName}`
}

/**
 * Lưu logo Nhà sản xuất: luôn WebP, rộng tối đa 500px, ghi vào public/uploads/supplier/.
 */
export async function saveSupplierLogo(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null
  validateImage(file)

  await mkdir(SUPPLIER_ROOT, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = uniqueFileName(file, 'webp')

  try {
    const img = sharp(buffer, { animated: file.type === 'image/gif' }).rotate()
    const meta = await img.metadata()
    const pipeline = meta.width && meta.width > 500 ? img.resize({ width: 500 }) : img
    await pipeline.webp({ quality: 85 }).toFile(path.join(SUPPLIER_ROOT, fileName))
  } catch {
    throw new Error('Không thể xử lý ảnh. Vui lòng thử ảnh khác.')
  }

  return `/uploads/supplier/${fileName}`
}

/**
 * Lưu logo Đối tác & khách hàng: cùng rule với logo Nhà sản xuất (luôn WebP, rộng tối đa
 * 500px), ghi vào public/uploads/customers/ theo đúng yêu cầu.
 */
export async function savePartnerLogo(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null
  validateImage(file)

  await mkdir(CUSTOMERS_ROOT, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = uniqueFileName(file, 'webp')

  try {
    const img = sharp(buffer, { animated: file.type === 'image/gif' }).rotate()
    const meta = await img.metadata()
    const pipeline = meta.width && meta.width > 500 ? img.resize({ width: 500 }) : img
    await pipeline.webp({ quality: 85 }).toFile(path.join(CUSTOMERS_ROOT, fileName))
  } catch {
    throw new Error('Không thể xử lý ảnh. Vui lòng thử ảnh khác.')
  }

  return `/uploads/customers/${fileName}`
}

/**
 * Lưu logo website (Cài đặt SEO, dùng ở header trang chủ): cùng rule logo chuẩn của dự án
 * (luôn WebP, rộng tối đa 500px), ghi vào public/uploads/seo/.
 */
export async function saveSeoLogo(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null
  validateImage(file)

  await mkdir(SEO_ROOT, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = uniqueFileName(file, 'webp')

  try {
    const img = sharp(buffer, { animated: file.type === 'image/gif' }).rotate()
    const meta = await img.metadata()
    const pipeline = meta.width && meta.width > 500 ? img.resize({ width: 500 }) : img
    await pipeline.webp({ quality: 85 }).toFile(path.join(SEO_ROOT, fileName))
  } catch {
    throw new Error('Không thể xử lý ảnh. Vui lòng thử ảnh khác.')
  }

  return `/uploads/seo/${fileName}`
}

/**
 * Lưu favicon: .ico/.svg giữ nguyên file gốc (sharp không đọc được, và 2 định dạng này vốn đã
 * đúng kích thước/là vector); các định dạng ảnh thường được resize về 64x64 và ép PNG.
 */
export async function saveFavicon(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null
  validateIcon(file)

  await mkdir(SEO_ROOT, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())

  if (ICON_EXTRA_TYPES.includes(file.type)) {
    const fileName = uniqueFileName(file, 'ico')
    await writeFile(path.join(SEO_ROOT, fileName), buffer)
    return `/uploads/seo/${fileName}`
  }

  const fileName = uniqueFileName(file, 'png')
  try {
    await sharp(buffer)
      .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(SEO_ROOT, fileName))
  } catch {
    throw new Error('Không thể xử lý ảnh. Vui lòng thử ảnh khác.')
  }

  return `/uploads/seo/${fileName}`
}

/**
 * Lưu apple-touch-icon: luôn resize về 180x180 (kích thước Apple khuyến nghị) và ép PNG bất kể
 * định dạng gốc - rel="apple-touch-icon" yêu cầu ảnh raster vuông, không nhận .ico/.svg.
 */
export async function saveAppleTouchIcon(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null
  validateImage(file)

  await mkdir(SEO_ROOT, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = uniqueFileName(file, 'png')

  try {
    await sharp(buffer)
      .rotate()
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(SEO_ROOT, fileName))
  } catch {
    throw new Error('Không thể xử lý ảnh. Vui lòng thử ảnh khác.')
  }

  return `/uploads/seo/${fileName}`
}

/**
 * Xoá 1 file ảnh đã upload dựa theo URL public lưu trong DB (vd. "/uploads/imgproducts/...").
 * Chuẩn hoá path "/uploadwb/" cũ giống getImageUrl() ở lib/utils.ts trước khi map ra đường dẫn
 * thật trên đĩa, và chỉ xoá file nằm trong thư mục uploads/ - không đụng tới asset tĩnh khác
 * (vd. /images/no-image.jpg) hay đi ra ngoài thư mục public/ qua path traversal.
 * Best-effort: không throw khi file không tồn tại hoặc xoá lỗi - không được chặn thao tác xoá dữ liệu chính.
 */
export async function deleteUploadedFile(url: string | null | undefined): Promise<void> {
  if (!url) return
  const normalized = url.replace('/uploadwb/', '/uploads/')
  if (!normalized.startsWith('/uploads/')) return

  const filePath = path.join(PUBLIC_ROOT, normalized)
  if (!filePath.startsWith(PUBLIC_ROOT)) return

  try {
    await unlink(filePath)
  } catch {
    // File đã không còn tồn tại hoặc không xoá được - bỏ qua.
  }
}

/**
 * Trích danh sách URL ảnh (<img src="...">) chèn trong nội dung rich-text (TinyMCE) - dùng để dọn
 * file khi xoá record chứa nội dung đó (vd. xoá sản phẩm thì dọn luôn ảnh chèn trong mô tả).
 */
export function extractImageSrcs(html: string | null | undefined): string[] {
  if (!html) return []
  return Array.from(html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi), (m) => m[1])
}
