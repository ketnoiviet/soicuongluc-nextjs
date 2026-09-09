import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import BaiVietLoaiForm from '../Form'
import { createBaiVietLoaiAction } from '../actions'

export default async function NewBaiVietLoaiPage() {
  const parents = await prisma.newsCategory.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <PageHeader title="Thêm danh mục tin tức" backHref="/admin/bai-viet-loai" />
      <BaiVietLoaiForm parents={parents} action={createBaiVietLoaiAction} />
    </div>
  )
}
