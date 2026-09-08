import ActionForm from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import PageHeader from '@/app/admin/_components/PageHeader'
import { changeOwnPasswordAction } from '../nguoi-dung/actions'

const inputCls =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'
const labelCls = 'block text-sm font-medium text-slate-700 mb-1'

export default function DoiMatKhauPage() {
  return (
    <div>
      <PageHeader title="Đổi mật khẩu" description="Đổi mật khẩu đăng nhập cho tài khoản của bạn" />
      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-md">
        <ActionForm action={changeOwnPasswordAction}>
          <div>
            <label className={labelCls}>Mật khẩu hiện tại *</label>
            <input type="password" name="currentPassword" required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Mật khẩu mới *</label>
            <input type="password" name="newPassword" required minLength={6} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Xác nhận mật khẩu mới *</label>
            <input type="password" name="confirmPassword" required minLength={6} className={inputCls} />
          </div>
          <SubmitButton>Đổi mật khẩu</SubmitButton>
        </ActionForm>
      </div>
    </div>
  )
}
