import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import SanPhamForm from '../Form'
import { updateSanPhamAction } from '../actions'
import ProductGallery from './ProductGallery'
import ProductDimensions from './ProductDimensions'

export default async function EditSanPhamPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const [item, categories, images, dimensions] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.productCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.productImage.findMany({ where: { productId: id }, orderBy: { sortOrder: 'asc' } }),
    prisma.productDimension.findMany({ where: { productId: id }, orderBy: { sortOrder: 'asc' } }),
  ])
  if (!item) notFound()

  const action = updateSanPhamAction.bind(null, id)

  return (
    <div className="space-y-5">
      <div>
        <PageHeader title={`Sửa sản phẩm: ${item.name}`} backHref="/admin/san-pham" />
        <SanPhamForm item={item} categories={categories} action={action} />
      </div>

      <ProductDimensions idSP={id} dimensions={dimensions} />
      <ProductGallery idSP={id} images={images} />
    </div>
  )
}
