import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import BaiVietForm from '../Form'
import { updateBaiVietAction } from '../actions'

export default async function EditBaiVietPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const [item, categories] = await Promise.all([
    prisma.newsArticle.findUnique({ where: { id } }),
    prisma.newsCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])
  if (!item) notFound()

  const action = updateBaiVietAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa bài viết: ${item.title}`} />
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <BaiVietForm item={item} categories={categories} action={action} />
      </div>
    </div>
  )
}
