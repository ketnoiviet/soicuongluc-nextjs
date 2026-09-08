import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import { ADMIN_ROLE_LABELS, type AdminRole } from '@/lib/enums'
import PageHeader from '@/app/admin/_components/PageHeader'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import ActiveToggle from './ActiveToggle'
import { deleteNguoiDungAction, toggleNguoiDungActiveAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function NguoiDungListPage() {
  const [items, session] = await Promise.all([prisma.adminUser.findMany({ orderBy: { id: 'asc' } }), getSession()])

  return (
    <div>
      <PageHeader
        title="Tài khoản quản trị"
        description={`${items.length} tài khoản`}
        actionHref="/admin/nguoi-dung/new"
        actionLabel="Thêm tài khoản"
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Họ tên</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Vai trò</th>
              <th className="px-4 py-3 font-medium">Đăng nhập cuối</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-medium text-slate-800">
                  {item.fullName || '—'} {item.id === session?.userId && <span className="text-xs text-primary">(bạn)</span>}
                </td>
                <td className="px-4 py-2.5 text-slate-500">{item.email}</td>
                <td className="px-4 py-2.5 text-slate-500">{ADMIN_ROLE_LABELS[item.role as AdminRole] || item.role}</td>
                <td className="px-4 py-2.5 text-slate-500">{item.lastLoginAt ? formatDate(item.lastLoginAt) : 'Chưa đăng nhập'}</td>
                <td className="px-4 py-2.5">
                  <ActiveToggle active={item.isActive} onToggle={toggleNguoiDungActiveAction.bind(null, item.id)} />
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex justify-end gap-2">
                    {item.id !== session?.userId && (
                      <ConfirmDeleteButton
                        action={deleteNguoiDungAction.bind(null, item.id)}
                        confirmMessage={`Xóa tài khoản "${item.email}"?`}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
