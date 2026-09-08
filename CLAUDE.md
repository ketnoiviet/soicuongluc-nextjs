# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Website for HARIFA (soicuongluc.com), a Vietnamese distributor of industrial reinforcement yarns (polyester, nylon, carbon fiber, tire cord). This is a migration from a legacy **ASP.NET WebForms + SQL Server** site to **Next.js 14 (App Router) + Prisma + SQLite**, plus a newly-built custom admin panel (`/admin`) that didn't exist in the legacy site. All UI copy, DB field names, and routes are in Vietnamese.

# SoiCuongLuc Next.js Guidelines (`soicuongluc-nextjs`)

Dự án ứng dụng Next.js App Router, Server Actions, TypeScript và Tailwind CSS.

## 1. Commands & Workflows
- **Package Manager**: Ưu tiên sử dụng `pnpm` (hoặc `npm` nếu môi trường yêu cầu)

## 2. Server Actions Standards (`app/actions/*`)

Tất cả các Server Actions xử lý dữ liệu backend phải tuân theo các nguyên tắc sau:

1. **File Directive**: Đặt `'use server'` ở đầu file Action (ví dụ: `app/actions/contact.ts`).
2. **Standardized Response Format**: Mọi Server Action luôn trả về một object theo định dạng chuẩn:
   ```typescript
   export type ActionResponse<T any> = {
     success: boolean;
     data?: T;
     error?: string;
   };

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build (runs typecheck + lint via next build)
npm start             # Run production build
npm run lint          # ESLint only

npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:push      # Push schema.prisma changes to dev.db without a migration
npm run db:migrate   # Create/apply a Prisma migration (prisma migrate dev)
npm run db:seed      # Seed sample data + default admin (prisma/seed.js)
npm run db:reset     # DROPS the db, re-migrates, and re-seeds — destroys local data
npm run db:studio    # Prisma Studio GUI at http://localhost:5555
```

There is no test suite in this repo. `npm run build` is the closest thing to a correctness check — it runs both the TypeScript compiler and ESLint, and Next.js will hard-fail the build on any duplicate/conflicting route.

Local setup: copy `.env.example` to `.env` (SQLite path, SMTP creds for the contact form, `JWT_SECRET`, `ADMIN_EMAIL`/`ADMIN_PASSWORD` used only by `db:seed` to bootstrap the first admin account), then `npx prisma db push && npx prisma db seed`.

## Admin UI & Dashboard Standards

1. **UI Component Library**: Ưu tiên 100% linh kiện từ `shadcn/ui` (`npx shadcn@latest add <component>`).
2. **Admin Layout Structure**:
   - Mọi trang quản trị đặt trong route group `app/admin/(overview)/...` hoặc `app/(admin)/...`
   - Bắt buộc có `layout.tsx` riêng chứa **Sidebar navigation**, **Header (Breadcrumb + User Profile)** và vùng `children` hiển thị nội dung.
3. **Data Display (Table & Pagination)**:
   - Sử dụng `shadcn/ui` Data Table (`@tanstack/react-table`).
   - Xử lý Phân trang (Pagination) và Bộ lọc (Filter) thông qua URL Search Params (`searchParams`) kết hợp Server Actions để chuẩn SEO và giữ state khi reload.
4. **Forms & Modal CRUD**:
   - Sử dụng `react-hook-form` + `zodResolver` + `shadcn/ui` Form.
   - Thao tác Thêm/Sửa dùng `Dialog` (Modal) hoặc `Sheet` (Slide-over panel).
   - Submit form thông qua Server Action, hiển thị thông báo kết quả bằng `sonner` (Toast notification).

## Architecture

### Two independent route trees under `app/`

- **`app/(site)/`** — the public marketing/catalog site. Route group with its own [layout.tsx](app/(site)/layout.tsx) wrapping pages in `Header` + `Footer`. Pages: home, `gioi-thieu` (about), `san-pham/[slug]` (category) and `san-pham/chi-tiet/[slug]` (product detail), `tin-tuc` (news list/detail), `lien-he` (contact), `dat-hang` (quote request).
- **`app/admin/`** — the admin dashboard, itself split into `app/admin/login/` (unauthenticated) and `app/admin/(dashboard)/` (authenticated, wrapped in [layout.tsx](app/admin/(dashboard)/layout.tsx) with `Sidebar`/`Topbar`/`MobileNav`).

