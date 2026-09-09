import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
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

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/12 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Khóa (key)</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Giá trị</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Ghi chú</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/10">
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-admin-primary/5">
                  <td className="px-4 py-2.5">
                    <code className="rounded bg-admin-text-3/10 px-1.5 py-0.5 text-xs text-admin-text-2">{item.key}</code>
                  </td>
                  <td className="max-w-md truncate px-4 py-2.5 text-admin-text-2">{item.value || '—'}</td>
                  <td className="px-4 py-2.5 text-admin-text-3">{item.description || '—'}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/cau-hinh/${item.id}`}
                        className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                      >
                        <Pencil className="size-3.5" />
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
                  <td colSpan={4} className="px-4 py-10 text-center text-admin-text-3">
                    Chưa có cấu hình nào.
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
