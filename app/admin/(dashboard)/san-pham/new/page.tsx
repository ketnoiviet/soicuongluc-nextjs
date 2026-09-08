import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import SanPhamForm from '../Form'
import { createSanPhamAction } from '../actions'

export default async function NewSanPhamPage() {
  const categories = await prisma.productCategory.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <PageHeader title="Thêm sản phẩm mới" backHref="/admin/san-pham" />
      <SanPhamForm categories={categories} action={createSanPhamAction} />
    </div>
  )
}
