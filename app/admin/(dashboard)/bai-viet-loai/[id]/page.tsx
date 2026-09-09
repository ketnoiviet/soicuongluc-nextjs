import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import BaiVietLoaiForm from '../Form'
import { updateBaiVietLoaiAction } from '../actions'

export default async function EditBaiVietLoaiPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const [item, parents] = await Promise.all([
    prisma.newsCategory.findUnique({ where: { id } }),
    prisma.newsCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])
  if (!item) notFound()

  const action = updateBaiVietLoaiAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa danh mục: ${item.name}`} backHref="/admin/bai-viet-loai" />
      <BaiVietLoaiForm item={item} parents={parents} action={action} />
    </div>
  )
}
