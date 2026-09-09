import Link from 'next/link'
import Image from 'next/image'
import { Pencil } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import StatusBadge from '@/app/admin/_components/StatusBadge'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteGioiThieuAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function GioiThieuListPage() {
  const items = await prisma.aboutArticle.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <PageHeader
        title="Bài viết giới thiệu"
        description={`${items.length} bài viết`}
        actionHref="/admin/gioi-thieu/new"
        actionLabel="Thêm bài viết"
      />

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/12 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Ảnh</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Tiêu đề</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thứ tự</th>
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
                    <p className="text-xs text-admin-text-3">/{item.slug}</p>
                  </td>
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
                        href={`/admin/gioi-thieu/${item.id}`}
                        className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                      >
                        <Pencil className="size-3.5" />
                      </Link>
                      <ConfirmDeleteButton
                        action={deleteGioiThieuAction.bind(null, item.id)}
                        confirmMessage={`Xóa bài viết "${item.title}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-admin-text-3">
                    Chưa có bài viết giới thiệu nào.
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
