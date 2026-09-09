import PageHeader from '@/app/admin/_components/PageHeader'
import BannerSlideForm from '../Form'
import { createBannerSlideAction } from '../actions'

export default function NewBannerSlidePage() {
  return (
    <div>
      <PageHeader title="Thêm banner" backHref="/admin/banner-slide" />
      <BannerSlideForm action={createBannerSlideAction} />
    </div>
  )
}
