// Tên miền thật của site, dùng để build metadataBase/sitemap/robots (xem app/layout.tsx,
// app/sitemap.ts, lib/seo-files.ts) và để khai báo hostname cho next/image bên dưới. Next.js tự
// nạp .env trước khi chạy file này nên process.env đọc được ngay ở đây.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const SITE_HOSTNAME = new URL(SITE_URL).hostname

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: SITE_HOSTNAME },
    ],
    // Cho phép ảnh từ thư mục uploads local
    unoptimized: false,
  },
  // Redirect URL cũ sang URL mới - dùng khi migrate từ 1 website cũ (vd ASP.NET WebForms) sang
  // Next.js, để giữ SEO/backlink của các URL cũ đã được Google index. Mảng này CỐ Ý để trống
  // trong bản gốc (dùng chung nhiều dự án) - thêm redirect riêng cho từng dự án migrate, theo
  // mẫu: { source: '/url-cu.htm', destination: '/url-moi', permanent: true }.
  async redirects() {
    return []
  },
  // Rewrite thư mục ảnh cũ sang thư mục mới - dùng khi migrate và cần giữ nguyên đường dẫn ảnh
  // cũ đã nhúng sẵn trong nội dung/DB cũ mà không muốn sửa lại từng URL. Theo mẫu:
  // { source: '/thu-muc-anh-cu/:path*', destination: '/uploads/:path*' }.
  async rewrites() {
    return []
  },
  // Security header cơ bản áp cho mọi route - lớp phòng thủ-theo-chiều-sâu, không thay thế
  // việc vá lỗi ở tầng ứng dụng (vd sanitize richtext) nhưng giảm tác động nếu có sót lọt.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
