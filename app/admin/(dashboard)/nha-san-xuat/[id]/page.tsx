import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import NhaSanXuatForm from '../Form'
import { updateNhaSanXuatAction } from '../actions'

export default async function EditNhaSanXuatPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id)
  const item = await prisma.supplier.findUnique({ where: { id } })
  if (!item) notFound()

  const action = updateNhaSanXuatAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa nhà sản xuất: ${item.name}`} backHref="/admin/nha-san-xuat" />
      <NhaSanXuatForm item={item} action={action} />
    </div>
  )
}
