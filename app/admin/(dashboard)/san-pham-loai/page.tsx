import { prisma } from '@/lib/prisma'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import SortableCategoryList from './SortableCategoryList'

export const dynamic = 'force-dynamic'

export default async function SanPhamLoaiListPage() {
  const items = await prisma.productCategory.findMany({
    orderBy: [{ sortOrder: 'asc' }],
    include: { _count: { select: { products: true, children: true } }, parent: true },
  })

  const rows = items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    imageUrl: item.imageUrl,
    sortOrder: item.sortOrder,
    status: item.status,
    parentName: item.parent?.name || null,
    productCount: item._count.products,
  }))

  return (
    <div>
      <PageHeader
        title="Danh mục sản phẩm"
        description={`${items.length} danh mục • Bấm giữ và kéo thả để đổi thứ tự hiển thị`}
        actionHref="/admin/san-pham-loai/new"
        actionLabel="Thêm danh mục"
      />

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/12 text-left">
                <th className="w-8 px-2 py-3"></th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Ảnh</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Tên danh mục</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Danh mục cha</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Số SP</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thứ tự</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thao tác</th>
              </tr>
            </thead>
            <SortableCategoryList items={rows} />
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
