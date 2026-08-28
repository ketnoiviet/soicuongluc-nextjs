// prisma/seed.js - Dữ liệu thực tế từ SQL Server
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ===== CẤU HÌNH WEBSITE =====
  await prisma.cauHinh.createMany({
    data: [
      { khoa: 'ten_cong_ty', giaTri: 'Công ty TNHH SXTMDV HARIFA', ghiChu: 'Tên công ty' },
      { khoa: 'dien_thoai', giaTri: '0916666779', ghiChu: 'Điện thoại' },
      { khoa: 'zalo', giaTri: '0916666779', ghiChu: 'Zalo' },
      { khoa: 'email', giaTri: 'sales@harifavn.com', ghiChu: 'Email' },
      { khoa: 'dia_chi_hcm', giaTri: 'Số 154 Phạm Phú Thứ, Phường Bảy Hiền, TP Hồ Chí Minh', ghiChu: 'Văn phòng HCM' },
      { khoa: 'dia_chi_hn', giaTri: 'Số 96, Lô F4, KĐT Đại Kim - Định Công, Phường Định Công, TP Hà Nội', ghiChu: 'Văn phòng HN' },
      { khoa: 'dia_chi_dn', giaTri: 'Số 06, Đường Thái Thị Bôi, Xã Nam Phước, TP Đà Nẵng', ghiChu: 'Văn phòng ĐN' },
      { khoa: 'kho_hang', giaTri: 'Số 27/71 Xuân Thới Thượng 59, Ấp 7, Xã Bà Điểm, TP Hồ Chí Minh', ghiChu: 'Tổng kho' },
      { khoa: 'facebook', giaTri: 'https://www.facebook.com/thegioisoidet', ghiChu: 'Facebook' },
      { khoa: 'youtube', giaTri: 'https://www.youtube.com/', ghiChu: 'Youtube' },
      { khoa: 'website', giaTri: 'soicuongluc.com', ghiChu: 'Website' },
      { khoa: 'meta_title', giaTri: 'Sợi cường lực | Soicuongluc.com', ghiChu: 'Meta title' },
      { khoa: 'meta_desc', giaTri: 'HARIFA Nhà Phân Phối Chính Hãng Sợi cường lực uy tín và chất lượng', ghiChu: 'Meta description' },
    ]
    
  })

  // ===== BANNER SLIDE =====
  await prisma.bannerSlide.createMany({
    data: [
      { idLoai: 1, thuTu: 1, url: '/uploads/hinhanh/Slide_1.jpg', link: '/', tomTat: '' },
      { idLoai: 1, thuTu: 2, url: '/uploads/hinhanh/Slide_2.jpg', link: '/', tomTat: '' },
      { idLoai: 1, thuTu: 3, url: '/uploads/hinhanh/Slide_3.jpg', link: '/', tomTat: '' },
      { idLoai: 1, thuTu: 4, url: '/uploads/hinhanh/Slide_4.jpg', link: '/', tomTat: '' },
      { idLoai: 1, thuTu: 5, url: '/uploads/hinhanh/Slide_55.jpg', link: '/', tomTat: '' },
    ]
  })

  // ===== DANH MỤC SẢN PHẨM =====
  const loaiSP = await prisma.sanPhamLoai.createMany({
    data: [
      { id: 1, thuTu: 1, tenLoai: 'Sợi polyester cường lực', hinhAnh: '/uploads/hinhanh/1_soi_polyester_13775202534010_s_.jpg', url: 'soi-polyester-cuong-luc', hieuLuc: 1, cap: 1 },
      { id: 2, thuTu: 2, tenLoai: 'Sợi nylon cường lực', hinhAnh: '/uploads/hinhanh/2_soi_nylon_13553202534010_s_.jpg', url: 'soi-nylon-cuong-luc', hieuLuc: 1, cap: 1 },
      { id: 3, thuTu: 3, tenLoai: 'Sợi carbon', hinhAnh: '/uploads/hinhanh/3_soi_carbon_13824202534110_s_.jpg', url: 'soi-carbon', hieuLuc: 1, cap: 1 },
      { id: 4, thuTu: 4, tenLoai: 'Lốp xe & vật liệu gia cố công nghiệp PU', hinhAnh: '/uploads/hinhanh/4_soi_polyester_13145202534110_s_.jpg', url: 'lop-xe-vat-lieu-gia-co-cong-nghiep-pu', hieuLuc: 1, cap: 1 },
    ]
  })

  // ===== SẢN PHẨM (15 sản phẩm thực từ DB) =====
  await prisma.sanPham.createMany({
    data: [
      { id: 1, idLoai: 1, thuTu: 5, tenSP: 'Sợi Polyester Tenacity Yarn', hinhNho: '/uploads/hinhsp/soi_polyester_tenacity_s.jpg', hinhLon: '/uploads/hinhsp/soi_polyester_tenacity_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 1, link: 'soi-polyester-tenacity-yarn-1' },
      { id: 2, idLoai: 1, thuTu: 4, tenSP: 'Sợi Polyester Modulus Shrinkage Yarn', hinhNho: '/uploads/hinhsp/soi_polyester_modulus_s.jpg', hinhLon: '/uploads/hinhsp/soi_polyester_modulus_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 1, link: 'soi-polyester-modulus-shrinkage-yarn-2' },
      { id: 3, idLoai: 1, thuTu: 3, tenSP: 'Sợi Polyester Shrinkage Yarn', hinhNho: '/uploads/hinhsp/soi_polyester_shrinkage_s.jpg', hinhLon: '/uploads/hinhsp/soi_polyester_shrinkage_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 1, link: 'soi-polyester-shrinkage-yarn-3' },
      { id: 4, idLoai: 1, thuTu: 2, tenSP: 'Sợi Polyester Adhesive Activated Yarn', hinhNho: '/uploads/hinhsp/soi_polyester_adhesive_s.jpg', hinhLon: '/uploads/hinhsp/soi_polyester_adhesive_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 0, link: 'soi-polyester-adhesive-activated-yarn-4' },
      { id: 5, idLoai: 1, thuTu: 1, tenSP: 'Sợi Polyester Wick Yarn', hinhNho: '/uploads/hinhsp/soi_polyester_wick_s.jpg', hinhLon: '/uploads/hinhsp/soi_polyester_wick_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 0, link: 'soi-polyester-wick-yarn-5' },
      { id: 7, idLoai: 2, thuTu: 2, tenSP: 'Sợi Nylon 6 Tenacity Yarn', hinhNho: '/uploads/hinhsp/soi_nylon6_tenacity_s.jpg', hinhLon: '/uploads/hinhsp/soi_nylon6_tenacity_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 1, link: 'soi-nylon-6-tenacity-yarn-7' },
      { id: 8, idLoai: 2, thuTu: 1, tenSP: 'Sợi Nylon 66 Tenacity Yarn', hinhNho: '/uploads/hinhsp/soi_nylon66_tenacity_s.jpg', hinhLon: '/uploads/hinhsp/soi_nylon66_tenacity_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 1, link: 'soi-nylon-66-tenacity-yarn-8' },
      { id: 9, idLoai: 2, thuTu: 3, tenSP: 'Sợi Nylon Chainlon', hinhNho: '/uploads/hinhsp/soi_nylon_chainlon_s.jpg', hinhLon: '/uploads/hinhsp/soi_nylon_chainlon_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 0, link: 'soi-nylon-chainlon-9' },
      { id: 10, idLoai: 3, thuTu: 3, tenSP: 'Sợi carbon mô đun chuẩn', hinhNho: '/uploads/hinhsp/soi_carbon_modun_chuan_s.jpg', hinhLon: '/uploads/hinhsp/soi_carbon_modun_chuan_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 1, link: 'soi-carbon-mo-dun-chuan-10' },
      { id: 11, idLoai: 3, thuTu: 2, tenSP: 'Sợi carbon mô đun trung gian', hinhNho: '/uploads/hinhsp/soi_carbon_modun_trunggian_s.jpg', hinhLon: '/uploads/hinhsp/soi_carbon_modun_trunggian_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 1, link: 'soi-carbon-mo-dun-trung-gian-11' },
      { id: 12, idLoai: 3, thuTu: 1, tenSP: 'Sợi carbon có độ bền kéo cực cao', hinhNho: '/uploads/hinhsp/soi_carbon_dobenkeo_s.jpg', hinhLon: '/uploads/hinhsp/soi_carbon_dobenkeo_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 1, link: 'soi-carbon-co-do-ben-keo-cuc-cao-12' },
      { id: 13, idLoai: 3, thuTu: 4, tenSP: 'Sợi Aramid (ALKEX)', hinhNho: '/uploads/hinhsp/soi_aramid_alkex_s.jpg', hinhLon: '/uploads/hinhsp/soi_aramid_alkex_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 0, link: 'soi-aramid-alkex-13' },
      { id: 14, idLoai: 4, thuTu: 3, tenSP: 'PET và NYLON Tire Cord', hinhNho: '/uploads/hinhsp/tire_cord_s.jpg', hinhLon: '/uploads/hinhsp/tire_cord_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 1, link: 'pet-va-nylon-tire-cord-14' },
      { id: 15, idLoai: 4, thuTu: 2, tenSP: 'Steel Cord', hinhNho: '/uploads/hinhsp/steel_cord_s.jpg', hinhLon: '/uploads/hinhsp/steel_cord_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 1, link: 'steel-cord-15' },
      { id: 16, idLoai: 4, thuTu: 1, tenSP: 'Bead wire', hinhNho: '/uploads/hinhsp/bead_wire_s.jpg', hinhLon: '/uploads/hinhsp/bead_wire_b.jpg', hieuLuc: 1, hienThi: 1, spTieuBieu: 0, link: 'bead-wire-16' },
    ]
  })

  // ===== DANH MỤC BÀI VIẾT =====
  await prisma.baiVietLoai.createMany({
    data: [
      { id: 1, thuTu: 1, tenLoai: 'Giới thiệu', url: 'gioi-thieu', hieuLuc: 1 },
      { id: 2, thuTu: 2, tenLoai: 'Công ty TNHH Harifa', url: 'cong-ty', hieuLuc: 1 },
      { id: 3, thuTu: 3, tenLoai: 'Tin tức', url: 'tin-tuc', hieuLuc: 1 },
      { id: 4, thuTu: 4, tenLoai: 'Hình ảnh', url: 'hinh-anh', hieuLuc: 1 },
      { id: 5, thuTu: 5, tenLoai: 'Video clip', url: 'video', hieuLuc: 1 },
      { id: 6, thuTu: 6, tenLoai: 'Đặc tính', url: 'dac-tinh', hieuLuc: 1 },
      { id: 7, thuTu: 7, tenLoai: 'Ứng dụng', url: 'ung-dung', hieuLuc: 1 },
    ]
  })

  // ===== BÀI VIẾT / TIN TỨC (13 bài thực từ DB) =====
  await prisma.baiViet.createMany({
    data: [
      { id: 1, idLoai: 3, thuTu: 1, tieuDe: 'So sánh Sợi Carbon với Sợi Aramid', hinhNho: '/uploads/hinhanh/carbon_fiber_1_s.jpg', hinhLon: '/uploads/hinhanh/carbon_fiber_1_b.jpg', tomTat: 'Sợi carbon và sợi aramid là hai loại sợi hiệu suất cao phổ biến. Chúng được sử dụng trong nhiều ứng dụng công nghiệp đòi hỏi độ bền cao.', hieuLuc: 1, hienThi: 1, link: 'so-sanh-soi-carbon-voi-soi-aramid-1', ngay: new Date('2025-03-10') },
      { id: 2, idLoai: 3, thuTu: 2, tieuDe: 'Sợi Carbon Trong Cuộc Sống Hàng Ngày', hinhNho: '/uploads/hinhanh/carbon_fiber_2_s.jpg', hinhLon: '/uploads/hinhanh/carbon_fiber_2_b.jpg', tomTat: 'Khám phá những ứng dụng thú vị của sợi carbon trong cuộc sống hàng ngày, từ xe đạp đến thiết bị thể thao và nhiều hơn nữa.', hieuLuc: 1, hienThi: 1, link: 'soi-carbon-trong-cuoc-song-hang-ngay-2', ngay: new Date('2025-03-12') },
      { id: 3, idLoai: 3, thuTu: 3, tieuDe: 'Quy mô và xu hướng thị trường sợi carbon', hinhNho: '/uploads/hinhanh/carbon_fiber_3_s.jpg', hinhLon: '/uploads/hinhanh/carbon_fiber_3_b.jpg', tomTat: 'Phân tích quy mô thị trường sợi carbon toàn cầu và các xu hướng phát triển trong những năm tới.', hieuLuc: 1, hienThi: 1, link: 'quy-mo-va-xu-huong-thi-truong-soi-carbon-3', ngay: new Date('2025-03-15') },
      { id: 4, idLoai: 3, thuTu: 4, tieuDe: 'Sợi Carbon Trong Cuộc Sống Hàng Ngày - Phần 1', hinhNho: '/uploads/hinhanh/carbon_fiber_4_s.jpg', hinhLon: '/uploads/hinhanh/carbon_fiber_4_b.jpg', tomTat: 'Phần 1: Tìm hiểu về sợi carbon và những đặc tính vượt trội khiến nó trở thành vật liệu của tương lai.', hieuLuc: 1, hienThi: 1, link: 'soi-carbon-trong-cuoc-song-hang-ngay-phan-1-4', ngay: new Date('2025-03-18') },
      { id: 5, idLoai: 3, thuTu: 5, tieuDe: 'Ứng dụng của sợi Carbon trong cuộc sống hàng ngày', hinhNho: '/uploads/hinhanh/carbon_fiber_5_s.jpg', hinhLon: '/uploads/hinhanh/carbon_fiber_5_b.jpg', tomTat: 'Từ hàng không vũ trụ đến thiết bị y tế, sợi carbon đang cách mạng hóa nhiều ngành công nghiệp.', hieuLuc: 1, hienThi: 1, link: 'ung-dung-cua-soi-carbon-trong-cuoc-song-hang-ngay-5', ngay: new Date('2025-03-20') },
      { id: 6, idLoai: 3, thuTu: 6, tieuDe: 'Sợi carbon: Thế hệ vật liệu xây dựng tiếp theo?', hinhNho: '/uploads/hinhanh/carbon_fiber_6_s.jpg', hinhLon: '/uploads/hinhanh/carbon_fiber_6_b.jpg', tomTat: 'Ngành xây dựng đang chú ý đến sợi carbon như một giải pháp thay thế cho thép, nhờ trọng lượng nhẹ và độ bền cao.', hieuLuc: 1, hienThi: 1, link: 'soi-carbon-the-he-vat-lieu-xay-dung-tiep-theo-6', ngay: new Date('2025-03-25') },
      { id: 11, idLoai: 3, thuTu: 7, tieuDe: 'Báo cáo về quy mô thị trường sợi nylon 66 Airbag toàn cầu', hinhNho: '/uploads/hinhanh/airbag_nylon66_s.jpg', hinhLon: '/uploads/hinhanh/airbag_nylon66_b.jpg', tomTat: 'Thị trường sợi nylon 66 airbag toàn cầu đang tăng trưởng mạnh mẽ nhờ nhu cầu an toàn xe hơi ngày càng cao.', hieuLuc: 1, hienThi: 1, link: 'bao-cao-thi-truong-soi-nylon-66-airbag-toan-cau-11', ngay: new Date('2025-04-01') },
      { id: 12, idLoai: 3, thuTu: 8, tieuDe: 'Báo cáo về quy mô thị trường dây tanh lốp xe toàn cầu', hinhNho: '/uploads/hinhanh/bead_wire_market_s.jpg', hinhLon: '/uploads/hinhanh/bead_wire_market_b.jpg', tomTat: 'Thị trường dây tanh lốp xe (bead wire) toàn cầu được dự báo tăng trưởng ổn định trong thập kỷ tới.', hieuLuc: 1, hienThi: 1, link: 'bao-cao-thi-truong-day-tanh-lop-xe-toan-cau-12', ngay: new Date('2025-04-05') },
    ]
  })

  console.log('✅ Seed hoàn tất!')
  console.log('   - Cấu hình website: OK')
  console.log('   - Banner slide: 5 ảnh')
  console.log('   - Danh mục sản phẩm: 4 loại')
  console.log('   - Sản phẩm: 15 sản phẩm')
  console.log('   - Danh mục bài viết: 7 loại')
  console.log('   - Bài viết/Tin tức: 8 bài')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
