import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import BaiVietForm from '../Form'
import { createBaiVietAction } from '../actions'

export default async function NewBaiVietPage() {
  const categories = await prisma.newsCategory.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <PageHeader title="Thêm bài viết" backHref="/admin/bai-viet" />
      <BaiVietForm categories={categories} action={createBaiVietAction} />
    </div>
  )
}
