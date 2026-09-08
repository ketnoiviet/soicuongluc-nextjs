import 'server-only'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { slugify } from '@/lib/utils'

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads', 'admin')
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
