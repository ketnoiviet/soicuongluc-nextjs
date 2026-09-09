import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import StatusBadge from '@/app/admin/_components/StatusBadge'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteBaiVietLoaiAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function BaiVietLoaiListPage() {
  const items = await prisma.newsCategory.findMany({
    orderBy: [{ sortOrder: 'asc' }],
    include: { _count: { select: { articles: true, children: true } }, parent: true },
  })

  return (
    <div>
      <PageHeader
        title="Danh mục tin tức"
        description={`${items.length} danh mục`}
        actionHref="/admin/bai-viet-loai/new"
        actionLabel="Thêm danh mục"
      />

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/12 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Tên danh mục</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Danh mục cha</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Số bài viết</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thứ tự</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/10">
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-admin-primary/5">
                  <td className="px-4 py-2.5">
                    <p className="font-semibold text-admin-text">{item.name}</p>
                    <p className="text-xs text-admin-text-3">/{item.slug}</p>
                  </td>
                  <td className="px-4 py-2.5 text-admin-text-2">{item.parent?.name || '—'}</td>
                  <td className="px-4 py-2.5 text-admin-text-2">{item._count.articles}</td>
                  <td className="px-4 py-2.5 text-admin-text-2">{item.sortOrder}</td>
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
                        href={`/admin/bai-viet-loai/${item.id}`}
                        className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                      >
                        <Pencil className="size-3.5" />
                      </Link>
                      <ConfirmDeleteButton
                        action={deleteBaiVietLoaiAction.bind(null, item.id)}
                        confirmMessage={`Xóa danh mục "${item.name}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-admin-text-3">
                    Chưa có danh mục nào.
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
