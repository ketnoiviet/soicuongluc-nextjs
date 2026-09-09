import Link from 'next/link'
import { Eye } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate, cn } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import StatusToggle from './StatusToggle'
import { deleteLienHeAction, setLienHeStatusAction } from './actions'
import type { ContactStatus } from '@/lib/enums'

export const dynamic = 'force-dynamic'

const tabCls = (active: boolean) =>
  cn(
    'rounded-admin-sm border px-3 py-1.5 text-sm transition-colors',
    active
      ? 'admin-gradient border-transparent text-white'
      : 'border-admin-border/20 text-admin-text-2 hover:border-admin-primary/40 hover:text-admin-primary'
  )

export default async function LienHeListPage(props: { searchParams: Promise<{ status?: string }> }) {
  const searchParams = await props.searchParams;
  const statusFilter = searchParams.status

  const items = await prisma.contactSubmission.findMany({
    where: statusFilter === 'PENDING' || statusFilter === 'RESOLVED' ? { status: statusFilter } : undefined,
    orderBy: { createdAt: 'desc' },
  })
  const soChuaXuLy = await prisma.contactSubmission.count({ where: { status: 'PENDING' } })

  return (
    <div>
      <PageHeader title="Liên hệ khách hàng" description={`${items.length} liên hệ${soChuaXuLy > 0 ? ` • ${soChuaXuLy} chưa xử lý` : ''}`} />

      <div className="mb-4 flex gap-2">
        <Link href="/admin/lien-he" className={tabCls(!statusFilter)}>
          Tất cả
        </Link>
        <Link href="/admin/lien-he?status=PENDING" className={tabCls(statusFilter === 'PENDING')}>
          Chưa xử lý
        </Link>
        <Link href="/admin/lien-he?status=RESOLVED" className={tabCls(statusFilter === 'RESOLVED')}>
          Đã xử lý
        </Link>
      </div>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/12 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Khách hàng</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Liên hệ</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Tiêu đề</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Ngày gửi</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/10">
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-admin-primary/5">
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/lien-he/${item.id}`} className="font-semibold text-admin-text hover:text-admin-primary">
                      {item.fullName || 'Khách hàng'}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-admin-text-2">
                    <p>{item.email}</p>
                    <p>{item.phoneNumber}</p>
                  </td>
                  <td className="max-w-xs truncate px-4 py-2.5 text-admin-text-2">{item.subject}</td>
                  <td className="px-4 py-2.5 text-admin-text-3">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-2.5">
                    <StatusToggle currentStatus={item.status as ContactStatus} onToggle={setLienHeStatusAction.bind(null, item.id)} />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/lien-he/${item.id}`}
                        className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                      >
                        <Eye className="size-3.5" />
                      </Link>
                      <ConfirmDeleteButton action={deleteLienHeAction.bind(null, item.id)} confirmMessage="Xóa liên hệ này?" />
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-admin-text-3">
                    Chưa có liên hệ nào.
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
