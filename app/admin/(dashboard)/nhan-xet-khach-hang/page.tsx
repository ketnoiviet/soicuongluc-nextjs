import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Star, User } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import StatusBadge from '@/app/admin/_components/StatusBadge'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteNhanXetAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function NhanXetListPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <PageHeader
        title="Nhận xét của khách hàng"
        description={`${items.length} nhận xét`}
        actionHref="/admin/nhan-xet-khach-hang/new"
        actionLabel="Thêm nhận xét"
      />

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/12 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Khách hàng</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Nội dung</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Đánh giá</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thứ tự</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/10">
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-admin-primary/5">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-admin-text-3/10">
                        {item.avatarUrl ? (
                          <Image src={getImageUrl(item.avatarUrl)} alt={item.customerName} fill className="object-cover" sizes="36px" />
                        ) : (
                          <User className="size-4 text-admin-text-3" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-admin-text">{item.customerName}</p>
                        {item.position && <p className="truncate text-xs text-admin-text-3">{item.position}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="max-w-sm truncate px-4 py-2.5 text-admin-text-2">{item.content || '—'}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-0.5 text-admin-amber">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`size-3.5 ${i < item.rating ? 'fill-current' : 'text-admin-text-3/30'}`} />
                      ))}
                    </div>
                  </td>
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
                        href={`/admin/nhan-xet-khach-hang/${item.id}`}
                        className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                      >
                        <Pencil className="size-3.5" />
                      </Link>
                      <ConfirmDeleteButton
                        action={deleteNhanXetAction.bind(null, item.id)}
                        confirmMessage={`Xóa nhận xét của "${item.customerName}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-admin-text-3">
                    Chưa có nhận xét nào.
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
