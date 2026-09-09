import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import TrangNoiDungForm from '../Form'
import { updateTrangNoiDungAction } from '../actions'

export default async function EditTrangNoiDungPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id)
  const item = await prisma.contentPage.findUnique({ where: { id } })
  if (!item) notFound()

  const action = updateTrangNoiDungAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa trang: ${item.title}`} backHref="/admin/trang-noi-dung" />
      <TrangNoiDungForm item={item} action={action} />
    </div>
  )
}
