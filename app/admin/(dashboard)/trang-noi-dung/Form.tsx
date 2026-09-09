import ActionForm, { type ActionState } from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import RichTextEditor from '@/app/admin/_components/RichTextEditor'
import GlassCard from '@/app/admin/_components/GlassCard'
import AdminSelect from '@/app/admin/_components/AdminSelect'
import { CONTENT_STATUSES, CONTENT_STATUS_LABELS } from '@/lib/enums'
import type { ContentPage } from '@prisma/client'

const inputCls =
  'w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5'
const labelCls = 'mb-1 block text-sm font-medium text-admin-text-2'
const cardTitleCls = 'mb-4 font-bold text-admin-text'

export default function TrangNoiDungForm({
  item,
  action,
}: {
  item?: ContentPage
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}) {
  return (
    <ActionForm action={action}>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <GlassCard className="p-5 md:p-6">
            <h2 className={cardTitleCls}>Nội dung</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Tiêu đề *</label>
                  <input
                    name="title"
                    defaultValue={item?.title || ''}
                    required
                    className={inputCls}
                    placeholder="VD: Chính sách bảo mật"
                  />
                </div>
                <div>
                  <label className={labelCls}>Đường dẫn (slug)</label>
                  <input name="slug" defaultValue={item?.slug || ''} placeholder="tự động nếu để trống" className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Nội dung</label>
                <RichTextEditor name="contentHtml" defaultValue={item?.contentHtml} height={420} />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-5">
          <GlassCard className="p-5 md:p-6">
            <h2 className={cardTitleCls}>Hiển thị</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Thứ tự</label>
                <input type="number" name="sortOrder" defaultValue={item?.sortOrder ?? 0} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Trạng thái</label>
                <AdminSelect name="status" defaultValue={item?.status || 'PUBLISHED'} className={inputCls}>
                  {CONTENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {CONTENT_STATUS_LABELS[s]}
                    </option>
                  ))}
                </AdminSelect>
              </div>
            </div>
          </GlassCard>

          <SubmitButton className="admin-gradient w-full rounded-admin-md py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgb(var(--admin-primary)/0.6)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60">
            {item ? 'Lưu thay đổi' : 'Tạo trang'}
          </SubmitButton>
        </div>
      </div>
    </ActionForm>
  )
}
