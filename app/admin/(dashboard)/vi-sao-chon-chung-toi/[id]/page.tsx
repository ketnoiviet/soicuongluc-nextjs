import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import VisaoForm from '../Form'
import { updateVisaoAction } from '../actions'

export default async function EditVisaoPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id)
  const item = await prisma.whyChooseUsItem.findUnique({ where: { id } })
  if (!item) notFound()

  const action = updateVisaoAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa mục: ${item.title}`} backHref="/admin/vi-sao-chon-chung-toi" />
      <VisaoForm item={item} action={action} />
    </div>
  )
}
