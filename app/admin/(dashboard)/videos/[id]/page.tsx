import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import VideoForm from '../Form'
import { updateVideoAction } from '../actions'

export default async function EditVideoPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id)
  const item = await prisma.video.findUnique({ where: { id } })
  if (!item) notFound()

  const action = updateVideoAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa video: ${item.title || '#' + item.id}`} backHref="/admin/videos" />
      <VideoForm item={item} action={action} />
    </div>
  )
}
