import Image from 'next/image'
import ActionForm, { type ActionState } from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import GlassCard from '@/app/admin/_components/GlassCard'
import { getImageUrl } from '@/lib/utils'
import type { BannerSlide } from '@prisma/client'

const inputCls =
  'w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5'
const labelCls = 'mb-1 block text-sm font-medium text-admin-text-2'
const cardTitleCls = 'mb-4 font-bold text-admin-text'

export default function BannerSlideForm({
  item,
  action,
}: {
  item?: BannerSlide
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}) {
  return (
    <ActionForm action={action} className="max-w-xl space-y-5">
      <GlassCard className="p-5 md:p-6">
        <h2 className={cardTitleCls}>Thông tin banner</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Ảnh banner {!item && '*'}</label>
            {item?.imageUrl && (
              <div className="relative mb-2 aspect-[16/7] w-full overflow-hidden rounded-admin-sm bg-admin-text-3/10">
                <Image src={getImageUrl(item.imageUrl)} alt="" fill className="object-cover" sizes="500px" />
              </div>
            )}
            <input
              type="file"
              name="anh"
              accept="image/*"
              required={!item}
              className="text-sm text-admin-text-2 file:mr-3 file:rounded-admin-sm file:border-0 file:bg-admin-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-admin-primary"
            />
            <p className="mt-1 text-xs text-admin-text-3">Khuyến nghị tỉ lệ ngang (vd 1920x800px) để hiển thị đẹp trên slider.</p>
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
        </div>
      </GlassCard>
      <SubmitButton>{item ? 'Lưu thay đổi' : 'Thêm banner'}</SubmitButton>
    </ActionForm>
  )
}
