import ActionForm, { type ActionState } from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import GlassCard from '@/app/admin/_components/GlassCard'
import AdminSelect from '@/app/admin/_components/AdminSelect'
import { CONTENT_STATUSES, CONTENT_STATUS_LABELS } from '@/lib/enums'
import type { GalleryAlbum } from '@prisma/client'

const inputCls =
  'w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5'
const labelCls = 'mb-1 block text-sm font-medium text-admin-text-2'
const cardTitleCls = 'mb-4 font-bold text-admin-text'

export default function AlbumForm({
  item,
  action,
}: {
  item?: GalleryAlbum
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}) {
  return (
    <ActionForm action={action} className="space-y-5">
      <GlassCard className="p-5 md:p-6">
        <h2 className={cardTitleCls}>Thông tin album</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className={labelCls}>Tên album *</label>
            <input name="title" defaultValue={item?.title || ''} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Thứ tự hiển thị</label>
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
        <SubmitButton className="admin-gradient mt-4 rounded-admin-md px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgb(var(--admin-primary)/0.6)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60">
          {item ? 'Lưu thay đổi' : 'Tạo album'}
        </SubmitButton>
      </GlassCard>
    </ActionForm>
  )
}
