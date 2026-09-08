import PageHeader from '@/app/admin/_components/PageHeader'
import BannerSlideForm from '../Form'
import { createBannerSlideAction } from '../actions'

export default function NewBannerSlidePage() {
  return (
    <div>
      <PageHeader title="Thêm banner" />
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <BannerSlideForm action={createBannerSlideAction} />
      </div>
    </div>
  )
}
