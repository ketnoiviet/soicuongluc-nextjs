import Image from 'next/image'
import ActionForm, { type ActionState } from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import { getImageUrl } from '@/lib/utils'
import { CONTENT_STATUSES, CONTENT_STATUS_LABELS } from '@/lib/enums'
import type { AdPanel } from '@prisma/client'

const inputCls =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'
const labelCls = 'block text-sm font-medium text-slate-700 mb-1'

export default function PanelForm({
  item,
  action,
}: {
  item?: AdPanel
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}) {
  return (
    <ActionForm action={action} className="max-w-xl space-y-4">
      <div>
        <label className={labelCls}>Ảnh panel {!item && '*'}</label>
        {item?.imageUrl && (
          <div className="w-40 aspect-square relative rounded-lg overflow-hidden bg-slate-100 mb-2">
            <Image src={getImageUrl(item.imageUrl)} alt="" fill className="object-cover" sizes="160px" />
          </div>
        )}
        <input type="file" name="anh" accept="image/*" required={!item} className="text-sm" />
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
        <select name="status" defaultValue={item?.status || 'PUBLISHED'} className={inputCls}>
          {CONTENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {CONTENT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <SubmitButton>{item ? 'Lưu thay đổi' : 'Thêm panel'}</SubmitButton>
    </ActionForm>
  )
}
