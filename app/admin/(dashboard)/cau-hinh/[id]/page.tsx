import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ActionForm from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import PageHeader from '@/app/admin/_components/PageHeader'
import { updateCauHinhAction } from '../actions'

const inputCls =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'
const labelCls = 'block text-sm font-medium text-slate-700 mb-1'

export default async function EditCauHinhPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const item = await prisma.siteSetting.findUnique({ where: { id } })
  if (!item) notFound()

  const action = updateCauHinhAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa cấu hình: ${item.key}`} />
      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-xl">
        <ActionForm action={action}>
          <div>
            <label className={labelCls}>Khóa (key)</label>
            <input value={item.key} disabled className={`${inputCls} bg-slate-50 text-slate-400`} />
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
      </div>
    </div>
  )
}
