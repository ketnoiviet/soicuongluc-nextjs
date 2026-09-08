-- ============================================================================
-- HARIFA — Script di chuyển dữ liệu dev.db (schema cũ) → schema mới (v2)
-- Phase 3/3 của kế hoạch tái cấu trúc DB. Xem báo cáo audit + lý do từng
-- quyết định tại: https://claude.ai/code/artifact/556a62b8-20ab-47c9-bda3-cc42d9f6c711
--
-- CÁCH DÙNG (không đụng tới dev.db gốc cho tới bước cuối cùng):
--
--   1) Tạo file DB mới trống theo schema v2 (Prisma tự sinh đúng bảng/cột/index,
--      không cần đoán DDL bằng tay):
--
--        cd prisma
--        DATABASE_URL="file:./dev.new.db" npx prisma db push --schema=schema.new.prisma
--
--   2) Chạy script này để copy + chuyển đổi dữ liệu từ dev.db (cũ) sang
--      dev.new.db (mới) — dùng CLI sqlite3 (cài kèm Node đôi khi có sẵn,
--      hoặc `npm i -g sqlite3-cli` / dùng DB Browser for SQLite):
--
--        sqlite3 prisma/dev.new.db < prisma/migrate-to-v2.sql
--
--      (Script tự ATTACH dev.db vào dev.new.db, không cần sửa gì thêm.)
--
--   3) Đối chiếu số dòng (query kiểm tra ở cuối file sẽ tự in ra) — so với
--      số liệu gốc: sanpham_loai=4, san_pham=15, san_pham_hinh=0,
--      bai_viet_loai=7, bai_viet=8, banner_slide=5, panel=0, lien_he_kh=0,
--      nguoi_dung=1, cau_hinh=13.
--
--   4) CHỈ KHI đã kiểm tra ổn — mới thay thế file thật:
--
--        cd prisma
--        mv dev.db dev.old.db.bak
--        mv dev.new.db dev.db
--        cp schema.prisma schema.old.prisma.bak
--        cp schema.new.prisma schema.prisma
--        cd ..
--        npx prisma generate
--
--      Bước 4 làm Prisma Client đổi hoàn toàn tên model/field (vd.
--      prisma.sanPham → prisma.product, .tenSP → .name...) — TOÀN BỘ code
--      admin (actions.ts/Form.tsx/page.tsx của 8 entity) + trang public +
--      API routes sẽ build lỗi ngay cho tới khi được cập nhật theo tên mới.
--      Đây là công việc riêng, chưa nằm trong Phase 1-3 — xác nhận trước
--      khi muốn tôi thực hiện tiếp.
--
-- An toàn dữ liệu: script này chỉ SELECT từ dev.db (không UPDATE/DELETE gì
-- trên đó) và chỉ INSERT vào dev.new.db — dev.db gốc không bị thay đổi cho
-- tới khi tự tay đổi tên file ở bước 4.
-- ============================================================================

ATTACH DATABASE 'dev.db' AS old;

BEGIN TRANSACTION;

-- ===== product_categories (từ sanpham_loai) =====
INSERT INTO product_categories
  (id, parent_id, name, slug, sort_order, level, status, image_url, short_description, description_html, created_at)
SELECT
  id,
  id_cha,
  COALESCE(ten_loai, ''),
  url,
  COALESCE(thu_tu, 0),
  COALESCE(cap, 1),
  CASE
    WHEN COALESCE(hieu_luc, 1) = 0 THEN 'ARCHIVED'
    WHEN COALESCE(hien_thi, 1) = 0 THEN 'HIDDEN'
    ELSE 'PUBLISHED'
  END,
  hinh_anh,
  tom_tat,
  noi_dung,
  COALESCE(ngay, CURRENT_TIMESTAMP)
FROM old.sanpham_loai;

-- ===== products (từ san_pham) =====
INSERT INTO products
  (id, category_id, sort_order, sku, name, slug, manufacturer, thumbnail_url, cover_image_url,
   short_description, description_html, specifications_html, applications_html,
   status, is_featured, is_new, is_on_sale, price, sale_price, unit, created_at)
