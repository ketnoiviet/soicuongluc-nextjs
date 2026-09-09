import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import FaqForm from '../Form'
import { updateFaqAction } from '../actions'

export default async function EditFaqPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const item = await prisma.faq.findUnique({ where: { id } })
  if (!item) notFound()

  const action = updateFaqAction.bind(null, id)

  return (
    <div>
      <PageHeader title="Sửa câu hỏi" backHref="/admin/hoi-dap" />
      <FaqForm item={item} action={action} />
    </div>
  )
}
