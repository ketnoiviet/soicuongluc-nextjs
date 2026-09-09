import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import GlassCard from '@/app/admin/_components/GlassCard'
import { deletePhotoAction } from '../actions'
import PhotoDeleteButton from './PhotoDeleteButton'
import PhotoUploadForm from './PhotoUploadForm'
import type { GalleryPhoto } from '@prisma/client'

export default function AlbumPhotos({ albumId, photos }: { albumId: number; photos: GalleryPhoto[] }) {
  return (
    <GlassCard className="p-5 md:p-6">
      <h2 className="mb-4 font-bold text-admin-text">Ảnh trong album ({photos.length})</h2>

      <div className="mb-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative">
            <div className="relative aspect-square w-full overflow-hidden rounded-admin-sm bg-admin-text-3/10">
              <Image
                src={getImageUrl(photo.imageUrl)}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 768px) 18vw, (min-width: 640px) 25vw, 34vw"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center rounded-admin-sm bg-black/0 opacity-0 transition-colors group-hover:bg-black/40 group-hover:opacity-100">
              <PhotoDeleteButton action={deletePhotoAction.bind(null, albumId, photo.id)} />
            </div>
          </div>
        ))}
        {photos.length === 0 && <p className="col-span-full py-2 text-sm text-admin-text-3">Chưa có ảnh nào trong album.</p>}
      </div>

      <PhotoUploadForm albumId={albumId} />
    </GlassCard>
  )
}
