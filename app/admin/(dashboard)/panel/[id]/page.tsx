import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import PanelForm from '../Form'
import { updatePanelAction } from '../actions'

export default async function EditPanelPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const item = await prisma.adPanel.findUnique({ where: { id } })
  if (!item) notFound()

  const action = updatePanelAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa panel #${item.id}`} />
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <PanelForm item={item} action={action} />
      </div>
    </div>
  )
}
