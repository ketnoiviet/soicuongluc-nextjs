-- CreateTable
CREATE TABLE "sanpham_loai" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "thu_tu" INTEGER,
    "ten_loai" TEXT,
    "hien_thi" INTEGER DEFAULT 1,
    "hieu_luc" INTEGER DEFAULT 1,
    "id_cha" INTEGER,
    "url" TEXT,
    "ngay" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "cap" INTEGER,
    "hinh_anh" TEXT,
    "noi_dung" TEXT,
    "tin_noi_bat" INTEGER DEFAULT 0,
    "tu_khoa_1" TEXT,
    "tu_khoa_2" TEXT,
    "tu_khoa_3" TEXT,
    "tom_tat" TEXT,
    "tags" TEXT,
    "link" TEXT,
    "tim_kiem" TEXT,
    "so_lan_xem" INTEGER DEFAULT 0,
    "mo_ta" TEXT,
    CONSTRAINT "sanpham_loai_id_cha_fkey" FOREIGN KEY ("id_cha") REFERENCES "sanpham_loai" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "san_pham" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_loai" INTEGER,
    "thu_tu" INTEGER,
    "ma_sp" TEXT,
    "ten_sp" TEXT,
    "nha_san_xuat" TEXT,
    "hinh_nho" TEXT,
    "hinh_lon" TEXT,
    "mo_ta" TEXT,
    "noi_dung" TEXT,
    "tom_tat" TEXT,
    "thong_so" TEXT,
    "ung_dung" TEXT,
    "hien_thi" INTEGER DEFAULT 1,
    "hieu_luc" INTEGER DEFAULT 1,
    "sp_tieu_bieu" INTEGER DEFAULT 0,
    "sp_moi" INTEGER DEFAULT 0,
    "sp_khuyen_mai" INTEGER DEFAULT 0,
    "so_lan_xem" INTEGER DEFAULT 0,
    "ngay" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "gia" REAL,
    "gia_km" REAL,
    "don_vi" TEXT,
    "tu_khoa_1" TEXT,
    "tu_khoa_2" TEXT,
    "tu_khoa_3" TEXT,
    "tags" TEXT,
    "link" TEXT,
    "tim_kiem" TEXT,
    "chieu_rong" TEXT,
    "chieu_dai" TEXT,
    "chieu_cao" TEXT,
    "duong_kinh" TEXT,
    "chu_vi" TEXT,
    "trong_luong" TEXT,
    CONSTRAINT "san_pham_id_loai_fkey" FOREIGN KEY ("id_loai") REFERENCES "sanpham_loai" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "san_pham_hinh" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_sp" INTEGER,
    "thu_tu" INTEGER,
    "url" TEXT,
    "ten_hinh" TEXT,
    CONSTRAINT "san_pham_hinh_id_sp_fkey" FOREIGN KEY ("id_sp") REFERENCES "san_pham" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bai_viet_loai" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "thu_tu" INTEGER,
    "ten_loai" TEXT,
    "hien_thi" INTEGER DEFAULT 1,
    "hieu_luc" INTEGER DEFAULT 1,
    "id_cha" INTEGER,
    "url" TEXT,
    "ngay" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "hinh_anh" TEXT,
    "noi_dung" TEXT,
    "tin_noi_bat" INTEGER DEFAULT 0,
    "tu_khoa_1" TEXT,
    "tim_kiem" TEXT,
    "so_lan_xem" INTEGER DEFAULT 0,
    CONSTRAINT "bai_viet_loai_id_cha_fkey" FOREIGN KEY ("id_cha") REFERENCES "bai_viet_loai" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bai_viet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_loai" INTEGER,
    "thu_tu" INTEGER,
    "tieu_de" TEXT,
    "hinh_nho" TEXT,
    "hinh_lon" TEXT,
    "tom_tat" TEXT,
    "noi_dung" TEXT,
    "hien_thi" INTEGER DEFAULT 1,
    "hieu_luc" INTEGER DEFAULT 1,
    "tin_noi_bat" INTEGER DEFAULT 0,
    "so_lan_xem" INTEGER DEFAULT 0,
    "ngay" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "tu_khoa_1" TEXT,
    "tu_khoa_2" TEXT,
    "tags" TEXT,
    "link" TEXT,
    "tim_kiem" TEXT,
    "tac_gia" TEXT,
    "url_video" TEXT,
    CONSTRAINT "bai_viet_id_loai_fkey" FOREIGN KEY ("id_loai") REFERENCES "bai_viet_loai" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "banner_slide" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_loai" INTEGER,
    "thu_tu" INTEGER,
    "ten_hinh" TEXT,
    "url" TEXT,
    "link" TEXT,
    "tom_tat" TEXT,
    "noi_dung" TEXT
);

-- CreateTable
CREATE TABLE "lien_he_kh" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_loai" INTEGER,
    "ten_kh" TEXT,
    "dia_chi" TEXT,
    "dien_thoai" TEXT,
    "email" TEXT,
    "tieu_de" TEXT,
    "noi_dung" TEXT,
    "ngay" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER DEFAULT 0
);

-- CreateTable
CREATE TABLE "panel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_loai" INTEGER,
    "thu_tu" INTEGER,
    "ten_hinh" TEXT,
    "link" TEXT,
    "url" TEXT,
    "rong" INTEGER,
    "cao" INTEGER,
    "hien_thi" INTEGER DEFAULT 1,
    "hieu_luc" INTEGER DEFAULT 1
);

-- CreateTable
CREATE TABLE "nguoi_dung" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ho_ten" TEXT,
    "email" TEXT NOT NULL,
    "mat_khau" TEXT NOT NULL,
    "vai_tro" TEXT DEFAULT 'admin',
    "hieu_luc" INTEGER DEFAULT 1,
    "dang_nhap_cuoi" DATETIME,
    "ngay_tao" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "cau_hinh" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "khoa" TEXT NOT NULL,
    "gia_tri" TEXT,
    "ghi_chu" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "nguoi_dung_email_key" ON "nguoi_dung"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cau_hinh_khoa_key" ON "cau_hinh"("khoa");
