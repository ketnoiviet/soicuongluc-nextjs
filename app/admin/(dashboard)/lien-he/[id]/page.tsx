import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import DeleteAndGoBack from '@/app/admin/_components/DeleteAndGoBack'
import StatusToggle from '../StatusToggle'
import { deleteLienHeAction, setLienHeStatusAction } from '../actions'
import type { ContactStatus } from '@/lib/enums'

export default async function LienHeDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const item = await prisma.contactSubmission.findUnique({ where: { id } })
  if (!item) notFound()

  const boundDelete = deleteLienHeAction.bind(null, id)

  return (
    <div>
      <PageHeader title="Chi tiết liên hệ" backHref="/admin/lien-he" />

      <GlassCard className="max-w-2xl p-5 md:p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-admin-text">{item.fullName || 'Khách hàng'}</h2>
            <p className="text-sm text-admin-text-3">{formatDate(item.createdAt)}</p>
          </div>
          <StatusToggle currentStatus={item.status as ContactStatus} onToggle={setLienHeStatusAction.bind(null, item.id)} />
        </div>

        <dl className="mb-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-admin-text-3">Email</dt>
            <dd className="text-admin-text">{item.email || '—'}</dd>
          </div>
          <div>
            <dt className="text-admin-text-3">Điện thoại</dt>
            <dd className="text-admin-text">{item.phoneNumber || '—'}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-admin-text-3">Địa chỉ</dt>
            <dd className="text-admin-text">{item.address || '—'}</dd>
          </div>
        </dl>

        <div className="mb-5">
          <p className="mb-1 text-sm text-admin-text-3">Tiêu đề</p>
          <p className="font-medium text-admin-text">{item.subject || '—'}</p>
        </div>

        <div className="mb-6">
          <p className="mb-1 text-sm text-admin-text-3">Nội dung</p>
          <p className="whitespace-pre-wrap leading-relaxed text-admin-text-2">{item.message || '—'}</p>
        </div>

        <div className="flex items-center justify-between border-t border-admin-border/12 pt-4">
          <Link href="/admin/lien-he" className="text-sm text-admin-text-3 hover:text-admin-text-2">
            ← Quay lại danh sách
          </Link>
          <DeleteAndGoBack action={boundDelete} redirectTo="/admin/lien-he" confirmMessage="Xóa liên hệ này?" label="Xóa liên hệ" />
        </div>
      </GlassCard>
    </div>
  )
}