Both trees are route groups (parenthesized segments), which do **not** add a URL segment. Never create a page at the top level of `app/` that duplicates a path already served from inside `(site)/` or `(dashboard)/` — Next.js treats that as a hard build error ("You cannot have two parallel pages that resolve to the same path"), and this has happened before during the ASP.NET migration when old top-level pages weren't deleted after being moved into `(site)/`.

### Admin CRUD module pattern

Every entity under `app/admin/(dashboard)/<entity>/` follows the same shape — copy an existing one (e.g. `san-pham/`) rather than inventing a new pattern:
- `page.tsx` — server component list view, reads via Prisma directly, supports `?q=` / filter search params, `export const dynamic = 'force-dynamic'`.
- `actions.ts` — `'use server'` file with `createXAction` / `updateXAction` / `deleteXAction`. **Every action starts with `await requireAdmin()`** (defined locally per file, wraps `getSession()` and redirects to `/admin/login` if absent) — this is a deliberate second auth check on top of `middleware.ts`, not redundant boilerplate to trim.
- `Form.tsx` — client component, wrapped in `app/admin/_components/ActionForm.tsx` which drives `useFormState` and renders the shared error/success banner.
- `new/page.tsx` and `[id]/page.tsx` — thin wrappers that render `Form.tsx` bound to create/update actions.
- Mutations that need instant UI feedback without a full form (toggles, delete buttons) are client components calling a server action directly, e.g. `ActiveToggle.tsx`, `ConfirmDeleteButton.tsx`, `StatusToggle.tsx`.

### Auth

Session is a JWT (via `jose`, HS256, signed with `JWT_SECRET`) stored in an httpOnly `admin_session` cookie — see [lib/session.ts](lib/session.ts) (encode/decode) and [lib/auth.ts](lib/auth.ts) (`verifyCredentials`, `createSession`, `destroySession`, `getSession`, `hashPassword` via bcryptjs). [middleware.ts](middleware.ts) gates the entire `/admin/*` matcher; individual server actions additionally call `requireAdmin()` — keep both layers when adding new admin routes/actions.

### Data layer

Single Prisma client singleton in [lib/prisma.ts](lib/prisma.ts) (standard Next.js dev hot-reload guard against exhausting connections). SQLite via `DATABASE_URL`.

