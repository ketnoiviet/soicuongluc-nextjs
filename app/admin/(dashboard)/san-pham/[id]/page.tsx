import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import SanPhamForm from '../Form'
import { updateSanPhamAction, deleteProductRedirectAction } from '../actions'
import ProductGallery from './ProductGallery'
import ProductDimensions from './ProductDimensions'

export default async function EditSanPhamPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id)
  const [item, categories, suppliers, images, dimensions, redirects] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.productCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.supplier.findMany({ orderBy: { name: 'asc' } }),
    prisma.productImage.findMany({ where: { productId: id }, orderBy: { sortOrder: 'asc' } }),
    prisma.productDimension.findMany({ where: { productId: id }, orderBy: { sortOrder: 'asc' } }),
    prisma.productRedirect.findMany({ where: { productId: id }, orderBy: { createdAt: 'desc' } }),
  ])
  if (!item) notFound()

  const action = updateSanPhamAction.bind(null, id)
  const deleteRedirectAction = deleteProductRedirectAction.bind(null, id)

  return (
    <div className="space-y-5">
      <div>
        <PageHeader title={`Sửa sản phẩm: ${item.name}`} backHref="/admin/san-pham" />
        <SanPhamForm
          item={item}
          categories={categories}
          suppliers={suppliers}
          action={action}
          redirects={redirects}
          deleteRedirectAction={deleteRedirectAction}
        />
      </div>

      <ProductGallery idSP={id} images={images} />
      <ProductDimensions idSP={id} dimensions={dimensions} />
    </div>
  )
}
