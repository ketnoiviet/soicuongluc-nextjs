import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ActionForm from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import { updateCauHinhAction } from '../actions'

const inputCls =
  'w-full rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/15 dark:bg-white/5'
const labelCls = 'mb-1 block text-sm font-medium text-admin-text-2'
const cardTitleCls = 'mb-4 font-bold text-admin-text'

export default async function EditCauHinhPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const item = await prisma.siteSetting.findUnique({ where: { id } })
  if (!item) notFound()

  const action = updateCauHinhAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa cấu hình: ${item.key}`} backHref="/admin/cau-hinh" />
      <div className="max-w-xl">
        <GlassCard className="p-5 md:p-6">
          <h2 className={cardTitleCls}>Thông tin cấu hình</h2>
          <ActionForm action={action}>
            <div>
              <label className={labelCls}>Khóa (key)</label>
              <input value={item.key} disabled className={`${inputCls} text-admin-text-3`} />
            </div>
            <div>
              <label className={labelCls}>Giá trị</label>
              <textarea name="value" defaultValue={item.value || ''} rows={3} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Ghi chú</label>
              <input name="description" defaultValue={item.description || ''} className={inputCls} />
            </div>
            <SubmitButton>Lưu thay đổi</SubmitButton>
          </ActionForm>
        </GlassCard>
      </div>
    </div>
  )
}
