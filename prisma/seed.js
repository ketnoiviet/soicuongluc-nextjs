// prisma/seed.js - Seed tối thiểu cho 1 dự án MỚI dùng lại khung admin này: chỉ tạo khoá cấu
// hình chung (rỗng, chờ điền qua /admin/cau-hinh) và tài khoản admin/superadmin. KHÔNG seed nội
// dung mẫu (banner/danh mục/sản phẩm/bài viết) - dự án nào cũng có nội dung thật khác nhau, tự
// nhập qua admin sau khi có tài khoản. Nếu cần dữ liệu demo để test nhanh khi phát triển, seed
// thêm thủ công bằng script riêng, đừng sửa lại file này (giữ nó sạch cho mọi dự án dùng chung).
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Mật khẩu mặc định của tài khoản admin nếu không đặt ADMIN_PASSWORD_HASH - hash sẵn của
// "Admin@123" (chuỗi này vốn đã public trong .env.example từ trước nên không phải bí mật;
// bắt buộc đổi ngay sau lần đăng nhập đầu). Chỉ dùng làm fallback tiện dev nhanh, KHÔNG dùng
// khi deploy thật.
const DEFAULT_ADMIN_PASSWORD_HASH = '$2a$10$IgRNPi7Ienk4jnmxRT/5s.qd951GEp7H/qFo/UQA2lokvpiCs2a2S'

// bcrypt/argon2 hash luôn ở dạng $2a$/$2b$/$2y$... (bcrypt) - chặn sớm nếu ai đó lỡ dán
// mật khẩu dạng chữ thường (plaintext) vào biến *_HASH thay vì hash thật.
function assertBcryptHash(value, envName) {
  if (!/^\$2[aby]\$\d{2}\$/.test(value)) {
    throw new Error(
      `${envName} không phải là bcrypt hash hợp lệ. Đừng đặt mật khẩu thô vào đây - ` +
      `hãy chạy "node scripts/hash-password.js \\"MatKhauCuaBan\\"" rồi dán chuỗi hash in ra vào .env.`
    )
  }
}

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
  // .env chỉ chứa BCRYPT HASH (ADMIN_PASSWORD_HASH), không bao giờ chứa mật khẩu thô - nếu
  // hosting/source bị lộ, kẻ tấn công chỉ có hash (phải bruteforce offline), không có mật khẩu
  // dùng đăng nhập ngay được. Tạo hash bằng: node scripts/hash-password.js "MatKhauCuaBan"
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || DEFAULT_ADMIN_PASSWORD_HASH
  if (process.env.ADMIN_PASSWORD_HASH) assertBcryptHash(adminPasswordHash, 'ADMIN_PASSWORD_HASH')
  const existAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } })
  if (!existAdmin) {
    await prisma.adminUser.create({
      data: { fullName: 'Quản trị viên', email: adminEmail, passwordHash: adminPasswordHash, role: 'ADMIN', isActive: true },
    })
  }

  // ===== TÀI KHOẢN SUPERADMIN (ẩn, dành cho nhà phát triển) =====
  // Toàn quyền, không hiển thị/không quản lý được từ tài khoản ADMIN trở xuống (xem
  // lib/permissions.ts - canManageRole). Không đặt fallback hash cứng như khối ADMIN ở trên -
  // đây là tài khoản nhạy cảm, bắt buộc phải khai báo SUPERADMIN_PASSWORD_HASH qua .env (không
  // commit). Bỏ qua nếu thiếu biến môi trường hoặc nếu email đã tồn tại (không ghi đè mật khẩu
  // khi seed lại).
  const superadminEmail = process.env.SUPERADMIN_EMAIL
  const superadminPasswordHash = process.env.SUPERADMIN_PASSWORD_HASH
  if (superadminEmail && superadminPasswordHash) {
    assertBcryptHash(superadminPasswordHash, 'SUPERADMIN_PASSWORD_HASH')
    const existSuperadmin = await prisma.adminUser.findUnique({ where: { email: superadminEmail } })
    if (!existSuperadmin) {
      await prisma.adminUser.create({
        data: { fullName: 'Superadmin', email: superadminEmail, passwordHash: superadminPasswordHash, role: 'SUPERADMIN', isActive: true },
      })
    }
  }

  console.log('✅ Seed hoàn tất!')
  console.log(`   - Cấu hình website: ${siteSettings.length} khoá (rỗng, vào /admin/cau-hinh điền)`)
  console.log(
    `   - Tài khoản admin: ${adminEmail} ${existAdmin ? '(đã tồn tại, giữ nguyên)' : process.env.ADMIN_PASSWORD_HASH ? '(mật khẩu lấy từ ADMIN_PASSWORD_HASH, không in ra đây)' : '/ mật khẩu mặc định: Admin@123'}`
  )
  console.log(
    superadminEmail && superadminPasswordHash
      ? `   - Tài khoản superadmin (ẩn): ${superadminEmail} (mật khẩu lấy từ SUPERADMIN_PASSWORD_HASH, không in ra đây)`
      : '   - Tài khoản superadmin: bỏ qua (thiếu SUPERADMIN_EMAIL/SUPERADMIN_PASSWORD_HASH trong .env)'
  )
  console.log('   ⚠️  Hãy đổi mật khẩu ngay sau khi đăng nhập lần đầu!')
  console.log('   ℹ️  Không có dữ liệu mẫu (banner/danh mục/sản phẩm/bài viết) - tự nhập qua admin.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
