import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { stripHtml, truncate } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import StatusBadge from '@/app/admin/_components/StatusBadge'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteFaqAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function FaqListPage() {
  const items = await prisma.faq.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <PageHeader title="Hỏi đáp" description={`${items.length} câu hỏi`} actionHref="/admin/hoi-dap/new" actionLabel="Thêm câu hỏi" />

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/12 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Câu hỏi</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Câu trả lời</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thứ tự</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/10">
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-admin-primary/5">
                  <td className="max-w-sm px-4 py-2.5 font-semibold text-admin-text">{item.question}</td>
                  <td className="max-w-md truncate px-4 py-2.5 text-admin-text-2">{truncate(stripHtml(item.answerHtml || ''), 80) || '—'}</td>
                  <td className="px-4 py-2.5 text-admin-text-2">{item.sortOrder}</td>
                  <td className="px-4 py-2.5">
                    {item.status === 'PUBLISHED' ? (
                      <StatusBadge variant="success">Hiển thị</StatusBadge>
                    ) : (
                      <StatusBadge variant="muted">Đã ẩn</StatusBadge>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/hoi-dap/${item.id}`}
                        className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                      >
                        <Pencil className="size-3.5" />
                      </Link>
                      <ConfirmDeleteButton action={deleteFaqAction.bind(null, item.id)} confirmMessage={`Xóa câu hỏi "${item.question}"?`} />
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-admin-text-3">
                    Chưa có câu hỏi nào.
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