SELECT
  id,
  id_loai,
  COALESCE(thu_tu, 0),
  NULLIF(ma_sp, ''),
  COALESCE(ten_sp, ''),
  link,
  nha_san_xuat,
  hinh_nho,
  hinh_lon,
  tom_tat,
  noi_dung,
  thong_so,
  ung_dung,
  CASE
    WHEN COALESCE(hieu_luc, 1) = 0 THEN 'ARCHIVED'
    WHEN COALESCE(hien_thi, 1) = 0 THEN 'HIDDEN'
    ELSE 'PUBLISHED'
  END,
  COALESCE(sp_tieu_bieu, 0) = 1,
  COALESCE(sp_moi, 0) = 1,
  COALESCE(sp_khuyen_mai, 0) = 1,
  gia,
  gia_km,
  don_vi,
  COALESCE(ngay, CURRENT_TIMESTAMP)
FROM old.san_pham;

-- ===== product_dimensions (từ 6 cột rời trên san_pham — chỉ tạo dòng nếu có ít nhất 1 giá trị) =====
INSERT INTO product_dimensions (product_id, sort_order, value)
SELECT
  id,
  0,
  TRIM(
    (CASE WHEN COALESCE(chieu_rong, '')  != '' THEN 'Rộng: '   || chieu_rong  || '; ' ELSE '' END) ||
    (CASE WHEN COALESCE(chieu_dai, '')   != '' THEN 'Dài: '    || chieu_dai   || '; ' ELSE '' END) ||
    (CASE WHEN COALESCE(chieu_cao, '')   != '' THEN 'Cao: '    || chieu_cao   || '; ' ELSE '' END) ||
    (CASE WHEN COALESCE(duong_kinh, '')  != '' THEN 'Đường kính: ' || duong_kinh || '; ' ELSE '' END) ||
    (CASE WHEN COALESCE(chu_vi, '')      != '' THEN 'Chu vi: ' || chu_vi      || '; ' ELSE '' END) ||
    (CASE WHEN COALESCE(trong_luong, '') != '' THEN 'Trọng lượng: ' || trong_luong || '; ' ELSE '' END)
  )
FROM old.san_pham
WHERE COALESCE(chieu_rong, '') != '' OR COALESCE(chieu_dai, '') != '' OR COALESCE(chieu_cao, '') != ''
   OR COALESCE(duong_kinh, '') != '' OR COALESCE(chu_vi, '') != '' OR COALESCE(trong_luong, '') != '';

-- ===== product_images (từ san_pham_hinh) =====
INSERT INTO product_images (id, product_id, sort_order, image_url, alt_text)
SELECT id, id_sp, COALESCE(thu_tu, 0), url, ten_hinh
FROM old.san_pham_hinh
WHERE url IS NOT NULL;

-- ===== news_categories (từ bai_viet_loai) =====
INSERT INTO news_categories
  (id, parent_id, name, slug, sort_order, status, description_html, created_at)
SELECT
  id,
  id_cha,
  COALESCE(ten_loai, ''),
  url,
  COALESCE(thu_tu, 0),
  CASE
    WHEN COALESCE(hieu_luc, 1) = 0 THEN 'ARCHIVED'
    WHEN COALESCE(hien_thi, 1) = 0 THEN 'HIDDEN'
    ELSE 'PUBLISHED'
  END,
  noi_dung,
  COALESCE(ngay, CURRENT_TIMESTAMP)
FROM old.bai_viet_loai;

-- ===== news_articles (từ bai_viet) =====
INSERT INTO news_articles
  (id, category_id, sort_order, title, slug, thumbnail_url, cover_image_url, excerpt, content_html,
   status, view_count, published_at, author, video_url)
SELECT
  id,
  id_loai,
  COALESCE(thu_tu, 0),
  COALESCE(tieu_de, ''),
  link,
  hinh_nho,
  hinh_lon,
  tom_tat,
  noi_dung,
  CASE
    WHEN COALESCE(hieu_luc, 1) = 0 THEN 'ARCHIVED'
    WHEN COALESCE(hien_thi, 1) = 0 THEN 'HIDDEN'
    ELSE 'PUBLISHED'
  END,
  COALESCE(so_lan_xem, 0),
  COALESCE(ngay, CURRENT_TIMESTAMP),
  tac_gia,
  url_video
FROM old.bai_viet;

-- ===== banner_slides (từ banner_slide) =====
INSERT INTO banner_slides (id, sort_order, image_url, link_url, caption)
SELECT id, COALESCE(thu_tu, 0), url, link, tom_tat
FROM old.banner_slide
WHERE url IS NOT NULL;

