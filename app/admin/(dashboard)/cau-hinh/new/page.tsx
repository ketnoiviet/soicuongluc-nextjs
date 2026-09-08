import ActionForm from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import PageHeader from '@/app/admin/_components/PageHeader'
import { createCauHinhAction } from '../actions'

const inputCls =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'
const labelCls = 'block text-sm font-medium text-slate-700 mb-1'

export default function NewCauHinhPage() {
  return (
    <div>
      <PageHeader title="Thêm cấu hình" />
      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-xl">
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
      </div>
    </div>
  )
}
