import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import SanPhamLoaiForm from '../Form'
import { createSanPhamLoaiAction } from '../actions'

export default async function NewSanPhamLoaiPage() {
  const parents = await prisma.productCategory.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <PageHeader title="Thêm danh mục sản phẩm" backHref="/admin/san-pham-loai" />
      <SanPhamLoaiForm parents={parents} action={createSanPhamLoaiAction} />
    </div>
  )
}