[prisma/schema.prisma](prisma/schema.prisma) is a direct field-for-field port of the old SQL Server schema — Vietnamese column names (`@map`'d to `snake_case` in the actual DB), and boolean flags are modeled as nullable `Int?` (`0`/`1`, e.g. `hienThi`, `hieuLuc`, `spTieuBieu`) rather than `Boolean`, to preserve compatibility with the legacy data. Follow this convention for new fields rather than introducing real booleans. Core models: `SanPhamLoai`/`SanPham`/`SanPhamHinh` (product categories/products/product gallery images), `BaiVietLoai`/`BaiViet` (news categories/articles), `BannerSlide`, `Panel`, `LienHeKH` (contact form submissions), `NguoiDung` (admin users), `CauHinh` (key-value site settings).

### Image uploads

[lib/upload.ts](lib/upload.ts) is the single hardened place that touches uploaded image bytes — both functions there validate MIME type against an allowlist (`jpeg/png/webp/gif`) + 8MB limit *before* touching the file, and generate a slugified, collision-resistant filename (`<slug>-<timestamp>-<random>.<ext>`). Never re-implement this validation/naming elsewhere (e.g. in an API route) — add a new exported function to this file instead and call it, the way `app/api/admin/upload-image/route.ts` does.
- `saveUploadedImage(file, folder)` — keeps the original format, resizes via `sharp` (max width 1600px, skipped for animated GIFs) and writes to `public/uploads/admin/<folder>/`. Used for entity image fields (`hinhNho`, `hinhLon`, `hinhAnh`, gallery images, banners, panels).
- `saveEditorImage(file, folder = 'editor')` — always re-encodes to **WebP** regardless of input format (used for images inserted into TinyMCE rich-text fields, see below), writing to `public/uploads/admin/editor/`.
- Both throw a Vietnamese-language `Error` (never silently fall back to writing the raw, unvalidated buffer to disk) — callers already catch this and surface `e.message` in the form's error banner, or return it as an API JSON error.

Always read image fields through [lib/utils.ts](lib/utils.ts)'s `getImageUrl()` rather than using a DB `url`/`hinhAnh`/`hinhNho` field directly as an `<Image src>` — those fields are nullable and may still carry the legacy `/uploadwb/` prefix, both of which `getImageUrl()` normalizes (falls back to `/images/no-image.jpg`).

`public/uploads/` also still contains several legacy image directories inherited from the old site (`hinhanh/`, `hinhsp/`, `images/`) alongside the new `uploads/admin/` tree written by the upload feature — both are live and referenced by seeded/DB data, not dead weight to delete casually.

### Rich text editor (TinyMCE)

Long free-text fields that hold HTML (`noiDung`, `thongSo`, `ungDung` on `SanPham`; `noiDung` on `BaiVietLoai`/`BaiViet`) use [app/admin/_components/RichTextEditor.tsx](app/admin/_components/RichTextEditor.tsx) instead of a plain `<textarea>` — a client component wrapping `@tinymce/tinymce-react`, self-hosted (not the Tiny Cloud CDN) via `tinymceScriptSrc="/tinymce/tinymce.min.js"` and `licenseKey="gpl"` (free GPL usage, no API key, no "domain not registered" banner). It renders a hidden `<input name={name}>` alongside the editor so its HTML content still submits through the existing `ActionForm`/server-action flow untouched — pass it `name` + `defaultValue` exactly like a textarea.

- **Assets**: `public/tinymce/` is *generated*, not committed (gitignored) — `npm install` runs `scripts/copy-tinymce.js` via `postinstall`, which copies `node_modules/tinymce` there. If the editor 404s on `/tinymce/tinymce.min.js` after a fresh clone or dependency bump, run `node scripts/copy-tinymce.js` manually.
- **Image uploads inside the editor** go through `images_upload_handler` → `POST /api/admin/upload-image` ([app/api/admin/upload-image/route.ts](app/api/admin/upload-image/route.ts)), which checks `getSession()` itself (middleware's `/admin/:path*` matcher does **not** cover `/api/*`, so this route is the only auth gate — don't drop it) and delegates to `saveEditorImage()` for the actual WebP conversion/validation/save.
- `paste_data_images: false` and `images_file_types` are set deliberately so every inserted image is forced through that upload handler (and therefore through WebP conversion) — don't enable pasted base64 images without also re-adding the size/type checks that bypasses.
- `relative_urls: false` is set so the root-relative paths the upload route returns (`/uploads/admin/editor/...`) are stored verbatim in the saved HTML instead of being rewritten by TinyMCE's default relative-URL logic.
- To add TinyMCE to a new field: swap the `<textarea>` for `<RichTextEditor name="..." defaultValue={item?.field} height={...} />` in that entity's `Form.tsx` — no changes needed in `actions.ts`, since the field still arrives as a plain string in `FormData`.

### Public API routes

`app/api/{products,categories,news,banners}/route.ts` are simple unauthenticated read-only `GET` endpoints backed by Prisma (used for things like the homepage/product widgets). `app/api/contact/route.ts` is the public contact-form `POST` endpoint — it writes to `LienHeKH` first, then best-effort sends a notification email via `nodemailer` if `SMTP_USER`/`SMTP_PASS` are set (email failure must stay non-fatal to the request, since the DB write already succeeded). `app/api/admin/upload-image/route.ts` is the one **authenticated** exception under `app/api/` — see Rich text editor above.

### Legacy URL compatibility

[next.config.js](next.config.js) has `redirects()` mapping old `.htm` ASP.NET URLs to new slugs, and a `rewrites()` for `/uploadwb/*` → `/uploads/*` so old hardcoded image paths in content/DB fields keep resolving.
