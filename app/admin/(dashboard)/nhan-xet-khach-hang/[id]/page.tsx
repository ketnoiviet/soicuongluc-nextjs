import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import NhanXetForm from '../Form'
import { updateNhanXetAction } from '../actions'

export default async function EditNhanXetPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id)
  const item = await prisma.testimonial.findUnique({ where: { id } })
  if (!item) notFound()

  const action = updateNhanXetAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa nhận xét: ${item.customerName}`} backHref="/admin/nhan-xet-khach-hang" />
      <NhanXetForm item={item} action={action} />
    </div>
  )
}
