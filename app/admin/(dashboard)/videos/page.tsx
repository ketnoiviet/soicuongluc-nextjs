import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import VideoGrid from './VideoGrid'
import { deleteVideoAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function VideosListPage() {
  const items = await prisma.video.findMany({ orderBy: { sortOrder: 'asc' } })

  const videos = items.map((v) => ({
    id: v.id,
    title: v.title,
    thumbnailUrl: v.thumbnailUrl,
    videoUrl: v.videoUrl,
    videoSource: v.videoSource,
    sortOrder: v.sortOrder,
    deleteAction: deleteVideoAction.bind(null, v.id),
  }))

  return (
    <div>
      <PageHeader title="Videos" description={`${items.length} video`} actionHref="/admin/videos/new" actionLabel="Thêm video" />
      <VideoGrid videos={videos} />
    </div>
  )
}
