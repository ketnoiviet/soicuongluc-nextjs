import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import DoiTacForm from '../Form'
import { updateDoiTacAction } from '../actions'

export default async function EditDoiTacPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const item = await prisma.partner.findUnique({ where: { id } })
  if (!item) notFound()

  const action = updateDoiTacAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa: ${item.name}`} backHref="/admin/doi-tac-khach-hang" />
      <DoiTacForm item={item} action={action} />
    </div>
  )
}
