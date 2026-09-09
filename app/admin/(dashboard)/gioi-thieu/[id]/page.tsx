import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import GioiThieuForm from '../Form'
import { updateGioiThieuAction } from '../actions'

export default async function EditGioiThieuPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const item = await prisma.aboutArticle.findUnique({ where: { id } })
  if (!item) notFound()

  const action = updateGioiThieuAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa bài viết: ${item.title}`} backHref="/admin/gioi-thieu" />
      <GioiThieuForm item={item} action={action} />
    </div>
  )
}
