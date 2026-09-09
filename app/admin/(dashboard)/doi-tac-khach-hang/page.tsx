import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Handshake } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import StatusBadge from '@/app/admin/_components/StatusBadge'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteDoiTacAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function DoiTacListPage() {
  const items = await prisma.partner.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <PageHeader
        title="Đối tác & Khách hàng"
        description={`${items.length} mục`}
        actionHref="/admin/doi-tac-khach-hang/new"
        actionLabel="Thêm mới"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <GlassCard key={item.id} className="overflow-hidden p-0">
            <div className="flex aspect-video w-full items-center justify-center bg-admin-text-3/10 p-4">
              {item.logoUrl ? (
                <div className="relative size-full">
                  <Image src={getImageUrl(item.logoUrl)} alt={item.name} fill className="object-contain" sizes="250px" />
                </div>
              ) : (
                <Handshake className="size-8 text-admin-text-3" />
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-semibold text-admin-text">{item.name}</p>
              {item.website && (
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener"
                  className="block truncate text-xs text-admin-primary hover:underline"
                >
                  {item.website}
                </a>
              )}
              <div className="mt-1.5">
                {item.status === 'PUBLISHED' ? (
                  <StatusBadge variant="success">Hiển thị</StatusBadge>
                ) : (
                  <StatusBadge variant="muted">Đã ẩn</StatusBadge>
                )}
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <Link
                  href={`/admin/doi-tac-khach-hang/${item.id}`}
                  className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                >
                  <Pencil className="size-3.5" />
                </Link>
                <ConfirmDeleteButton action={deleteDoiTacAction.bind(null, item.id)} confirmMessage={`Xóa "${item.name}"?`} />
              </div>
            </div>
          </GlassCard>
        ))}
        {items.length === 0 && (
          <GlassCard className="col-span-full py-10 text-center text-admin-text-3">Chưa có đối tác/khách hàng nào.</GlassCard>
        )}
      </div>
    </div>
  )
}
