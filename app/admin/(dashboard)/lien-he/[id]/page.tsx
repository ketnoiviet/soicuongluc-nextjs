import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
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
      <PageHeader title="Chi tiết liên hệ" />

      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{item.fullName || 'Khách hàng'}</h2>
            <p className="text-sm text-slate-400">{formatDate(item.createdAt)}</p>
          </div>
          <StatusToggle currentStatus={item.status as ContactStatus} onToggle={setLienHeStatusAction.bind(null, item.id)} />
        </div>

        <dl className="grid grid-cols-2 gap-4 mb-5 text-sm">
          <div>
            <dt className="text-slate-400">Email</dt>
            <dd className="text-slate-800">{item.email || '—'}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Điện thoại</dt>
            <dd className="text-slate-800">{item.phoneNumber || '—'}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-slate-400">Địa chỉ</dt>
            <dd className="text-slate-800">{item.address || '—'}</dd>
          </div>
        </dl>

        <div className="mb-5">
          <p className="text-slate-400 text-sm mb-1">Tiêu đề</p>
          <p className="text-slate-800 font-medium">{item.subject || '—'}</p>
        </div>

        <div className="mb-6">
          <p className="text-slate-400 text-sm mb-1">Nội dung</p>
          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{item.message || '—'}</p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <Link href="/admin/lien-he" className="text-sm text-slate-500 hover:text-slate-700">
            ← Quay lại danh sách
          </Link>
          <DeleteAndGoBack action={boundDelete} redirectTo="/admin/lien-he" confirmMessage="Xóa liên hệ này?" label="Xóa liên hệ" />
        </div>
      </div>
    </div>
  )
}
