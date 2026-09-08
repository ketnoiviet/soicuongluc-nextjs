import Image from 'next/image'
import ActionForm, { type ActionState } from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import { getImageUrl } from '@/lib/utils'
import type { BannerSlide } from '@prisma/client'

const inputCls =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'
const labelCls = 'block text-sm font-medium text-slate-700 mb-1'

export default function BannerSlideForm({
  item,
  action,
}: {
  item?: BannerSlide
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}) {
  return (
    <ActionForm action={action} className="max-w-xl space-y-4">
      <div>
        <label className={labelCls}>Ảnh banner {!item && '*'}</label>
        {item?.imageUrl && (
          <div className="w-full aspect-[16/7] relative rounded-lg overflow-hidden bg-slate-100 mb-2">
            <Image src={getImageUrl(item.imageUrl)} alt="" fill className="object-cover" sizes="500px" />
          </div>
        )}
        <input type="file" name="anh" accept="image/*" required={!item} className="text-sm" />
        <p className="text-xs text-slate-400 mt-1">Khuyến nghị tỉ lệ ngang (vd 1920x800px) để hiển thị đẹp trên slider.</p>
      </div>
      <div>
        <label className={labelCls}>Link khi click vào banner</label>
        <input name="linkUrl" defaultValue={item?.linkUrl || ''} placeholder="/san-pham/soi-polyester-cuong-luc" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Tiêu đề / tóm tắt (alt text)</label>
        <input name="caption" defaultValue={item?.caption || ''} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Thứ tự hiển thị</label>
        <input type="number" name="sortOrder" defaultValue={item?.sortOrder ?? 0} className={inputCls} />
      </div>
      <SubmitButton>{item ? 'Lưu thay đổi' : 'Thêm banner'}</SubmitButton>
    </ActionForm>
  )
}
