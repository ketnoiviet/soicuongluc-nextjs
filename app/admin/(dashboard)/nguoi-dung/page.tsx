import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getCurrentAdminUser } from '@/lib/auth'
import { manageableRoles, parsePermissions } from '@/lib/permissions'
import { formatDate } from '@/lib/utils'
import { ADMIN_ROLE_LABELS, type AdminRole } from '@/lib/enums'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import StatusBadge from '@/app/admin/_components/StatusBadge'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import ActiveToggle from './ActiveToggle'
import { deleteNguoiDungAction, toggleNguoiDungActiveAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function NguoiDungListPage() {
  const viewer = await getCurrentAdminUser()
  if (!viewer) redirect('/admin/login')

  // rank(target) <= rank(viewer): admin thường không thấy superadmin trong danh sách
  // này, user thường không thấy admin/superadmin - không chỉ ẩn nút thao tác.
  const visibleRoles = manageableRoles(viewer.role as AdminRole)
  const items = await prisma.adminUser.findMany({ where: { role: { in: visibleRoles } }, orderBy: { id: 'asc' } })

  return (
    <div>
      <PageHeader
        title="Tài khoản quản trị"
        description={`${items.length} tài khoản`}
        actionHref="/admin/nguoi-dung/new"
        actionLabel="Thêm tài khoản"
      />

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/12 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Họ tên</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Email</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Vai trò</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Quyền truy cập</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Đăng nhập cuối</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/10">
              {items.map((item) => {
                const isSelf = item.id === viewer.id
                const allowed = parsePermissions(item.permissions)
                return (
                  <tr key={item.id} className="transition-colors hover:bg-admin-primary/5">
                    <td className="px-4 py-2.5 font-semibold text-admin-text">
                      {item.fullName || '—'} {isSelf && <span className="text-xs text-admin-primary">(bạn)</span>}
                    </td>
                    <td className="px-4 py-2.5 text-admin-text-2">{item.email}</td>
                    <td className="px-4 py-2.5 text-admin-text-2">{ADMIN_ROLE_LABELS[item.role as AdminRole] || item.role}</td>
                    <td className="px-4 py-2.5">
                      {item.role === 'SUPERADMIN' || allowed === null ? (
                        <StatusBadge variant="primary">Toàn quyền</StatusBadge>
                      ) : (
                        <StatusBadge variant="muted">{allowed.length} trang</StatusBadge>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-admin-text-3">{item.lastLoginAt ? formatDate(item.lastLoginAt) : 'Chưa đăng nhập'}</td>
                    <td className="px-4 py-2.5">
                      <ActiveToggle active={item.isActive} onToggle={toggleNguoiDungActiveAction.bind(null, item.id)} />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex justify-end gap-2">
                        {!isSelf && (
                          <>
                            <Link
                              href={`/admin/nguoi-dung/${item.id}`}
                              className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                            >
                              <Pencil className="size-3.5" />
                            </Link>
                            <ConfirmDeleteButton
                              action={deleteNguoiDungAction.bind(null, item.id)}
                              confirmMessage={`Xóa tài khoản "${item.email}"?`}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
