import { redirect } from 'next/navigation'
import ActionForm from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import AdminSelect from '@/app/admin/_components/AdminSelect'
import { getCurrentAdminUser } from '@/lib/auth'
import { manageableRoles } from '@/lib/permissions'
import { ADMIN_ROLE_LABELS, type AdminRole } from '@/lib/enums'
import { MIN_PASSWORD_LENGTH } from '@/lib/constants'
import { createNguoiDungAction } from '../actions'

const inputCls =
  'w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5'
const labelCls = 'mb-1 block text-sm font-medium text-admin-text-2'
const cardTitleCls = 'mb-4 font-bold text-admin-text'

export default async function NewNguoiDungPage() {
  const viewer = await getCurrentAdminUser()
  if (!viewer) redirect('/admin/login')

  // Chỉ chào những vai trò mà viewer được phép gán - vd admin thường không thể tự tạo
  // ra 1 tài khoản superadmin khác (xem canManageRole trong createNguoiDungAction).
  const roles = manageableRoles(viewer.role as AdminRole)

  return (
    <div>
      <PageHeader title="Thêm tài khoản quản trị" backHref="/admin/nguoi-dung" />
      <div className="max-w-xl">
        <GlassCard className="p-5 md:p-6">
          <h2 className={cardTitleCls}>Thông tin tài khoản</h2>
          <ActionForm action={createNguoiDungAction}>
            <div>
              <label className={labelCls}>Họ tên</label>
              <input name="fullName" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input type="email" name="email" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Mật khẩu *</label>
              <input type="password" name="password" required minLength={MIN_PASSWORD_LENGTH} className={inputCls} />
              <p className="mt-1 text-xs text-admin-text-3">Tối thiểu {MIN_PASSWORD_LENGTH} ký tự.</p>
            </div>
            <div>
              <label className={labelCls}>Vai trò</label>
              <AdminSelect name="role" defaultValue="EDITOR" className={inputCls}>
                {roles.map((r: AdminRole) => (
                  <option key={r} value={r}>
                    {ADMIN_ROLE_LABELS[r]}
                  </option>
                ))}
              </AdminSelect>
              <p className="mt-1 text-xs text-admin-text-3">
                Sau khi tạo, vào &quot;Sửa&quot; trên danh sách để chọn các trang quản trị tài khoản này được phép truy cập.
              </p>
            </div>
            <SubmitButton>Tạo tài khoản</SubmitButton>
          </ActionForm>
        </GlassCard>
      </div>
    </div>
  )
}