-- ===== ad_panels (từ panel) =====
INSERT INTO ad_panels (id, sort_order, image_url, link_url, width_px, height_px, status)
SELECT
  id,
  COALESCE(thu_tu, 0),
  url,
  link,
  rong,
  cao,
  CASE
    WHEN COALESCE(hieu_luc, 1) = 0 THEN 'ARCHIVED'
    WHEN COALESCE(hien_thi, 1) = 0 THEN 'HIDDEN'
    ELSE 'PUBLISHED'
  END
FROM old.panel;

-- ===== contact_submissions (từ lien_he_kh) =====
INSERT INTO contact_submissions
  (id, inquiry_type, full_name, address, phone_number, email, subject, message, status, created_at)
SELECT
  id,
  CASE WHEN id_loai = 2 THEN 'QUOTE_REQUEST' ELSE 'GENERAL_CONTACT' END,
  ten_kh,
  dia_chi,
  dien_thoai,
  email,
  tieu_de,
  noi_dung,
  CASE WHEN COALESCE(status, 0) = 1 THEN 'RESOLVED' ELSE 'PENDING' END,
  COALESCE(ngay, CURRENT_TIMESTAMP)
FROM old.lien_he_kh;

-- ===== admin_users (từ nguoi_dung) =====
INSERT INTO admin_users (id, full_name, email, password_hash, role, is_active, last_login_at, created_at)
SELECT
  id,
  ho_ten,
  email,
  mat_khau,
  UPPER(COALESCE(vai_tro, 'admin')),
  COALESCE(hieu_luc, 1) = 1,
  dang_nhap_cuoi,
  COALESCE(ngay_tao, CURRENT_TIMESTAMP)
FROM old.nguoi_dung;

-- ===== site_settings (từ cau_hinh) =====
INSERT INTO site_settings (id, key, value, description)
SELECT id, khoa, gia_tri, ghi_chu
FROM old.cau_hinh;

-- ===== Đồng bộ lại bộ đếm AUTOINCREMENT (đang insert thẳng id cũ, cần
--       cập nhật sqlite_sequence để bản ghi mới tạo sau này không trùng id) =====
INSERT OR REPLACE INTO sqlite_sequence (name, seq) SELECT 'product_categories', MAX(id) FROM product_categories WHERE EXISTS (SELECT 1 FROM product_categories);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) SELECT 'products', MAX(id) FROM products WHERE EXISTS (SELECT 1 FROM products);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) SELECT 'product_dimensions', MAX(id) FROM product_dimensions WHERE EXISTS (SELECT 1 FROM product_dimensions);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) SELECT 'product_images', MAX(id) FROM product_images WHERE EXISTS (SELECT 1 FROM product_images);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) SELECT 'news_categories', MAX(id) FROM news_categories WHERE EXISTS (SELECT 1 FROM news_categories);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) SELECT 'news_articles', MAX(id) FROM news_articles WHERE EXISTS (SELECT 1 FROM news_articles);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) SELECT 'banner_slides', MAX(id) FROM banner_slides WHERE EXISTS (SELECT 1 FROM banner_slides);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) SELECT 'ad_panels', MAX(id) FROM ad_panels WHERE EXISTS (SELECT 1 FROM ad_panels);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) SELECT 'contact_submissions', MAX(id) FROM contact_submissions WHERE EXISTS (SELECT 1 FROM contact_submissions);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) SELECT 'admin_users', MAX(id) FROM admin_users WHERE EXISTS (SELECT 1 FROM admin_users);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) SELECT 'site_settings', MAX(id) FROM site_settings WHERE EXISTS (SELECT 1 FROM site_settings);

COMMIT;

DETACH DATABASE old;

-- ===== Đối chiếu số dòng — chạy tay sau khi migrate để kiểm tra không mất dữ liệu =====
SELECT 'product_categories' AS table_name, COUNT(*) AS row_count FROM product_categories
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'product_dimensions', COUNT(*) FROM product_dimensions
UNION ALL SELECT 'product_images', COUNT(*) FROM product_images
UNION ALL SELECT 'news_categories', COUNT(*) FROM news_categories
UNION ALL SELECT 'news_articles', COUNT(*) FROM news_articles
UNION ALL SELECT 'banner_slides', COUNT(*) FROM banner_slides
UNION ALL SELECT 'ad_panels', COUNT(*) FROM ad_panels
UNION ALL SELECT 'contact_submissions', COUNT(*) FROM contact_submissions
UNION ALL SELECT 'admin_users', COUNT(*) FROM admin_users
UNION ALL SELECT 'site_settings', COUNT(*) FROM site_settings;
