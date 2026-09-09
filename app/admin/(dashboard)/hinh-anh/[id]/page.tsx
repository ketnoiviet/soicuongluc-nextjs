import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import AlbumForm from '../Form'
import { updateAlbumAction } from '../actions'
import AlbumPhotos from './AlbumPhotos'

export default async function EditAlbumPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const [item, photos] = await Promise.all([
    prisma.galleryAlbum.findUnique({ where: { id } }),
    prisma.galleryPhoto.findMany({ where: { albumId: id }, orderBy: { sortOrder: 'asc' } }),
  ])
  if (!item) notFound()

  const action = updateAlbumAction.bind(null, id)

  return (
    <div className="space-y-5">
      <div>
        <PageHeader title={`Sửa album: ${item.title}`} backHref="/admin/hinh-anh" />
        <AlbumForm item={item} action={action} />
      </div>

      <AlbumPhotos albumId={id} photos={photos} />
    </div>
  )
}
