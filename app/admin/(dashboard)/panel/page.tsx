import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deletePanelAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function PanelListPage() {
  const items = await prisma.adPanel.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <PageHeader title="Panel quảng cáo" description={`${items.length} panel`} actionHref="/admin/panel/new" actionLabel="Thêm panel" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="w-full aspect-square relative bg-slate-100">
              <Image src={getImageUrl(item.imageUrl)} alt="" fill className="object-cover" sizes="250px" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-slate-800 truncate">Panel #{item.id}</p>
              <p className="text-xs text-slate-400 truncate">
                {item.widthPx || '?'}×{item.heightPx || '?'}px • Thứ tự {item.sortOrder}
              </p>
              <div className="flex justify-end gap-2 mt-2">
                <Link
                  href={`/admin/panel/${item.id}`}
                  className="text-xs px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Sửa
                </Link>
                <ConfirmDeleteButton action={deletePanelAction.bind(null, item.id)} confirmMessage="Xóa panel này?" />
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="col-span-full text-center text-slate-400 py-10 bg-white rounded-xl border border-slate-200">
            Chưa có panel nào.
          </p>
        )}
      </div>
    </div>
  )
}
