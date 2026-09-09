import 'server-only'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

// robots.txt là file tĩnh thật trong public/ (không phải route app/robots.ts động) để mục
// "Cài đặt SEO" > "Robots & Sitemap" có thể mở, sửa nội dung thô và ghi thẳng ra file trên root
// như yêu cầu - xem saveRobotsTxtAction trong app/admin/(dashboard)/cai-dat-seo/actions.ts.
//
// sitemap.xml KHÔNG áp dụng cách này - đã thử và bị chặn lại: nếu vừa có public/sitemap.xml
// vừa có app/sitemap.ts, Next.js không báo lỗi build mà âm thầm ưu tiên file tĩnh, khiến route
// động thành dead code. Vì sitemap cần tự động cập nhật theo sản phẩm/bài viết mới (ưu tiên hơn
// khả năng sửa tay), sitemap.xml vẫn dùng app/sitemap.ts (MetadataRoute.Sitemap) như cũ.
const ROBOTS_PATH = path.join(process.cwd(), 'public', 'robots.txt')

function defaultRobotsTxt(): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: ${baseUrl}/sitemap.xml
`
}

export async function readRobotsTxt(): Promise<string> {
  try {
    return await readFile(ROBOTS_PATH, 'utf-8')
  } catch {
    return defaultRobotsTxt()
  }
}

export async function writeRobotsTxt(content: string): Promise<void> {
  await writeFile(ROBOTS_PATH, content, 'utf-8')
}
