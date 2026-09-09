import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentAdminUser } from '@/lib/auth'
import { canManageRole, manageableRoles, parsePermissions } from '@/lib/permissions'
import { ADMIN_ROLE_LABELS, type AdminRole } from '@/lib/enums'
import { MIN_PASSWORD_LENGTH } from '@/lib/constants'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import AdminSelect from '@/app/admin/_components/AdminSelect'
import ActionForm from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import PermissionsEditor from './PermissionsEditor'
import { updateNguoiDungAction } from '../actions'

const inputCls =
  'w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5'
const labelCls = 'mb-1 block text-sm font-medium text-admin-text-2'
const cardTitleCls = 'mb-4 font-bold text-admin-text'

export default async function EditNguoiDungPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id)
  const viewer = await getCurrentAdminUser()
  if (!viewer) redirect('/admin/login')
  // Tự sửa quyền/vai trò của chính mình qua trang này dễ dẫn tới tự khoá nhầm quyền
  // của mình - đổi mật khẩu của chính mình đã có trang riêng (Đổi mật khẩu).
  if (id === viewer.id) redirect('/admin/doi-mat-khau')

  const target = await prisma.adminUser.findUnique({ where: { id } })
  if (!target || !canManageRole(viewer.role as AdminRole, target.role as AdminRole)) notFound()

  const roles = manageableRoles(viewer.role as AdminRole)
  const action = updateNguoiDungAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa tài khoản: ${target.email}`} backHref="/admin/nguoi-dung" />
      <ActionForm action={action}>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <GlassCard className="p-5 md:p-6">
              <h2 className={cardTitleCls}>Đặt lại mật khẩu</h2>
              <div>
                <label className={labelCls}>Mật khẩu mới</label>
                <input type="password" name="password" minLength={MIN_PASSWORD_LENGTH} placeholder="Để trống nếu không đổi" className={inputCls} />
                <p className="mt-1 text-xs text-admin-text-3">Tối thiểu {MIN_PASSWORD_LENGTH} ký tự. Bỏ trống để giữ nguyên mật khẩu hiện tại.</p>
              </div>
            </GlassCard>

            <GlassCard className="p-5 md:p-6">
              <h2 className={cardTitleCls}>Vai trò</h2>
              <AdminSelect name="role" defaultValue={target.role} className={inputCls}>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {ADMIN_ROLE_LABELS[r]}
                  </option>
                ))}
              </AdminSelect>
            </GlassCard>
          </div>

          <div className="space-y-5">
            <GlassCard className="p-5 md:p-6">
              <h2 className={cardTitleCls}>Chức năng được phép truy cập</h2>
              <PermissionsEditor defaultAllowed={parsePermissions(target.permissions)} />
            </GlassCard>
            <SubmitButton>Lưu thay đổi</SubmitButton>
          </div>
        </div>
      </ActionForm>
    </div>
  )
}
