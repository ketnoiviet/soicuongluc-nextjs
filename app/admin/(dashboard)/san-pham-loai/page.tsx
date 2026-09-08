import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteSanPhamLoaiAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function SanPhamLoaiListPage() {
  const items = await prisma.productCategory.findMany({
    orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }],
    include: { _count: { select: { products: true, children: true } }, parent: true },
  })

  return (
    <div>
      <PageHeader
        title="Danh mục sản phẩm"
        description={`${items.length} danh mục`}
        actionHref="/admin/san-pham-loai/new"
        actionLabel="Thêm danh mục"
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Ảnh</th>
              <th className="px-4 py-3 font-medium">Tên danh mục</th>
              <th className="px-4 py-3 font-medium">Danh mục cha</th>
              <th className="px-4 py-3 font-medium">Số SP</th>
              <th className="px-4 py-3 font-medium">Thứ tự</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-2.5">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 relative">
                    <Image src={getImageUrl(item.imageUrl)} alt={item.name} fill className="object-cover" sizes="40px" />
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-400">/{item.slug}</p>
                </td>
                <td className="px-4 py-2.5 text-slate-500">{item.parent?.name || '—'}</td>
                <td className="px-4 py-2.5 text-slate-500">{item._count.products}</td>
                <td className="px-4 py-2.5 text-slate-500">{item.sortOrder}</td>
                <td className="px-4 py-2.5">
                  {item.status === 'PUBLISHED' ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Đang hoạt động</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Đã ẩn</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/san-pham-loai/${item.id}`}
                      className="text-xs px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      Sửa
                    </Link>
                    <ConfirmDeleteButton
                      action={deleteSanPhamLoaiAction.bind(null, item.id)}
                      confirmMessage={`Xóa danh mục "${item.name}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  Chưa có danh mục nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
