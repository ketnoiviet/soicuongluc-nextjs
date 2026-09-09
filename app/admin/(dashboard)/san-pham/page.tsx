import { Download } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import ProductsManager from './ProductsManager'
import ImportExcelForm from './ImportExcelForm'

export const dynamic = 'force-dynamic'

export default async function SanPhamListPage({
  searchParams,
}: {
  searchParams: { q?: string; loai?: string; trangthai?: string; nsx?: string }
}) {
  const q = searchParams.q?.trim() || ''
  const categoryId = searchParams.loai ? Number(searchParams.loai) : undefined
  const status = searchParams.trangthai || undefined
  const supplierId = searchParams.nsx ? Number(searchParams.nsx) : undefined

  const [products, categories, suppliers] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(q ? { name: { contains: q } } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(status ? { status } : {}),
        ...(supplierId ? { supplierId } : {}),
      },
      orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }],
      include: { category: true },
    }),
    prisma.productCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.supplier.findMany({ orderBy: { name: 'asc' } }),
  ])

  const items = products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    thumbnailUrl: p.thumbnailUrl,
    categoryName: p.category?.name || null,
    price: p.price,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    isOnSale: p.isOnSale,
    status: p.status,
    createdAt: p.createdAt,
  }))

  const exportParams = new URLSearchParams()
  if (q) exportParams.set('q', q)
  if (categoryId) exportParams.set('loai', String(categoryId))
  if (status) exportParams.set('trangthai', status)
  if (supplierId) exportParams.set('nsx', String(supplierId))

  return (
    <div>
      <PageHeader title="Sản phẩm" description={`${items.length} sản phẩm`} actionHref="/admin/san-pham/new" actionLabel="Thêm sản phẩm">
        <a
          href={`/api/admin/san-pham/export?${exportParams.toString()}`}
          className="flex h-10 items-center gap-1.5 rounded-admin-sm border border-admin-border/20 bg-white/70 px-4 text-sm font-medium text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary dark:bg-white/5"
        >
          <Download className="size-3.5" /> Xuất Excel
        </a>
        <ImportExcelForm />
      </PageHeader>

      <ProductsManager
        items={items}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        suppliers={suppliers.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  )
}
