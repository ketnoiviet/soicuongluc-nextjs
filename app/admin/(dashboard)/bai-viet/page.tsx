import Link from 'next/link'
import Image from 'next/image'
import { Pencil } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getImageUrl, formatDate } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import StatusBadge from '@/app/admin/_components/StatusBadge'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteBaiVietAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function BaiVietListPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams.q?.trim() || ''

  const items = await prisma.newsArticle.findMany({
    where: q ? { title: { contains: q } } : undefined,
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  })

  return (
    <div>
      <PageHeader title="Bài viết / Tin tức" description={`${items.length} bài viết`} actionHref="/admin/bai-viet/new" actionLabel="Thêm bài viết" />

      <GlassCard className="mb-4 flex flex-wrap items-center gap-3 p-3">
        <form className="flex flex-1 flex-wrap items-center gap-3" method="get">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Tìm theo tiêu đề..."
            className="h-10 w-full min-w-[180px] flex-1 rounded-admin-sm border border-admin-border/20 bg-white/70 px-3.5 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 dark:bg-white/5 sm:w-64 sm:flex-none"
          />
          <button
            type="submit"
            className="h-10 rounded-admin-sm border border-admin-border/20 bg-white/70 px-4 text-sm font-medium text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary dark:bg-white/5"
          >
            Tìm
          </button>
          {q && (
            <Link href="/admin/bai-viet" className="text-sm text-admin-text-3 hover:text-admin-rose">
              Xóa lọc
            </Link>
          )}
        </form>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/12 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Ảnh</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Tiêu đề</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Danh mục</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Ngày đăng</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/10">
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-admin-primary/5">
                  <td className="px-4 py-2.5">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-admin-sm bg-admin-text-3/10">
                      <Image src={getImageUrl(item.thumbnailUrl)} alt={item.title} fill className="object-cover" sizes="40px" />
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <p className="line-clamp-1 font-semibold text-admin-text">{item.title}</p>
                  </td>
                  <td className="px-4 py-2.5 text-admin-text-2">{item.category?.name || '—'}</td>
                  <td className="px-4 py-2.5 text-admin-text-3">{formatDate(item.publishedAt)}</td>
                  <td className="px-4 py-2.5">
                    {item.status === 'PUBLISHED' ? (
                      <StatusBadge variant="success">Đang hoạt động</StatusBadge>
                    ) : (
                      <StatusBadge variant="muted">Đã ẩn</StatusBadge>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/bai-viet/${item.id}`}
                        className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                      >
                        <Pencil className="size-3.5" />
                      </Link>
                      <ConfirmDeleteButton
                        action={deleteBaiVietAction.bind(null, item.id)}
                        confirmMessage={`Xóa bài viết "${item.title}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-admin-text-3">
                    Không tìm thấy bài viết nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
