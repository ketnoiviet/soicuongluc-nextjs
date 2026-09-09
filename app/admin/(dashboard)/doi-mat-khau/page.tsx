import ActionForm from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import { changeOwnPasswordAction } from '../nguoi-dung/actions'
import { MIN_PASSWORD_LENGTH } from '@/lib/constants'

const inputCls =
  'w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5'
const labelCls = 'mb-1 block text-sm font-medium text-admin-text-2'
const cardTitleCls = 'mb-4 font-bold text-admin-text'

export default function DoiMatKhauPage() {
  return (
    <div>
      <PageHeader title="Đổi mật khẩu" description="Đổi mật khẩu đăng nhập cho tài khoản của bạn" />
      <div className="max-w-md">
        <GlassCard className="p-5 md:p-6">
          <h2 className={cardTitleCls}>Mật khẩu mới</h2>
          <ActionForm action={changeOwnPasswordAction}>
            <div>
              <label className={labelCls}>Mật khẩu hiện tại *</label>
              <input type="password" name="currentPassword" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Mật khẩu mới *</label>
              <input type="password" name="newPassword" required minLength={MIN_PASSWORD_LENGTH} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Xác nhận mật khẩu mới *</label>
              <input type="password" name="confirmPassword" required minLength={MIN_PASSWORD_LENGTH} className={inputCls} />
            </div>
            <SubmitButton>Đổi mật khẩu</SubmitButton>
          </ActionForm>
        </GlassCard>
      </div>
    </div>
  )
}
