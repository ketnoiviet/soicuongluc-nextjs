// prisma/seed.js - Dữ liệu thực tế (schema chuẩn hoá v2)
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ===== CẤU HÌNH WEBSITE =====
  await prisma.siteSetting.createMany({
    data: [
      { key: 'ten_cong_ty', value: 'Công ty TNHH SXTMDV HARIFA', description: 'Tên công ty' },
      { key: 'dien_thoai', value: '0916666779', description: 'Điện thoại' },
      { key: 'zalo', value: '0916666779', description: 'Zalo' },
      { key: 'email', value: 'sales@harifavn.com', description: 'Email' },
      { key: 'dia_chi_hcm', value: 'Số 154 Phạm Phú Thứ, Phường Bảy Hiền, TP Hồ Chí Minh', description: 'Văn phòng HCM' },
      { key: 'dia_chi_hn', value: 'Số 96, Lô F4, KĐT Đại Kim - Định Công, Phường Định Công, TP Hà Nội', description: 'Văn phòng HN' },
      { key: 'dia_chi_dn', value: 'Số 06, Đường Thái Thị Bôi, Xã Nam Phước, TP Đà Nẵng', description: 'Văn phòng ĐN' },
      { key: 'kho_hang', value: 'Số 27/71 Xuân Thới Thượng 59, Ấp 7, Xã Bà Điểm, TP Hồ Chí Minh', description: 'Tổng kho' },
      { key: 'facebook', value: 'https://www.facebook.com/thegioisoidet', description: 'Facebook' },
      { key: 'youtube', value: 'https://www.youtube.com/', description: 'Youtube' },
      { key: 'website', value: 'soicuongluc.com', description: 'Website' },
      { key: 'meta_title', value: 'Sợi cường lực | Soicuongluc.com', description: 'Meta title' },
      { key: 'meta_desc', value: 'HARIFA Nhà Phân Phối Chính Hãng Sợi cường lực uy tín và chất lượng', description: 'Meta description' },
    ],
  })

  // ===== BANNER SLIDE =====
  await prisma.bannerSlide.createMany({
    data: [
      { sortOrder: 1, imageUrl: '/uploads/hinhanh/Slide_1.jpg', linkUrl: '/', caption: '' },
      { sortOrder: 2, imageUrl: '/uploads/hinhanh/Slide_2.jpg', linkUrl: '/', caption: '' },
      { sortOrder: 3, imageUrl: '/uploads/hinhanh/Slide_3.jpg', linkUrl: '/', caption: '' },
      { sortOrder: 4, imageUrl: '/uploads/hinhanh/Slide_4.jpg', linkUrl: '/', caption: '' },
      { sortOrder: 5, imageUrl: '/uploads/hinhanh/Slide_55.jpg', linkUrl: '/', caption: '' },
    ],
  })

  // ===== DANH MỤC SẢN PHẨM =====
  await prisma.productCategory.createMany({
    data: [
      { id: 1, sortOrder: 1, name: 'Sợi polyester cường lực', imageUrl: '/uploads/hinhanh/1_soi_polyester_13775202534010_s_.jpg', slug: 'soi-polyester-cuong-luc', status: 'PUBLISHED', level: 1 },
      { id: 2, sortOrder: 2, name: 'Sợi nylon cường lực', imageUrl: '/uploads/hinhanh/2_soi_nylon_13553202534010_s_.jpg', slug: 'soi-nylon-cuong-luc', status: 'PUBLISHED', level: 1 },
      { id: 3, sortOrder: 3, name: 'Sợi carbon', imageUrl: '/uploads/hinhanh/3_soi_carbon_13824202534110_s_.jpg', slug: 'soi-carbon', status: 'PUBLISHED', level: 1 },
      { id: 4, sortOrder: 4, name: 'Lốp xe & vật liệu gia cố công nghiệp PU', imageUrl: '/uploads/hinhanh/4_soi_polyester_13145202534110_s_.jpg', slug: 'lop-xe-vat-lieu-gia-co-cong-nghiep-pu', status: 'PUBLISHED', level: 1 },
    ],
  })

  // ===== SẢN PHẨM (15 sản phẩm thực từ DB) =====
  await prisma.product.createMany({
    data: [
      { id: 1, categoryId: 1, sortOrder: 5, name: 'Sợi Polyester Tenacity Yarn', thumbnailUrl: '/uploads/hinhsp/soi_polyester_tenacity_s.jpg', coverImageUrl: '/uploads/hinhsp/soi_polyester_tenacity_b.jpg', status: 'PUBLISHED', isFeatured: true, slug: 'soi-polyester-tenacity-yarn' },
      { id: 2, categoryId: 1, sortOrder: 4, name: 'Sợi Polyester Modulus Shrinkage Yarn', thumbnailUrl: '/uploads/hinhsp/soi_polyester_modulus_s.jpg', coverImageUrl: '/uploads/hinhsp/soi_polyester_modulus_b.jpg', status: 'PUBLISHED', isFeatured: true, slug: 'soi-polyester-modulus-shrinkage-yarn' },
      { id: 3, categoryId: 1, sortOrder: 3, name: 'Sợi Polyester Shrinkage Yarn', thumbnailUrl: '/uploads/hinhsp/soi_polyester_shrinkage_s.jpg', coverImageUrl: '/uploads/hinhsp/soi_polyester_shrinkage_b.jpg', status: 'PUBLISHED', isFeatured: true, slug: 'soi-polyester-shrinkage-yarn' },
      { id: 4, categoryId: 1, sortOrder: 2, name: 'Sợi Polyester Adhesive Activated Yarn', thumbnailUrl: '/uploads/hinhsp/soi_polyester_adhesive_s.jpg', coverImageUrl: '/uploads/hinhsp/soi_polyester_adhesive_b.jpg', status: 'PUBLISHED', isFeatured: false, slug: 'soi-polyester-adhesive-activated-yarn' },
      { id: 5, categoryId: 1, sortOrder: 1, name: 'Sợi Polyester Wick Yarn', thumbnailUrl: '/uploads/hinhsp/soi_polyester_wick_s.jpg', coverImageUrl: '/uploads/hinhsp/soi_polyester_wick_b.jpg', status: 'PUBLISHED', isFeatured: false, slug: 'soi-polyester-wick-yarn' },
      { id: 7, categoryId: 2, sortOrder: 2, name: 'Sợi Nylon 6 Tenacity Yarn', thumbnailUrl: '/uploads/hinhsp/soi_nylon6_tenacity_s.jpg', coverImageUrl: '/uploads/hinhsp/soi_nylon6_tenacity_b.jpg', status: 'PUBLISHED', isFeatured: true, slug: 'soi-nylon-6-tenacity-yarn' },
      { id: 8, categoryId: 2, sortOrder: 1, name: 'Sợi Nylon 66 Tenacity Yarn', thumbnailUrl: '/uploads/hinhsp/soi_nylon66_tenacity_s.jpg', coverImageUrl: '/uploads/hinhsp/soi_nylon66_tenacity_b.jpg', status: 'PUBLISHED', isFeatured: true, slug: 'soi-nylon-66-tenacity-yarn' },
      { id: 9, categoryId: 2, sortOrder: 3, name: 'Sợi Nylon Chainlon', thumbnailUrl: '/uploads/hinhsp/soi_nylon_chainlon_s.jpg', coverImageUrl: '/uploads/hinhsp/soi_nylon_chainlon_b.jpg', status: 'PUBLISHED', isFeatured: false, slug: 'soi-nylon-chainlon' },
      { id: 10, categoryId: 3, sortOrder: 3, name: 'Sợi carbon mô đun chuẩn', thumbnailUrl: '/uploads/hinhsp/soi_carbon_modun_chuan_s.jpg', coverImageUrl: '/uploads/hinhsp/soi_carbon_modun_chuan_b.jpg', status: 'PUBLISHED', isFeatured: true, slug: 'soi-carbon-mo-dun-chuan' },
      { id: 11, categoryId: 3, sortOrder: 2, name: 'Sợi carbon mô đun trung gian', thumbnailUrl: '/uploads/hinhsp/soi_carbon_modun_trunggian_s.jpg', coverImageUrl: '/uploads/hinhsp/soi_carbon_modun_trunggian_b.jpg', status: 'PUBLISHED', isFeatured: true, slug: 'soi-carbon-mo-dun-trung-gian' },
      { id: 12, categoryId: 3, sortOrder: 1, name: 'Sợi carbon có độ bền kéo cực cao', thumbnailUrl: '/uploads/hinhsp/soi_carbon_dobenkeo_s.jpg', coverImageUrl: '/uploads/hinhsp/soi_carbon_dobenkeo_b.jpg', status: 'PUBLISHED', isFeatured: true, slug: 'soi-carbon-co-do-ben-keo-cuc-cao' },
      { id: 13, categoryId: 3, sortOrder: 4, name: 'Sợi Aramid (ALKEX)', thumbnailUrl: '/uploads/hinhsp/soi_aramid_alkex_s.jpg', coverImageUrl: '/uploads/hinhsp/soi_aramid_alkex_b.jpg', status: 'PUBLISHED', isFeatured: false, slug: 'soi-aramid-alkex' },
      { id: 14, categoryId: 4, sortOrder: 3, name: 'PET và NYLON Tire Cord', thumbnailUrl: '/uploads/hinhsp/tire_cord_s.jpg', coverImageUrl: '/uploads/hinhsp/tire_cord_b.jpg', status: 'PUBLISHED', isFeatured: true, slug: 'pet-va-nylon-tire-cord' },
      { id: 15, categoryId: 4, sortOrder: 2, name: 'Steel Cord', thumbnailUrl: '/uploads/hinhsp/steel_cord_s.jpg', coverImageUrl: '/uploads/hinhsp/steel_cord_b.jpg', status: 'PUBLISHED', isFeatured: true, slug: 'steel-cord' },
      { id: 16, categoryId: 4, sortOrder: 1, name: 'Bead wire', thumbnailUrl: '/uploads/hinhsp/bead_wire_s.jpg', coverImageUrl: '/uploads/hinhsp/bead_wire_b.jpg', status: 'PUBLISHED', isFeatured: false, slug: 'bead-wire' },
    ],
  })

  // ===== DANH MỤC BÀI VIẾT =====
  await prisma.newsCategory.createMany({
    data: [
      { id: 1, sortOrder: 1, name: 'Giới thiệu', slug: 'gioi-thieu', status: 'PUBLISHED' },
      { id: 2, sortOrder: 2, name: 'Công ty TNHH Harifa', slug: 'cong-ty', status: 'PUBLISHED' },
      { id: 3, sortOrder: 3, name: 'Tin tức', slug: 'tin-tuc', status: 'PUBLISHED' },
      { id: 4, sortOrder: 4, name: 'Hình ảnh', slug: 'hinh-anh', status: 'PUBLISHED' },
      { id: 5, sortOrder: 5, name: 'Video clip', slug: 'video', status: 'PUBLISHED' },
      { id: 6, sortOrder: 6, name: 'Đặc tính', slug: 'dac-tinh', status: 'PUBLISHED' },
      { id: 7, sortOrder: 7, name: 'Ứng dụng', slug: 'ung-dung', status: 'PUBLISHED' },
    ],
  })

  // ===== BÀI VIẾT / TIN TỨC (8 bài thực từ DB) =====
  await prisma.newsArticle.createMany({
    data: [
      { id: 1, categoryId: 3, sortOrder: 1, title: 'So sánh Sợi Carbon với Sợi Aramid', thumbnailUrl: '/uploads/hinhanh/carbon_fiber_1_s.jpg', coverImageUrl: '/uploads/hinhanh/carbon_fiber_1_b.jpg', excerpt: 'Sợi carbon và sợi aramid là hai loại sợi hiệu suất cao phổ biến. Chúng được sử dụng trong nhiều ứng dụng công nghiệp đòi hỏi độ bền cao.', status: 'PUBLISHED', slug: 'so-sanh-soi-carbon-voi-soi-aramid-1', publishedAt: new Date('2025-03-10') },
      { id: 2, categoryId: 3, sortOrder: 2, title: 'Sợi Carbon Trong Cuộc Sống Hàng Ngày', thumbnailUrl: '/uploads/hinhanh/carbon_fiber_2_s.jpg', coverImageUrl: '/uploads/hinhanh/carbon_fiber_2_b.jpg', excerpt: 'Khám phá những ứng dụng thú vị của sợi carbon trong cuộc sống hàng ngày, từ xe đạp đến thiết bị thể thao và nhiều hơn nữa.', status: 'PUBLISHED', slug: 'soi-carbon-trong-cuoc-song-hang-ngay-2', publishedAt: new Date('2025-03-12') },
      { id: 3, categoryId: 3, sortOrder: 3, title: 'Quy mô và xu hướng thị trường sợi carbon', thumbnailUrl: '/uploads/hinhanh/carbon_fiber_3_s.jpg', coverImageUrl: '/uploads/hinhanh/carbon_fiber_3_b.jpg', excerpt: 'Phân tích quy mô thị trường sợi carbon toàn cầu và các xu hướng phát triển trong những năm tới.', status: 'PUBLISHED', slug: 'quy-mo-va-xu-huong-thi-truong-soi-carbon-3', publishedAt: new Date('2025-03-15') },
      { id: 4, categoryId: 3, sortOrder: 4, title: 'Sợi Carbon Trong Cuộc Sống Hàng Ngày - Phần 1', thumbnailUrl: '/uploads/hinhanh/carbon_fiber_4_s.jpg', coverImageUrl: '/uploads/hinhanh/carbon_fiber_4_b.jpg', excerpt: 'Phần 1: Tìm hiểu về sợi carbon và những đặc tính vượt trội khiến nó trở thành vật liệu của tương lai.', status: 'PUBLISHED', slug: 'soi-carbon-trong-cuoc-song-hang-ngay-phan-1-4', publishedAt: new Date('2025-03-18') },
      { id: 5, categoryId: 3, sortOrder: 5, title: 'Ứng dụng của sợi Carbon trong cuộc sống hàng ngày', thumbnailUrl: '/uploads/hinhanh/carbon_fiber_5_s.jpg', coverImageUrl: '/uploads/hinhanh/carbon_fiber_5_b.jpg', excerpt: 'Từ hàng không vũ trụ đến thiết bị y tế, sợi carbon đang cách mạng hóa nhiều ngành công nghiệp.', status: 'PUBLISHED', slug: 'ung-dung-cua-soi-carbon-trong-cuoc-song-hang-ngay-5', publishedAt: new Date('2025-03-20') },
      { id: 6, categoryId: 3, sortOrder: 6, title: 'Sợi carbon: Thế hệ vật liệu xây dựng tiếp theo?', thumbnailUrl: '/uploads/hinhanh/carbon_fiber_6_s.jpg', coverImageUrl: '/uploads/hinhanh/carbon_fiber_6_b.jpg', excerpt: 'Ngành xây dựng đang chú ý đến sợi carbon như một giải pháp thay thế cho thép, nhờ trọng lượng nhẹ và độ bền cao.', status: 'PUBLISHED', slug: 'soi-carbon-the-he-vat-lieu-xay-dung-tiep-theo-6', publishedAt: new Date('2025-03-25') },
      { id: 11, categoryId: 3, sortOrder: 7, title: 'Báo cáo về quy mô thị trường sợi nylon 66 Airbag toàn cầu', thumbnailUrl: '/uploads/hinhanh/airbag_nylon66_s.jpg', coverImageUrl: '/uploads/hinhanh/airbag_nylon66_b.jpg', excerpt: 'Thị trường sợi nylon 66 airbag toàn cầu đang tăng trưởng mạnh mẽ nhờ nhu cầu an toàn xe hơi ngày càng cao.', status: 'PUBLISHED', slug: 'bao-cao-thi-truong-soi-nylon-66-airbag-toan-cau-11', publishedAt: new Date('2025-04-01') },
      { id: 12, categoryId: 3, sortOrder: 8, title: 'Báo cáo về quy mô thị trường dây tanh lốp xe toàn cầu', thumbnailUrl: '/uploads/hinhanh/bead_wire_market_s.jpg', coverImageUrl: '/uploads/hinhanh/bead_wire_market_b.jpg', excerpt: 'Thị trường dây tanh lốp xe (bead wire) toàn cầu được dự báo tăng trưởng ổn định trong thập kỷ tới.', status: 'PUBLISHED', slug: 'bao-cao-thi-truong-day-tanh-lop-xe-toan-cau-12', publishedAt: new Date('2025-04-05') },
    ],
  })

  // ===== BÀI VIẾT GIỚI THIỆU =====
  // Chuyển nội dung tĩnh cũ của trang /gioi-thieu (4 section: giới thiệu công ty, đặc tính,
  // ứng dụng, hệ thống văn phòng) thành 4 bài viết CMS-quản-lý-được thay vì cố định trong code.
  await prisma.aboutArticle.createMany({
    data: [
      {
        sortOrder: 1,
        title: 'Về Công ty HARIFA',
        slug: 've-cong-ty-harifa',
        thumbnailUrl: '/uploads/hinhanh/about-company.jpg',
        contentHtml: `<h3>CÔNG TY TNHH SXTMDV HARIFA</h3>
<p>HARIFA là đơn vị phân phối chính hãng các loại sợi cường lực cao cấp từ các thương hiệu hàng đầu thế giới như <strong>Hyosung (Hàn Quốc)</strong>, <strong>Kolon (Hàn Quốc)</strong>, <strong>Toray (Nhật Bản)</strong>.</p>
<p>Với hơn 10 năm kinh nghiệm trong ngành, HARIFA tự hào cung cấp đa dạng các loại sợi kỹ thuật cao phục vụ các ngành công nghiệp dệt may, săm lốp, vật liệu gia cố và nhiều ứng dụng công nghiệp khác.</p>
<p>Hệ thống kho hàng đặt tại TP. Hồ Chí Minh, Hà Nội và Đà Nẵng giúp HARIFA phục vụ khách hàng nhanh chóng, kịp thời trên toàn quốc.</p>`,
        status: 'PUBLISHED',
      },
      {
        sortOrder: 2,
        title: 'Đặc tính sợi cường lực',
        slug: 'dac-tinh-soi-cuong-luc',
        contentHtml: `<p>Các thông số kỹ thuật nổi bật của sợi cường lực HARIFA:</p>
<ul>
<li><strong>Độ bền kéo cao</strong>: Tenacity đạt 6–9 g/denier, vượt trội so với sợi thông thường</li>
<li><strong>Chịu nhiệt tốt</strong>: Ổn định cấu trúc ở nhiệt độ cao, phù hợp quy trình công nghiệp</li>
<li><strong>Chống hóa chất</strong>: Kháng axit, kiềm và nhiều hóa chất công nghiệp phổ biến</li>
<li><strong>Trọng lượng nhẹ</strong>: Tỷ lệ độ bền/trọng lượng vượt trội so với kim loại truyền thống</li>
<li><strong>Độ co ngót thấp</strong>: Shrinkage thấp giúp sản phẩm ổn định kích thước trong quá trình gia công</li>
<li><strong>Kết dính tốt</strong>: Tương thích cao với cao su và nhựa trong ứng dụng gia cố</li>
</ul>`,
        status: 'PUBLISHED',
      },
      {
        sortOrder: 3,
        title: 'Ứng dụng của sợi cường lực',
        slug: 'ung-dung-soi-cuong-luc',
        contentHtml: `<p>Sợi cường lực HARIFA được sử dụng rộng rãi trong nhiều ngành công nghiệp:</p>
<h4>Công nghiệp lốp xe &amp; Ô tô</h4>
<ul><li>Tire cord (dây cốt lốp)</li><li>Bead wire (dây tanh)</li><li>Airbag fabric</li><li>Belt và hose ô tô</li></ul>
<h4>Dệt may &amp; Vải kỹ thuật</h4>
<ul><li>Vải dù bảo hộ</li><li>Dây đai công nghiệp</li><li>Vải địa kỹ thuật</li><li>Lưới an toàn</li></ul>
<h4>Composite &amp; Vật liệu mới</h4>
<ul><li>Gia cố nhựa composite</li><li>Thanh FRP xây dựng</li><li>Vỏ tàu thuyền</li><li>Cánh tuabin gió</li></ul>
<h4>Hàng không &amp; Công nghiệp nặng</h4>
<ul><li>Cáp cẩu &amp; neo</li><li>Dây an toàn leo núi</li><li>Cáp băng tải</li><li>Vải lọc công nghiệp</li></ul>`,
        status: 'PUBLISHED',
      },
      {
        sortOrder: 4,
        title: 'Hệ thống văn phòng & kho hàng',
        slug: 'he-thong-van-phong-kho-hang',
        contentHtml: `<ul>
<li><strong>TP. Hồ Chí Minh</strong> (Văn phòng &amp; Kho): 154 Phạm Phú Thứ, P. Bảy Hiền, TP.HCM - 📞 0916 666 779</li>
<li><strong>Hà Nội</strong> (Văn phòng): 96 Lô F4, KĐT Đại Kim - Định Công, P. Định Công, HN - 📞 0909 829 439</li>
<li><strong>Đà Nẵng</strong> (Văn phòng): 06 Thái Thị Bôi, Xã Nam Phước, TP. Đà Nẵng - 📞 0916 666 779</li>
<li><strong>Tổng kho</strong> (Kho hàng chính): 27/71 Xuân Thới Thượng 59, Ấp 7, Xã Bà Điểm, TP.HCM - 📞 0916 666 779</li>
</ul>`,
        status: 'PUBLISHED',
      },
    ],
  })

  // ===== TÀI KHOẢN ADMIN MẶC ĐỊNH (dành cho khách hàng - chủ website) =====
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@harifavn.com'
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
  console.log('   - Cấu hình website: OK')
  console.log('   - Banner slide: 5 ảnh')
  console.log('   - Danh mục sản phẩm: 4 loại')
  console.log('   - Sản phẩm: 15 sản phẩm')
  console.log('   - Danh mục bài viết: 7 loại')
  console.log('   - Bài viết/Tin tức: 8 bài')
  console.log('   - Bài viết giới thiệu: 4 bài')
  console.log(`   - Tài khoản admin: ${adminEmail} / mật khẩu: ${existAdmin ? '(đã tồn tại, giữ nguyên)' : adminPassword}`)
  console.log(
    superadminEmail && superadminPassword
      ? `   - Tài khoản superadmin (ẩn): ${superadminEmail} (mật khẩu lấy từ .env, không in ra đây)`
      : '   - Tài khoản superadmin: bỏ qua (thiếu SUPERADMIN_EMAIL/SUPERADMIN_PASSWORD trong .env)'
  )
  console.log('   ⚠️  Hãy đổi mật khẩu ngay sau khi đăng nhập lần đầu!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
