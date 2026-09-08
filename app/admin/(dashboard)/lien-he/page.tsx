import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import StatusToggle from './StatusToggle'
import { deleteLienHeAction, setLienHeStatusAction } from './actions'
import type { ContactStatus } from '@/lib/enums'

export const dynamic = 'force-dynamic'

export default async function LienHeListPage({ searchParams }: { searchParams: { status?: string } }) {
  const statusFilter = searchParams.status

  const items = await prisma.contactSubmission.findMany({
    where: statusFilter === 'PENDING' || statusFilter === 'RESOLVED' ? { status: statusFilter } : undefined,
    orderBy: { createdAt: 'desc' },
  })
  const soChuaXuLy = await prisma.contactSubmission.count({ where: { status: 'PENDING' } })

  return (
    <div>
      <PageHeader title="Liên hệ khách hàng" description={`${items.length} liên hệ${soChuaXuLy > 0 ? ` • ${soChuaXuLy} chưa xử lý` : ''}`} />

      <div className="flex gap-2 mb-4">
        <Link
          href="/admin/lien-he"
          className={`text-sm px-3 py-1.5 rounded-lg border ${!statusFilter ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          Tất cả
        </Link>
        <Link
          href="/admin/lien-he?status=PENDING"
          className={`text-sm px-3 py-1.5 rounded-lg border ${statusFilter === 'PENDING' ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          Chưa xử lý
        </Link>
        <Link
          href="/admin/lien-he?status=RESOLVED"
          className={`text-sm px-3 py-1.5 rounded-lg border ${statusFilter === 'RESOLVED' ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          Đã xử lý
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Khách hàng</th>
              <th className="px-4 py-3 font-medium">Liên hệ</th>
              <th className="px-4 py-3 font-medium">Tiêu đề</th>
              <th className="px-4 py-3 font-medium">Ngày gửi</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-2.5">
                  <Link href={`/admin/lien-he/${item.id}`} className="font-medium text-slate-800 hover:text-primary">
                    {item.fullName || 'Khách hàng'}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-slate-500">
                  <p>{item.email}</p>
                  <p>{item.phoneNumber}</p>
                </td>
                <td className="px-4 py-2.5 text-slate-600 max-w-xs truncate">{item.subject}</td>
                <td className="px-4 py-2.5 text-slate-500">{formatDate(item.createdAt)}</td>
                <td className="px-4 py-2.5">
                  <StatusToggle currentStatus={item.status as ContactStatus} onToggle={setLienHeStatusAction.bind(null, item.id)} />
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/lien-he/${item.id}`}
                      className="text-xs px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      Xem
                    </Link>
                    <ConfirmDeleteButton action={deleteLienHeAction.bind(null, item.id)} confirmMessage="Xóa liên hệ này?" />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  Chưa có liên hệ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
