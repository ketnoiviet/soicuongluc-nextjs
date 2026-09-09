import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import type { SeoSetting } from '@prisma/client'

// Giá trị mặc định khi admin chưa cấu hình gì - khớp với metadata tĩnh cũ từng hard-code
// trong app/layout.tsx, đảm bảo trang chủ không bị "trắng" thẻ SEO trước khi ai đó vào
// /admin/cai-dat-seo điền dữ liệu lần đầu.
export const SEO_DEFAULTS = {
  metaTitle: 'Sợi cường lực HARIFA | soicuongluc.com',
  metaDescription:
    'HARIFA - Nhà phân phối chính hãng sợi cường lực: Sợi polyester, sợi nylon, sợi carbon, lốp xe công nghiệp. Uy tín - Chất lượng - Chính hãng.',
  ogTitle: 'Sợi cường lực HARIFA',
  ogDescription: 'Nhà phân phối sợi cường lực chính hãng tại Việt Nam',
  ogUrl: 'https://soicuongluc.com',
} as const

/**
 * Đọc bảng cấu hình SEO (single-row, id = 1). Bọc trong React cache() để generateMetadata()
 * và layout component chỉ tốn 1 lần truy vấn DB cho cùng 1 request (xem app/layout.tsx).
 * Trả về null nếu admin chưa từng lưu gì - nơi gọi tự áp SEO_DEFAULTS.
 */
export const getSeoSettings = cache(async (): Promise<SeoSetting | null> => {
  return prisma.seoSetting.findUnique({ where: { id: 1 } })
})
