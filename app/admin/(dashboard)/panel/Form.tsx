import Image from 'next/image'
import ActionForm, { type ActionState } from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import GlassCard from '@/app/admin/_components/GlassCard'
import AdminSelect from '@/app/admin/_components/AdminSelect'
import { getImageUrl } from '@/lib/utils'
import { CONTENT_STATUSES, CONTENT_STATUS_LABELS } from '@/lib/enums'
import type { AdPanel } from '@prisma/client'

const inputCls =
  'w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5'
const labelCls = 'mb-1 block text-sm font-medium text-admin-text-2'
const cardTitleCls = 'mb-4 font-bold text-admin-text'

export default function PanelForm({
  item,
  action,
}: {
  item?: AdPanel
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}) {
  return (
    <ActionForm action={action} className="max-w-xl space-y-5">
      <GlassCard className="p-5 md:p-6">
        <h2 className={cardTitleCls}>Thông tin panel</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Ảnh panel {!item && '*'}</label>
            {item?.imageUrl && (
              <div className="relative mb-2 aspect-square w-40 overflow-hidden rounded-admin-sm bg-admin-text-3/10">
                <Image src={getImageUrl(item.imageUrl)} alt="" fill className="object-cover" sizes="160px" />
              </div>
            )}
            <input
              type="file"
              name="anh"
              accept="image/*"
              required={!item}
              className="text-sm text-admin-text-2 file:mr-3 file:rounded-admin-sm file:border-0 file:bg-admin-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-admin-primary"
            />
          </div>
          <div>
            <label className={labelCls}>Link khi click vào panel</label>
            <input name="linkUrl" defaultValue={item?.linkUrl || ''} className={inputCls} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Chiều rộng (px)</label>
              <input type="number" name="widthPx" defaultValue={item?.widthPx ?? ''} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Chiều cao (px)</label>
              <input type="number" name="heightPx" defaultValue={item?.heightPx ?? ''} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Thứ tự</label>
              <input type="number" name="sortOrder" defaultValue={item?.sortOrder ?? 0} className={inputCls} />
            </div>
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
      <SubmitButton>{item ? 'Lưu thay đổi' : 'Thêm panel'}</SubmitButton>
    </ActionForm>
  )
}
