import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import SanPhamLoaiForm from '../Form'
import { updateSanPhamLoaiAction } from '../actions'

export default async function EditSanPhamLoaiPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const [item, parents] = await Promise.all([
    prisma.productCategory.findUnique({ where: { id } }),
    prisma.productCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])
  if (!item) notFound()

  const action = updateSanPhamLoaiAction.bind(null, id)

  return (
    <div>
      <PageHeader title={`Sửa danh mục: ${item.name}`} backHref="/admin/san-pham-loai" />
      <SanPhamLoaiForm item={item} parents={parents} action={action} />
    </div>
  )
}
