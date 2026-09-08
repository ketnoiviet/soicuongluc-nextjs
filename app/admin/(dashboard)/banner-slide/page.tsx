import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteBannerSlideAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function BannerSlideListPage() {
  const items = await prisma.bannerSlide.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <PageHeader
        title="Banner slide trang chủ"
        description={`${items.length} banner`}
        actionHref="/admin/banner-slide/new"
        actionLabel="Thêm banner"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="w-full aspect-[16/7] relative bg-slate-100">
              <Image src={getImageUrl(item.imageUrl)} alt={item.caption || ''} fill className="object-cover" sizes="400px" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-slate-800 truncate">{item.caption || `Banner #${item.id}`}</p>
              <p className="text-xs text-slate-400 truncate">Thứ tự: {item.sortOrder} {item.linkUrl ? `• Link: ${item.linkUrl}` : ''}</p>
              <div className="flex justify-end gap-2 mt-2">
                <Link
                  href={`/admin/banner-slide/${item.id}`}
                  className="text-xs px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Sửa
                </Link>
                <ConfirmDeleteButton action={deleteBannerSlideAction.bind(null, item.id)} confirmMessage="Xóa banner này?" />
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="col-span-full text-center text-slate-400 py-10 bg-white rounded-xl border border-slate-200">
            Chưa có banner nào.
          </p>
        )}
      </div>
    </div>
  )
}
