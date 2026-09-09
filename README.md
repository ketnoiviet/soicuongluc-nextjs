# soicuongluc.com - Next.js + SQLite

Chuyển đổi từ **ASP.NET WebForms + SQL Server** sang **Next.js 14 + Prisma + SQLite**

## 🗂 Cấu trúc thư mục

```
soicuongluc-nextjs/
├── app/
│   ├── layout.tsx              # Root layout (Header + Footer)
│   ├── page.tsx                # Trang chủ
│   ├── globals.css             # CSS toàn cục
│   ├── not-found.tsx           # Trang 404
│   ├── sitemap.ts              # Sitemap tự động
│   ├── robots.ts               # robots.txt
│   ├── gioi-thieu/page.tsx     # Giới thiệu công ty
│   ├── tin-tuc/
│   │   ├── page.tsx            # Danh sách tin tức
│   │   └── [slug]/page.tsx     # Chi tiết bài viết
│   ├── san-pham/
│   │   ├── [slug]/page.tsx     # Danh mục sản phẩm
│   │   └── chi-tiet/[slug]/page.tsx  # Chi tiết sản phẩm
│   ├── lien-he/page.tsx        # Liên hệ + form
│   ├── dat-hang/page.tsx       # Yêu cầu báo giá
│   └── api/
│       ├── contact/route.ts    # API nhận form liên hệ
│       └── products/route.ts   # API sản phẩm
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Header + Nav
│   │   └── Footer.tsx          # Footer + Sticky contact
│   └── ui/
│       ├── HeroSlider.tsx      # Slider trang chủ
│       └── Cards.tsx           # ProductCard, NewsCard
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   └── utils.ts                # Helpers (slugify, formatDate...)
├── prisma/
│   ├── schema.prisma           # Schema database SQLite
│   └── seed.js                 # Dữ liệu mẫu từ DB gốc
├── public/
│   └── uploads/                # ← Copy thư mục uploadwb vào đây
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 🚀 Hướng dẫn cài đặt

### Bước 1: Cài Node.js
Tải và cài **Node.js 18+** tại https://nodejs.org

### Bước 2: Copy source và cài package
```bash
# Giải nén source vào thư mục
cd soicuongluc-nextjs

# Cài dependencies (dự án dùng pnpm - xem CLAUDE.md phần "Package manager: pnpm, not npm")
pnpm install
```

### Bước 3: Cấu hình môi trường
```bash
# Copy file env mẫu
cp .env.example .env
```

Mở file `.env` và chỉnh sửa:
```env
# SQLite - không cần cài thêm gì
DATABASE_URL="file:./prisma/dev.db"

# Email (tùy chọn - dùng để nhận form liên hệ)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="email-cua-ban@gmail.com"
SMTP_PASS="mat-khau-ung-dung-gmail"
EMAIL_TO="sales@harifavn.com"

NEXT_PUBLIC_SITE_URL="https://soicuongluc.com"
```

> **Lưu ý Gmail:** Vào https://myaccount.google.com/apppasswords để tạo App Password (không dùng mật khẩu đăng nhập thường)

### Bước 4: Copy ảnh
```bash
# Copy toàn bộ thư mục uploadwb từ web cũ vào public/uploads
# Ví dụ: copy nội dung trong uploadwb/ → public/uploads/
cp -r /path/to/old-site/uploadwb/* public/uploads/
```

### Bước 5: Tạo database và nhập dữ liệu
```bash
# Tạo database SQLite và generate Prisma client
pnpm exec prisma db push

# Nhập dữ liệu mẫu (sản phẩm, tin tức, banner...)
pnpm exec prisma db seed
```

### Bước 6: Chạy thử
```bash
pnpm dev
```
Mở trình duyệt: http://localhost:3000

---

## 📦 Deploy lên Hosting

### Option A: VPS / Server Linux (khuyên dùng)
```bash
# Trên server: cài dependencies NGAY TRÊN server đó (đừng upload node_modules build
# sẵn từ máy Windows - sharp có binary biên dịch riêng theo hệ điều hành, sẽ lỗi trên Linux)
pnpm install

# Build production
pnpm build

# Chạy production
pnpm start

# Hoặc dùng PM2 để chạy ngầm
pnpm add -g pm2
pm2 start pnpm --name "soicuongluc" -- start
pm2 save
pm2 startup
```

Cấu hình Nginx (reverse proxy):
```nginx
server {
    listen 80;
    server_name soicuongluc.com www.soicuongluc.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve file tĩnh trực tiếp qua Nginx (nhanh hơn)
    location /uploads/ {
        alias /var/www/soicuongluc/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Option B: Vercel (miễn phí, dễ nhất)
> ⚠️ Vercel là serverless, SQLite chỉ dùng được khi build tĩnh.
> Nếu dùng Vercel, cần chuyển sang Turso (SQLite cloud) hoặc PlanetScale.

```bash
pnpm add -g vercel
vercel --prod
```

### Option C: Shared Hosting (có Node.js support)
Một số hosting hỗ trợ Node.js như Hostinger, Namecheap...
```bash
# Upload source code (KHÔNG upload node_modules build từ máy local) + pnpm-lock.yaml
# Trên hosting: cài đặt và build ngay tại đó để node_modules khớp đúng hệ điều hành/kiến trúc server
pnpm install
pnpm build
pnpm start
```

---

## 🔄 Quản lý dữ liệu

### Xem dữ liệu trực quan (Prisma Studio)
```bash
pnpm exec prisma studio
# Mở http://localhost:5555
```

### Thêm sản phẩm / bài viết
Dùng Prisma Studio hoặc viết thêm trang admin (xem bên dưới).

### Backup database
```bash
# SQLite chỉ là 1 file duy nhất - copy là xong!
cp prisma/dev.db backup/dev_$(date +%Y%m%d).db
```

### Reset database
```bash
pnpm db:reset
```

---

## ✏️ Trang Admin đơn giản (tùy chọn)

Nếu cần giao diện quản lý nội dung, có thể thêm:
- **Payload CMS** - headless CMS mạnh, tích hợp tốt với Next.js
- **AdminJS** - tự động tạo admin từ Prisma schema
- Hoặc viết trang `/admin` thủ công với middleware bảo vệ

---

## 📝 Mapping URL cũ → mới

| URL cũ (ASP.NET)                              | URL mới (Next.js)                              |
|-----------------------------------------------|------------------------------------------------|
| `/soi-polyester-cuong-luc-1.htm`              | `/san-pham/soi-polyester-cuong-luc`            |
| `/soi-nylon-cuong-luc-2.htm`                  | `/san-pham/soi-nylon-cuong-luc`                |
| `/soi-carbon-3.htm`                           | `/san-pham/soi-carbon`                         |
| `/lop-xe-vat-lieu-gia-co-cong-nghiep-pu-4.htm`| `/san-pham/lop-xe-vat-lieu-gia-co-cong-nghiep-pu` |
| `/tin-tuc-...htm`                             | `/tin-tuc/[slug]`                              |

Redirect được cấu hình sẵn trong `next.config.js`

---

## 🛠 Scripts hữu ích

```bash
pnpm dev          # Chạy development
pnpm build        # Build production
pnpm start        # Chạy production
pnpm db:push      # Sync schema → database
pnpm db:seed      # Nhập dữ liệu mẫu
pnpm db:reset     # Reset + seed lại
pnpm db:studio    # Mở Prisma Studio
```

---

## 📞 Thông tin liên hệ
- Website: soicuongluc.com
- Công ty: HARIFA - TNHH SXTMDV HARIFA
- Email: sales@harifavn.com
- Phone: 0916 666 779
