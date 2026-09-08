import Image from 'next/image'
import ActionForm, { type ActionState } from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import RichTextEditor from '@/app/admin/_components/RichTextEditor'
import GlassCard from '@/app/admin/_components/GlassCard'
import ToggleField from '@/app/admin/_components/ToggleField'
import { getImageUrl } from '@/lib/utils'
import { CONTENT_STATUSES, CONTENT_STATUS_LABELS } from '@/lib/enums'
import type { Product, ProductCategory } from '@prisma/client'

const inputCls =
  'w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5'
const labelCls = 'mb-1 block text-sm font-medium text-admin-text-2'
const cardTitleCls = 'mb-4 font-bold text-admin-text'

export default function SanPhamForm({
  item,
  categories,
  action,
}: {
  item?: Product
  categories: ProductCategory[]
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}) {
  return (
    <ActionForm action={action}>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <GlassCard className="p-5 md:p-6">
            <h2 className={cardTitleCls}>Thông tin cơ bản</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Tên sản phẩm *</label>
                <input name="name" defaultValue={item?.name || ''} required className={inputCls} placeholder="VD: Sợi polyester cường lực 1200D" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Danh mục *</label>
                  <select name="categoryId" defaultValue={item?.categoryId ?? ''} required className={inputCls}>
                    <option value="">— Chọn danh mục —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Mã sản phẩm (SKU)</label>
                  <input name="sku" defaultValue={item?.sku || ''} placeholder="VD: SC-0142" className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Đường dẫn (slug)</label>
                  <input name="slug" defaultValue={item?.slug || ''} placeholder="tự động nếu để trống" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Thứ tự hiển thị</label>
                  <input type="number" name="sortOrder" defaultValue={item?.sortOrder ?? 0} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Nhà sản xuất</label>
                <input name="manufacturer" defaultValue={item?.manufacturer || ''} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Mô tả ngắn</label>
                <textarea
                  name="shortDescription"
                  defaultValue={item?.shortDescription || ''}
                  rows={2}
                  placeholder="Mô tả ngắn gọn hiển thị ở danh sách sản phẩm..."
                  className={inputCls}
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 md:p-6">
            <h2 className={cardTitleCls}>Mô tả chi tiết</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Nội dung chi tiết</label>
                <RichTextEditor name="descriptionHtml" defaultValue={item?.descriptionHtml} height={320} />
              </div>
              <div>
                <label className={labelCls}>Thông số kỹ thuật</label>
                <RichTextEditor name="specificationsHtml" defaultValue={item?.specificationsHtml} height={240} />
              </div>
              <div>
                <label className={labelCls}>Ứng dụng</label>
                <RichTextEditor name="applicationsHtml" defaultValue={item?.applicationsHtml} height={240} />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-5">
          <GlassCard className="p-5 md:p-6">
            <h2 className={cardTitleCls}>Ảnh sản phẩm</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Ảnh nhỏ (thumbnail)</label>
                {item?.thumbnailUrl && (
                  <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-admin-sm bg-admin-text-3/10">
                    <Image src={getImageUrl(item.thumbnailUrl)} alt="" fill className="object-cover" sizes="200px" />
                  </div>
                )}
                <input type="file" name="thumbnailUrl" accept="image/*" className="text-sm text-admin-text-2 file:mr-3 file:rounded-admin-sm file:border-0 file:bg-admin-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-admin-primary" />
              </div>
              <div>
                <label className={labelCls}>Ảnh lớn (chi tiết)</label>
                {item?.coverImageUrl && (
                  <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-admin-sm bg-admin-text-3/10">
                    <Image src={getImageUrl(item.coverImageUrl)} alt="" fill className="object-cover" sizes="300px" />
                  </div>
                )}
                <input type="file" name="coverImageUrl" accept="image/*" className="text-sm text-admin-text-2 file:mr-3 file:rounded-admin-sm file:border-0 file:bg-admin-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-admin-primary" />
                <p className="mt-1 text-xs text-admin-text-3">Nếu bỏ trống, sẽ dùng ảnh nhỏ.</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 md:p-6">
            <h2 className={cardTitleCls}>Giá & đơn vị tính</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Giá</label>
                  <input type="number" step="0.01" name="price" defaultValue={item?.price ?? ''} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Giá KM</label>
                  <input type="number" step="0.01" name="salePrice" defaultValue={item?.salePrice ?? ''} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Đơn vị tính</label>
                <input name="unit" defaultValue={item?.unit || ''} placeholder="kg, cuộn, m..." className={inputCls} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 md:p-6">
            <h2 className={cardTitleCls}>Trạng thái & hiển thị</h2>
            <div className="space-y-4">
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
              <div className="divide-y divide-admin-border/10">
                <ToggleField name="isFeatured" label="Sản phẩm nổi bật" description="Ghim ở trang chủ" defaultChecked={item?.isFeatured} />
                <ToggleField name="isNew" label="Sản phẩm mới" defaultChecked={item?.isNew} />
                <ToggleField name="isOnSale" label="Đang khuyến mãi" defaultChecked={item?.isOnSale} />
              </div>
            </div>
          </GlassCard>

          <SubmitButton className="admin-gradient w-full rounded-admin-md py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgb(var(--admin-primary)/0.6)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60">
            {item ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
          </SubmitButton>
        </div>
      </div>
    </ActionForm>
  )
}
