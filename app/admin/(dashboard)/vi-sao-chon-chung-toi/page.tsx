import Link from 'next/link'
import Image from 'next/image'
import { Pencil, ShieldCheck } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import StatusBadge from '@/app/admin/_components/StatusBadge'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteVisaoAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function VisaoListPage() {
  const items = await prisma.whyChooseUsItem.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <PageHeader
        title="Vì sao chọn chúng tôi?"
        description={`${items.length} mục`}
        actionHref="/admin/vi-sao-chon-chung-toi/new"
        actionLabel="Thêm mục"
      />

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/12 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Icon</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Tiêu đề</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Mô tả</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thứ tự</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/10">
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-admin-primary/5">
                  <td className="px-4 py-2.5">
                    <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-admin-sm bg-admin-text-3/10">
                      {item.iconUrl ? (
                        <Image src={getImageUrl(item.iconUrl)} alt={item.title} fill className="object-contain" sizes="40px" />
                      ) : (
                        <ShieldCheck className="size-4 text-admin-text-3" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-admin-text">{item.title}</td>
                  <td className="max-w-sm truncate px-4 py-2.5 text-admin-text-2">{item.description || '—'}</td>
                  <td className="px-4 py-2.5 text-admin-text-2">{item.sortOrder}</td>
                  <td className="px-4 py-2.5">
                    {item.status === 'PUBLISHED' ? (
                      <StatusBadge variant="success">Hiển thị</StatusBadge>
                    ) : (
                      <StatusBadge variant="muted">Đã ẩn</StatusBadge>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/vi-sao-chon-chung-toi/${item.id}`}
                        className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                      >
                        <Pencil className="size-3.5" />
                      </Link>
                      <ConfirmDeleteButton action={deleteVisaoAction.bind(null, item.id)} confirmMessage={`Xóa mục "${item.title}"?`} />
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-admin-text-3">
                    Chưa có mục nào.
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
