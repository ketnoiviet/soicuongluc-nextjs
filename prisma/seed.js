// prisma/seed.js - Seed tối thiểu cho 1 dự án MỚI dùng lại khung admin này: chỉ tạo khoá cấu
// hình chung (rỗng, chờ điền qua /admin/cau-hinh) và tài khoản admin/superadmin. KHÔNG seed nội
// dung mẫu (banner/danh mục/sản phẩm/bài viết) - dự án nào cũng có nội dung thật khác nhau, tự
// nhập qua admin sau khi có tài khoản. Nếu cần dữ liệu demo để test nhanh khi phát triển, seed
// thêm thủ công bằng script riêng, đừng sửa lại file này (giữ nó sạch cho mọi dự án dùng chung).
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ===== CẤU HÌNH WEBSITE (thông tin liên hệ/công ty - xem lib/company-info.ts) =====
  // Giá trị để trống - đây là danh sách khoá cần điền, tạo sẵn để admin vào /admin/cau-hinh
  // "Sửa" điền giá trị thật thay vì phải tự gõ đúng tên khoá khi tạo mới.
  const siteSettings = [
    { key: 'ten_cong_ty', description: 'Tên công ty' },
    { key: 'tagline', description: 'Câu giới thiệu ngắn (hiện dưới tên công ty ở footer)' },
    { key: 'dien_thoai', description: 'Điện thoại chính' },
    { key: 'dien_thoai_2', description: 'Điện thoại phụ (không bắt buộc)' },
    { key: 'email', description: 'Email liên hệ' },
    { key: 'zalo', description: 'Số Zalo (không cần https://zalo.me/, chỉ số điện thoại)' },
    { key: 'facebook', description: 'Link Facebook' },
    { key: 'messenger', description: 'Link Messenger (không bắt buộc)' },
    { key: 'dia_chi_hcm', description: 'Địa chỉ văn phòng/chi nhánh 1 (không bắt buộc)' },
    { key: 'dia_chi_hn', description: 'Địa chỉ văn phòng/chi nhánh 2 (không bắt buộc)' },
    { key: 'dia_chi_dn', description: 'Địa chỉ văn phòng/chi nhánh 3 (không bắt buộc)' },
    { key: 'kho_hang', description: 'Địa chỉ kho hàng (không bắt buộc)' },
    { key: 'gio_lam_viec', description: 'Giờ làm việc (không bắt buộc)' },
    { key: 'ban_do_embed', description: 'Link nhúng Google Maps (Embed URL) trang Liên hệ, không bắt buộc' },
  ]
  for (const s of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      create: { key: s.key, value: '', description: s.description },
      update: {},
    })
  }

  // ===== TÀI KHOẢN ADMIN MẶC ĐỊNH (dành cho khách hàng - chủ website) =====
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123'
  const existAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } })
  if (!existAdmin) {
    const hash = await bcrypt.hash(adminPassword, 10)
    await prisma.adminUser.create({
      data: { fullName: 'Quản trị viên', email: adminEmail, passwordHash: hash, role: 'ADMIN', isActive: true },
    })
  }

  // ===== TÀI KHOẢN SUPERADMIN (ẩn, dành cho nhà phát triển) =====
  // Toàn quyền, không hiển thị/không quản lý được từ tài khoản ADMIN trở xuống (xem
  // lib/permissions.ts - canManageRole). Không đặt fallback mật khẩu cứng trong code
  // như khối ADMIN ở trên - đây là tài khoản nhạy cảm, bắt buộc phải khai báo qua .env
  // (không commit) để mật khẩu thật không bao giờ nằm trong lịch sử git. Bỏ qua nếu
  // thiếu biến môi trường hoặc nếu email đã tồn tại (không ghi đè mật khẩu khi seed lại).
  const superadminEmail = process.env.SUPERADMIN_EMAIL
  const superadminPassword = process.env.SUPERADMIN_PASSWORD
  if (superadminEmail && superadminPassword) {
    const existSuperadmin = await prisma.adminUser.findUnique({ where: { email: superadminEmail } })
    if (!existSuperadmin) {
      const hash = await bcrypt.hash(superadminPassword, 10)
      await prisma.adminUser.create({
        data: { fullName: 'Superadmin', email: superadminEmail, passwordHash: hash, role: 'SUPERADMIN', isActive: true },
      })
    }
  }

  console.log('✅ Seed hoàn tất!')
  console.log(`   - Cấu hình website: ${siteSettings.length} khoá (rỗng, vào /admin/cau-hinh điền)`)
  console.log(`   - Tài khoản admin: ${adminEmail} / mật khẩu: ${existAdmin ? '(đã tồn tại, giữ nguyên)' : adminPassword}`)
  console.log(
    superadminEmail && superadminPassword
      ? `   - Tài khoản superadmin (ẩn): ${superadminEmail} (mật khẩu lấy từ .env, không in ra đây)`
      : '   - Tài khoản superadmin: bỏ qua (thiếu SUPERADMIN_EMAIL/SUPERADMIN_PASSWORD trong .env)'
  )
  console.log('   ⚠️  Hãy đổi mật khẩu ngay sau khi đăng nhập lần đầu!')
  console.log('   ℹ️  Không có dữ liệu mẫu (banner/danh mục/sản phẩm/bài viết) - tự nhập qua admin.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
