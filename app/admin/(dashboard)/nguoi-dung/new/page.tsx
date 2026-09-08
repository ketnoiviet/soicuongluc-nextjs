import ActionForm from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import PageHeader from '@/app/admin/_components/PageHeader'
import { ADMIN_ROLE_LABELS } from '@/lib/enums'
import { createNguoiDungAction } from '../actions'

const inputCls =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'
const labelCls = 'block text-sm font-medium text-slate-700 mb-1'

export default function NewNguoiDungPage() {
  return (
    <div>
      <PageHeader title="Thêm tài khoản quản trị" />
      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-xl">
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
            <input type="password" name="password" required minLength={6} className={inputCls} />
            <p className="text-xs text-slate-400 mt-1">Tối thiểu 6 ký tự.</p>
          </div>
          <div>
            <label className={labelCls}>Vai trò</label>
            <select name="role" defaultValue="ADMIN" className={inputCls}>
              <option value="ADMIN">{ADMIN_ROLE_LABELS.ADMIN} (toàn quyền)</option>
              <option value="EDITOR">{ADMIN_ROLE_LABELS.EDITOR}</option>
            </select>
          </div>
          <SubmitButton>Tạo tài khoản</SubmitButton>
        </ActionForm>
      </div>
    </div>
  )
}
