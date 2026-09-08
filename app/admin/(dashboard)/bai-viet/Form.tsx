import Image from 'next/image'
import ActionForm, { type ActionState } from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import RichTextEditor from '@/app/admin/_components/RichTextEditor'
import { getImageUrl } from '@/lib/utils'
import { CONTENT_STATUSES, CONTENT_STATUS_LABELS } from '@/lib/enums'
import type { NewsArticle, NewsCategory } from '@prisma/client'

const inputCls =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'
const labelCls = 'block text-sm font-medium text-slate-700 mb-1'

function toDateInputValue(d?: Date | null) {
  if (!d) return ''
  const date = new Date(d)
  return date.toISOString().slice(0, 10)
}

export default function BaiVietForm({
  item,
  categories,
  action,
}: {
  item?: NewsArticle
  categories: NewsCategory[]
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}) {
  return (
    <ActionForm action={action}>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className={labelCls}>Tiêu đề *</label>
            <input name="title" defaultValue={item?.title || ''} required className={inputCls} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Danh mục</label>
              <select name="categoryId" defaultValue={item?.categoryId ?? ''} className={inputCls}>
                <option value="">— Chọn danh mục —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Đường dẫn (slug)</label>
              <input name="slug" defaultValue={item?.slug || ''} placeholder="tự động nếu để trống" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Ngày đăng</label>
              <input type="date" name="publishedAt" defaultValue={toDateInputValue(item?.publishedAt)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Tóm tắt</label>
            <textarea name="excerpt" defaultValue={item?.excerpt || ''} rows={2} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Nội dung</label>
            <RichTextEditor name="contentHtml" defaultValue={item?.contentHtml} height={400} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tác giả</label>
              <input name="author" defaultValue={item?.author || ''} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>URL video (nếu có)</label>
              <input name="videoUrl" defaultValue={item?.videoUrl || ''} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>Ảnh nhỏ (thumbnail)</label>
            {item?.thumbnailUrl && (
              <div className="w-full aspect-video relative rounded-lg overflow-hidden bg-slate-100 mb-2">
                <Image src={getImageUrl(item.thumbnailUrl)} alt="" fill className="object-cover" sizes="300px" />
              </div>
            )}
            <input type="file" name="thumbnailUrl" accept="image/*" className="text-sm" />
          </div>
          <div>
            <label className={labelCls}>Ảnh lớn (chi tiết)</label>
            {item?.coverImageUrl && (
              <div className="w-full aspect-video relative rounded-lg overflow-hidden bg-slate-100 mb-2">
                <Image src={getImageUrl(item.coverImageUrl)} alt="" fill className="object-cover" sizes="300px" />
              </div>
            )}
            <input type="file" name="coverImageUrl" accept="image/*" className="text-sm" />
            <p className="text-xs text-slate-400 mt-1">Nếu bỏ trống, sẽ dùng ảnh nhỏ.</p>
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
            {item ? 'Lưu thay đổi' : 'Đăng bài viết'}
          </SubmitButton>
        </div>
      </div>
    </ActionForm>
  )
}
