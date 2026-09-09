import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import type { SeoSetting } from '@prisma/client'

// Giá trị mặc định khi admin CHƯA VÀO /admin/cai-dat-seo điền gì cả - cố ý để chung chung
// (không phải nội dung thật của khách hàng nào) vì đây là code dùng lại cho nhiều dự án. Đảm
// bảo trang chủ không bị "trắng" thẻ SEO hoàn toàn ở lần chạy đầu tiên trước khi cấu hình.
export const SEO_DEFAULTS = {
  metaTitle: 'Trang chủ',
  metaDescription: 'Đang cập nhật - vào /admin/cai-dat-seo để điền thông tin SEO thật cho website.',
  ogTitle: 'Trang chủ',
  ogDescription: 'Đang cập nhật',
  ogUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const

/**
 * Đọc bảng cấu hình SEO (single-row, id = 1). Bọc trong React cache() để generateMetadata()
 * và layout component chỉ tốn 1 lần truy vấn DB cho cùng 1 request (xem app/layout.tsx).
 * Trả về null nếu admin chưa từng lưu gì - nơi gọi tự áp SEO_DEFAULTS.
 */
export const getSeoSettings = cache(async (): Promise<SeoSetting | null> => {
  return prisma.seoSetting.findUnique({ where: { id: 1 } })
})
