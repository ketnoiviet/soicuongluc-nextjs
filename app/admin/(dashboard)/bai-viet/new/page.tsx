import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import BaiVietForm from '../Form'
import { createBaiVietAction } from '../actions'

export default async function NewBaiVietPage() {
  const categories = await prisma.newsCategory.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <PageHeader title="Thêm bài viết" />
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <BaiVietForm categories={categories} action={createBaiVietAction} />
      </div>
    </div>
  )
}
