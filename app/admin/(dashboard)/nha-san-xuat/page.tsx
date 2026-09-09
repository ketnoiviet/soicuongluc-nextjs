import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Building2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteNhaSanXuatAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function NhaSanXuatListPage() {
  const items = await prisma.supplier.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })

  return (
    <div>
      <PageHeader
        title="Nhà sản xuất"
        description={`${items.length} nhà sản xuất`}
        actionHref="/admin/nha-san-xuat/new"
        actionLabel="Thêm nhà sản xuất"
      />

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/12 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Logo</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Tên</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Website</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Số sản phẩm</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/10">
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-admin-primary/5">
                  <td className="px-4 py-2.5">
                    <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-admin-sm bg-admin-text-3/10">
                      {item.logoUrl ? (
                        <Image src={getImageUrl(item.logoUrl)} alt={item.name} fill className="object-contain" sizes="40px" />
                      ) : (
                        <Building2 className="size-4 text-admin-text-3" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-admin-text">{item.name}</td>
                  <td className="px-4 py-2.5 text-admin-text-2">
                    {item.website ? (
                      <a href={item.website} target="_blank" rel="noopener" className="text-admin-primary hover:underline">
                        {item.website}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-admin-text-2">{item._count.products}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/nha-san-xuat/${item.id}`}
                        className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                      >
                        <Pencil className="size-3.5" />
                      </Link>
                      <ConfirmDeleteButton
                        action={deleteNhaSanXuatAction.bind(null, item.id)}
                        confirmMessage={
                          item._count.products > 0
                            ? `Xóa nhà sản xuất "${item.name}" sẽ XÓA VĨNH VIỄN toàn bộ ${item._count.products} sản phẩm thuộc nhà sản xuất này (kèm ảnh). Bạn có chắc chắn?`
                            : `Xóa nhà sản xuất "${item.name}"?`
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-admin-text-3">
                    Chưa có nhà sản xuất nào.
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
