/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'soicuongluc.com' },
    ],
    // Cho phép ảnh từ thư mục uploads local
    unoptimized: false,
  },
  // Redirect URL cũ (ASP.NET WebForms) sang URL mới (Next.js)
  async redirects() {
    return [
      { source: '/soi-polyester-cuong-luc-1.htm', destination: '/san-pham/soi-polyester-cuong-luc', permanent: true },
      { source: '/soi-nylon-cuong-luc-2.htm', destination: '/san-pham/soi-nylon-cuong-luc', permanent: true },
      { source: '/soi-carbon-3.htm', destination: '/san-pham/soi-carbon', permanent: true },
      { source: '/lop-xe-vat-lieu-gia-co-cong-nghiep-pu-4.htm', destination: '/san-pham/lop-xe-vat-lieu-gia-co-cong-nghiep-pu', permanent: true },
      { source: '/dac-tinh', destination: '/gioi-thieu', permanent: true },
      { source: '/ung-dung', destination: '/gioi-thieu', permanent: true },
    ]
  },
  // Cho phép dùng thư mục uploadwb như static files
  async rewrites() {
    return [
      { source: '/uploadwb/:path*', destination: '/uploads/:path*' },
    ]
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
