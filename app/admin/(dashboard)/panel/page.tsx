import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deletePanelAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function PanelListPage() {
  const items = await prisma.adPanel.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <PageHeader title="Panel quảng cáo" description={`${items.length} panel`} actionHref="/admin/panel/new" actionLabel="Thêm panel" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <GlassCard key={item.id} className="overflow-hidden p-0">
            <div className="relative aspect-square w-full bg-admin-text-3/10">
              <Image src={getImageUrl(item.imageUrl)} alt="" fill className="object-cover" sizes="250px" />
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-semibold text-admin-text">Panel #{item.id}</p>
              <p className="truncate text-xs text-admin-text-3">
                {item.widthPx || '?'}×{item.heightPx || '?'}px • Thứ tự {item.sortOrder}
              </p>
              <div className="mt-2 flex justify-end gap-2">
                <Link
                  href={`/admin/panel/${item.id}`}
                  className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                >
                  <Pencil className="size-3.5" />
                </Link>
                <ConfirmDeleteButton
                  action={deletePanelAction.bind(null, item.id)}
                  confirmMessage="Xóa panel này?"
                  label={<Trash2 className="size-3.5" />}
                  pendingLabel="…"
                  className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-rose/40 hover:text-admin-rose disabled:opacity-50"
                />
              </div>
            </div>
          </GlassCard>
        ))}
        {items.length === 0 && (
          <GlassCard className="col-span-full py-10 text-center text-admin-text-3">Chưa có panel nào.</GlassCard>
        )}
      </div>
    </div>
  )
}
