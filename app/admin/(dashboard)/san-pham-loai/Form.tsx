import Image from 'next/image'
import ActionForm, { type ActionState } from '@/app/admin/_components/ActionForm'
import RichTextEditor from '@/app/admin/_components/RichTextEditor'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import { getImageUrl } from '@/lib/utils'
import { CONTENT_STATUSES, CONTENT_STATUS_LABELS } from '@/lib/enums'
import type { ProductCategory } from '@prisma/client'

const inputCls =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'
const labelCls = 'block text-sm font-medium text-slate-700 mb-1'

export default function SanPhamLoaiForm({
  item,
  parents,
  action,
}: {
  item?: ProductCategory
  parents: ProductCategory[]
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}) {
  return (
    <ActionForm action={action}>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className={labelCls}>Tên danh mục *</label>
            <input name="name" defaultValue={item?.name || ''} required className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Đường dẫn (slug)</label>
              <input name="slug" defaultValue={item?.slug || ''} placeholder="tu-dong-tao-neu-de-trong" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Thứ tự hiển thị</label>
              <input type="number" name="sortOrder" defaultValue={item?.sortOrder ?? 0} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Danh mục cha</label>
            <select name="parentId" defaultValue={item?.parentId ?? ''} className={inputCls}>
              <option value="">— Không có (danh mục gốc) —</option>
              {parents
                .filter((p) => p.id !== item?.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Tóm tắt</label>
            <textarea name="shortDescription" defaultValue={item?.shortDescription || ''} rows={2} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Nội dung / mô tả chi tiết</label>
            <RichTextEditor name="descriptionHtml" defaultValue={item?.descriptionHtml} height={320} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>Hình ảnh đại diện</label>
            {item?.imageUrl && (
              <div className="w-full aspect-video relative rounded-lg overflow-hidden bg-slate-100 mb-2">
                <Image src={getImageUrl(item.imageUrl)} alt="" fill className="object-cover" sizes="300px" />
              </div>
            )}
            <input type="file" name="imageUrl" accept="image/*" className="text-sm" />
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

          <SubmitButton className="w-full bg-primary text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity">
            {item ? 'Lưu thay đổi' : 'Tạo danh mục'}
          </SubmitButton>
        </div>
      </div>
    </ActionForm>
  )
}
