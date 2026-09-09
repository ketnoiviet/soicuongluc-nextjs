import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2, Images } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import StatusBadge from '@/app/admin/_components/StatusBadge'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteAlbumAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function HinhAnhListPage() {
  const albums = await prisma.galleryAlbum.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { photos: { orderBy: { sortOrder: 'asc' }, take: 1 }, _count: { select: { photos: true } } },
  })

  return (
    <div>
      <PageHeader title="Album ảnh" description={`${albums.length} album`} actionHref="/admin/hinh-anh/new" actionLabel="Thêm album" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {albums.map((album) => (
          <GlassCard key={album.id} className="overflow-hidden p-0">
            <Link href={`/admin/hinh-anh/${album.id}`} className="relative block aspect-square w-full bg-admin-text-3/10">
              {album.photos[0] ? (
                <Image src={getImageUrl(album.photos[0].imageUrl)} alt={album.title} fill className="object-cover" sizes="250px" />
              ) : (
                <div className="flex size-full items-center justify-center text-admin-text-3">
                  <Images className="size-8" />
                </div>
              )}
            </Link>
            <div className="p-3">
              <p className="truncate text-sm font-semibold text-admin-text">{album.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-admin-text-3">{album._count.photos} ảnh • Thứ tự {album.sortOrder}</span>
              </div>
              <div className="mt-1.5">
                {album.status === 'PUBLISHED' ? (
                  <StatusBadge variant="success">Hiển thị</StatusBadge>
                ) : (
                  <StatusBadge variant="muted">Đã ẩn</StatusBadge>
                )}
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <Link
                  href={`/admin/hinh-anh/${album.id}`}
                  className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                >
                  <Pencil className="size-3.5" />
                </Link>
                <ConfirmDeleteButton
                  action={deleteAlbumAction.bind(null, album.id)}
                  confirmMessage={`Xóa album "${album.title}" và toàn bộ ${album._count.photos} ảnh bên trong?`}
                  label={<Trash2 className="size-3.5" />}
                  pendingLabel="…"
                  className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-rose/40 hover:text-admin-rose disabled:opacity-50"
                />
              </div>
            </div>
          </GlassCard>
        ))}
        {albums.length === 0 && (
          <GlassCard className="col-span-full py-10 text-center text-admin-text-3">Chưa có album ảnh nào.</GlassCard>
        )}
      </div>
    </div>
  )
}
