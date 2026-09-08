import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import SanPhamLoaiForm from '../Form'
import { createSanPhamLoaiAction } from '../actions'

export default async function NewSanPhamLoaiPage() {
  const parents = await prisma.productCategory.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <PageHeader title="Thêm danh mục sản phẩm" />
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <SanPhamLoaiForm parents={parents} action={createSanPhamLoaiAction} />
      </div>
    </div>
  )
}
