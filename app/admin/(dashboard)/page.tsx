import Link from 'next/link'
import {
  ArrowRight,
  FolderOpen,
  FolderTree,
  GalleryHorizontal,
  Inbox,
  LayoutPanelLeft,
  Newspaper,
  Package,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import GlassCard from '@/app/admin/_components/GlassCard'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [soLoaiSP, soSP, soLoaiBV, soBV, soBanner, soPanel, soLienHeMoi, soLienHe, lienHeGanDay] = await Promise.all([
    prisma.productCategory.count(),
    prisma.product.count(),
    prisma.newsCategory.count(),
    prisma.newsArticle.count(),
    prisma.bannerSlide.count(),
    prisma.adPanel.count(),
    prisma.contactSubmission.count({ where: { status: 'PENDING' } }),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ])

  const cards = [
    { label: 'Danh mục sản phẩm', value: soLoaiSP, href: '/admin/san-pham-loai', icon: FolderTree, chipCls: 'bg-admin-sky/15 text-admin-sky', featured: false },
    { label: 'Sản phẩm', value: soSP, href: '/admin/san-pham', icon: Package, chipCls: '', featured: true },
    { label: 'Danh mục tin tức', value: soLoaiBV, href: '/admin/bai-viet-loai', icon: FolderOpen, chipCls: 'bg-admin-sky/15 text-admin-sky', featured: false },
    { label: 'Bài viết', value: soBV, href: '/admin/bai-viet', icon: Newspaper, chipCls: 'bg-admin-amber/15 text-admin-amber', featured: false },
    { label: 'Banner slide', value: soBanner, href: '/admin/banner-slide', icon: GalleryHorizontal, chipCls: 'bg-admin-rose/15 text-admin-rose', featured: false },
    { label: 'Panel quảng cáo', value: soPanel, href: '/admin/panel', icon: LayoutPanelLeft, chipCls: 'bg-admin-emerald/15 text-admin-emerald', featured: false },
  ]

  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-admin-text sm:text-[26px]">Tổng quan</h1>
          <p className="mt-1 text-sm text-admin-text-2">Chào mừng quay lại trang quản trị soicuongluc.com</p>
        </div>
        <div className="admin-glass rounded-full px-4 py-2 text-sm font-medium capitalize text-admin-text-2">{today}</div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={
              c.featured
                ? 'admin-gradient group relative overflow-hidden rounded-admin-lg p-5 text-white shadow-[0_16px_32px_-16px_rgb(var(--admin-primary)/0.5)] transition-transform hover:-translate-y-0.5'
                : 'admin-glass group rounded-admin-lg p-5 transition-transform hover:-translate-y-0.5'
            }
          >
            {c.featured && (
              <>
                <span className="pointer-events-none absolute -right-6 -top-10 size-32 rounded-full bg-white/10" />
                <span className="pointer-events-none absolute -bottom-10 -right-2 size-24 rounded-full bg-white/10" />
              </>
            )}
            <div
              className={
                c.featured
                  ? 'mb-3 flex size-9 items-center justify-center rounded-lg bg-white/20 text-white'
                  : `mb-3 flex size-9 items-center justify-center rounded-lg ${c.chipCls}`
              }
            >
              <c.icon className="size-[18px]" />
            </div>
            <p className={c.featured ? 'text-[28px] font-extrabold leading-none' : 'text-[28px] font-extrabold leading-none text-admin-text'}>
              {c.value}
            </p>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <p className={c.featured ? 'text-[13px] text-white/85' : 'text-[13px] text-admin-text-3'}>{c.label}</p>
              {c.featured && (
                <span className="flex items-center gap-1 text-xs font-medium text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                  Xem tất cả <ArrowRight className="size-3.5" />
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-admin-text">Liên hệ gần đây</h2>
            <Link href="/admin/lien-he" className="text-sm font-medium text-admin-primary hover:underline">
              Xem tất cả ({soLienHe})
            </Link>
          </div>
          {lienHeGanDay.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-admin-primary/10 text-admin-primary">
                <Inbox className="size-6" />
              </div>
              <div>
                <p className="font-semibold text-admin-text">Chưa có liên hệ nào</p>
                <p className="text-sm text-admin-text-3">Liên hệ mới từ khách hàng sẽ hiển thị tại đây.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-admin-border/10">
              {lienHeGanDay.map((lh) => (
                <Link
                  key={lh.id}
                  href={`/admin/lien-he/${lh.id}`}
                  className="-mx-2 flex items-center justify-between rounded-admin-sm px-2 py-3 hover:bg-admin-primary/5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-admin-text">{lh.fullName || 'Khách hàng'}</p>
                    <p className="truncate text-xs text-admin-text-3">{lh.subject || lh.email || lh.phoneNumber}</p>
                  </div>
                  <div className="ml-3 flex shrink-0 items-center gap-2">
                    {lh.status === 'PENDING' && <span className="size-2 rounded-full bg-admin-rose" />}
                    <span className="text-xs text-admin-text-3">{formatDate(lh.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="mb-4 font-bold text-admin-text">Thao tác nhanh</h2>
          <div className="space-y-2">
            <Link
              href="/admin/san-pham/new"
              className="flex items-center justify-between rounded-admin-sm border border-admin-border/15 px-3 py-2.5 text-sm text-admin-text-2 transition-colors hover:border-admin-primary/30 hover:bg-admin-primary/5"
            >
              <span className="flex items-center gap-2.5">
                <Package className="size-4 text-admin-primary" /> Thêm sản phẩm mới
              </span>
              <ArrowRight className="size-4 text-admin-text-3" />
            </Link>
            <Link
              href="/admin/bai-viet/new"
              className="flex items-center justify-between rounded-admin-sm border border-admin-border/15 px-3 py-2.5 text-sm text-admin-text-2 transition-colors hover:border-admin-primary/30 hover:bg-admin-primary/5"
            >
              <span className="flex items-center gap-2.5">
                <Newspaper className="size-4 text-admin-amber" /> Thêm bài viết mới
              </span>
              <ArrowRight className="size-4 text-admin-text-3" />
            </Link>
            <Link
              href="/admin/banner-slide/new"
              className="flex items-center justify-between rounded-admin-sm border border-admin-border/15 px-3 py-2.5 text-sm text-admin-text-2 transition-colors hover:border-admin-primary/30 hover:bg-admin-primary/5"
            >
              <span className="flex items-center gap-2.5">
                <GalleryHorizontal className="size-4 text-admin-rose" /> Thêm banner mới
              </span>
              <ArrowRight className="size-4 text-admin-text-3" />
            </Link>
            {soLienHeMoi > 0 && (
              <Link
                href="/admin/lien-he"
                className="flex items-center justify-between rounded-admin-sm border border-admin-rose/25 bg-admin-rose/5 px-3 py-2.5 text-sm font-medium text-admin-rose"
              >
                <span>🔔 {soLienHeMoi} liên hệ chưa xử lý</span>
                <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
