import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import BannerSlideForm from '../Form'
import { updateBannerSlideAction } from '../actions'

export default async function EditBannerSlidePage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const item = await prisma.bannerSlide.findUnique({ where: { id } })
  if (!item) notFound()

  const action = updateBannerSlideAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa banner #${item.id}`} backHref="/admin/banner-slide" />
      <BannerSlideForm item={item} action={action} />
    </div>
  )
}
