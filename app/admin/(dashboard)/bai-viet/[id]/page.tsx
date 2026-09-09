import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import BaiVietForm from '../Form'
import { updateBaiVietAction } from '../actions'

export default async function EditBaiVietPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id)
  const [item, categories] = await Promise.all([
    prisma.newsArticle.findUnique({ where: { id } }),
    prisma.newsCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])
  if (!item) notFound()

  const action = updateBaiVietAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa bài viết: ${item.title}`} backHref="/admin/bai-viet" />
      <BaiVietForm item={item} categories={categories} action={action} />
    </div>
  )
}
