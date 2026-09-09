import ActionForm from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import { createCauHinhAction } from '../actions'

const inputCls =
  'w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5'
const labelCls = 'mb-1 block text-sm font-medium text-admin-text-2'
const cardTitleCls = 'mb-4 font-bold text-admin-text'

export default function NewCauHinhPage() {
  return (
    <div>
      <PageHeader title="Thêm cấu hình" backHref="/admin/cau-hinh" />
      <div className="max-w-xl">
        <GlassCard className="p-5 md:p-6">
          <h2 className={cardTitleCls}>Thông tin cấu hình</h2>
          <ActionForm action={createCauHinhAction}>
            <div>
              <label className={labelCls}>Khóa (key) *</label>
              <input name="key" required placeholder="vd: hotline, email_lien_he, facebook_url" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Giá trị</label>
              <textarea name="value" rows={3} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Ghi chú</label>
              <input name="description" className={inputCls} />
            </div>
            <SubmitButton>Tạo cấu hình</SubmitButton>
          </ActionForm>
        </GlassCard>
      </div>
    </div>
  )
}
