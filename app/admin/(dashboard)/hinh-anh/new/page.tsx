import PageHeader from '@/app/admin/_components/PageHeader'
import AlbumForm from '../Form'
import { createAlbumAction } from '../actions'

export default function NewAlbumPage() {
  return (
    <div>
      <PageHeader title="Thêm album ảnh" backHref="/admin/hinh-anh" />
      <AlbumForm action={createAlbumAction} />
    </div>
  )
}
