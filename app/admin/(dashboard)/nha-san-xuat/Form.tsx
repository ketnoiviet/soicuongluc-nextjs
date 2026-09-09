import Image from 'next/image'
import ActionForm, { type ActionState } from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import RichTextEditor from '@/app/admin/_components/RichTextEditor'
import GlassCard from '@/app/admin/_components/GlassCard'
import { getImageUrl } from '@/lib/utils'
import type { Supplier } from '@prisma/client'

const inputCls =
  'w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5'
const labelCls = 'mb-1 block text-sm font-medium text-admin-text-2'
const cardTitleCls = 'mb-4 font-bold text-admin-text'

export default function NhaSanXuatForm({
  item,
  action,
}: {
  item?: Supplier
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}) {
  return (
    <ActionForm action={action}>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <GlassCard className="p-5 md:p-6">
            <h2 className={cardTitleCls}>Thông tin nhà sản xuất</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Tên nhà sản xuất *</label>
                <input name="name" defaultValue={item?.name || ''} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Website</label>
                <input name="website" type="url" defaultValue={item?.website || ''} placeholder="https://..." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Giới thiệu</label>
                <RichTextEditor name="descriptionHtml" defaultValue={item?.descriptionHtml} height={320} />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-5">
          <GlassCard className="p-5 md:p-6">
            <h2 className={cardTitleCls}>Logo</h2>
            <div>
              {item?.logoUrl && (
                <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-admin-sm bg-admin-text-3/10">
                  <Image src={getImageUrl(item.logoUrl)} alt="" fill className="object-contain" sizes="300px" />
                </div>
              )}
              <input
                type="file"
                name="logoUrl"
                accept="image/*"
                className="text-sm text-admin-text-2 file:mr-3 file:rounded-admin-sm file:border-0 file:bg-admin-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-admin-primary"
              />
              <p className="mt-1 text-xs text-admin-text-3">Tự động chuyển WebP, rộng tối đa 500px.</p>
            </div>
          </GlassCard>

          <SubmitButton className="admin-gradient w-full rounded-admin-md py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgb(var(--admin-primary)/0.6)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60">
            {item ? 'Lưu thay đổi' : 'Thêm nhà sản xuất'}
          </SubmitButton>
        </div>
      </div>
    </ActionForm>
  )
}
