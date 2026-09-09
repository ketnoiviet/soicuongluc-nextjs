import PageHeader from '@/app/admin/_components/PageHeader'
import VideoForm from '../Form'
import { createVideoAction } from '../actions'

export default function NewVideoPage() {
  return (
    <div>
      <PageHeader title="Thêm video" backHref="/admin/videos" />
      <VideoForm action={createVideoAction} />
    </div>
  )
}
