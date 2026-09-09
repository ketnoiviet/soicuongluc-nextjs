import Image from 'next/image'
import ActionForm, { type ActionState } from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import GlassCard from '@/app/admin/_components/GlassCard'
import AdminSelect from '@/app/admin/_components/AdminSelect'
import { getImageUrl } from '@/lib/utils'
import { CONTENT_STATUSES, CONTENT_STATUS_LABELS } from '@/lib/enums'
import type { Testimonial } from '@prisma/client'

const inputCls =
  'w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5'
const labelCls = 'mb-1 block text-sm font-medium text-admin-text-2'
const cardTitleCls = 'mb-4 font-bold text-admin-text'

export default function NhanXetForm({
  item,
  action,
}: {
  item?: Testimonial
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}) {
  return (
    <ActionForm action={action} className="grid gap-5 md:grid-cols-3">
      <div className="space-y-5 md:col-span-2">
        <GlassCard className="p-5 md:p-6">
          <h2 className={cardTitleCls}>Thông tin khách hàng</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Tên khách hàng *</label>
                <input name="customerName" defaultValue={item?.customerName || ''} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Chức vụ / Công ty</label>
                <input name="position" defaultValue={item?.position || ''} placeholder="VD: Giám đốc mua hàng, Công ty ABC" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Nội dung nhận xét</label>
              <textarea name="content" defaultValue={item?.content || ''} rows={5} className={inputCls} />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-5">
        <GlassCard className="p-5 md:p-6">
          <h2 className={cardTitleCls}>Ảnh đại diện</h2>
          <div>
            {item?.avatarUrl && (
              <div className="relative mb-2 size-20 overflow-hidden rounded-full bg-admin-text-3/10">
                <Image src={getImageUrl(item.avatarUrl)} alt="" fill className="object-cover" sizes="80px" />
              </div>
            )}
            <input
              type="file"
              name="avatarUrl"
              accept="image/*"
              className="text-sm text-admin-text-2 file:mr-3 file:rounded-admin-sm file:border-0 file:bg-admin-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-admin-primary"
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5 md:p-6">
          <h2 className={cardTitleCls}>Đánh giá & hiển thị</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Số sao (1-5)</label>
              <AdminSelect name="rating" defaultValue={item?.rating ?? 5} className={inputCls}>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {'★'.repeat(r) + '☆'.repeat(5 - r)}
                  </option>
                ))}
              </AdminSelect>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
          </div>
        </GlassCard>

        <SubmitButton className="admin-gradient w-full rounded-admin-md py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgb(var(--admin-primary)/0.6)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60">
          {item ? 'Lưu thay đổi' : 'Thêm nhận xét'}
        </SubmitButton>
      </div>
    </ActionForm>
  )
}
