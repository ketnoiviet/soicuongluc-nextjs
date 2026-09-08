import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteCauHinhAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function CauHinhListPage() {
  const items = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } })

  return (
    <div>
      <PageHeader
        title="Cấu hình website"
        description={`${items.length} cấu hình • Thông tin chung, liên hệ, mạng xã hội...`}
        actionHref="/admin/cau-hinh/new"
        actionLabel="Thêm cấu hình"
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Khóa (key)</th>
              <th className="px-4 py-3 font-medium">Giá trị</th>
              <th className="px-4 py-3 font-medium">Ghi chú</th>
              <th className="px-4 py-3 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-2.5">
                  <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{item.key}</code>
                </td>
                <td className="px-4 py-2.5 text-slate-700 max-w-md truncate">{item.value || '—'}</td>
                <td className="px-4 py-2.5 text-slate-400">{item.description || '—'}</td>
                <td className="px-4 py-2.5">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/cau-hinh/${item.id}`}
                      className="text-xs px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      Sửa
                    </Link>
                    <ConfirmDeleteButton
                      action={deleteCauHinhAction.bind(null, item.id)}
                      confirmMessage={`Xóa cấu hình "${item.key}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                  Chưa có cấu hình nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
