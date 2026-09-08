import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate, getImageUrl } from '@/lib/utils'
import PageHeader from '@/app/admin/_components/PageHeader'
import GlassCard from '@/app/admin/_components/GlassCard'
import StatusBadge from '@/app/admin/_components/StatusBadge'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteSanPhamAction } from './actions'

export const dynamic = 'force-dynamic'

const currency = new Intl.NumberFormat('vi-VN')

export default async function SanPhamListPage({ searchParams }: { searchParams: { q?: string; loai?: string } }) {
  const q = searchParams.q?.trim() || ''
  const categoryId = searchParams.loai ? Number(searchParams.loai) : undefined

  const [items, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(q ? { name: { contains: q } } : {}),
        ...(categoryId ? { categoryId } : {}),
      },
      orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }],
      include: { category: true },
    }),
    prisma.productCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  return (
    <div>
      <PageHeader title="Sản phẩm" description={`${items.length} sản phẩm`} actionHref="/admin/san-pham/new" actionLabel="Thêm sản phẩm" />

      <GlassCard className="mb-4 flex flex-wrap items-center gap-3 p-3">
        <form className="flex flex-1 flex-wrap items-center gap-3" method="get">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Tìm sản phẩm..."
            className="h-10 w-full min-w-[180px] flex-1 rounded-admin-sm border border-admin-border/20 bg-white/70 px-3.5 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 dark:bg-white/5 sm:w-64 sm:flex-none"
          />
          <select
            name="loai"
            defaultValue={searchParams.loai || ''}
            className="h-10 rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 text-sm text-admin-text outline-none focus:border-admin-primary/50 dark:bg-white/5"
          >
            <option value="">Danh mục: Tất cả</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-10 rounded-admin-sm border border-admin-border/20 bg-white/70 px-4 text-sm font-medium text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary dark:bg-white/5"
          >
            Lọc
          </button>
          {(q || searchParams.loai) && (
            <Link href="/admin/san-pham" className="text-sm text-admin-text-3 hover:text-admin-rose">
              Xóa lọc
            </Link>
          )}
        </form>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/12 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Sản phẩm</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Danh mục</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Giá</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Nhãn</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Trạng thái</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-admin-text-3">Ngày tạo</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-admin-text-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/10">
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-admin-primary/5">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="relative size-11 shrink-0 overflow-hidden rounded-admin-sm bg-admin-text-3/10">
                        <Image src={getImageUrl(item.thumbnailUrl)} alt={item.name} fill className="object-cover" sizes="44px" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-admin-text">{item.name}</p>
                        {item.sku && <p className="truncate text-xs text-admin-text-3">SKU: {item.sku}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-admin-text-2">{item.category?.name || '—'}</td>
                  <td className="px-4 py-2.5 text-admin-text-2">{item.price ? `${currency.format(item.price)}đ` : '—'}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {item.isFeatured && <StatusBadge variant="primary">Tiêu biểu</StatusBadge>}
                      {item.isNew && <StatusBadge variant="success">Mới</StatusBadge>}
                      {item.isOnSale && <StatusBadge variant="warning">KM</StatusBadge>}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    {item.status === 'PUBLISHED' && <StatusBadge variant="success">Hiển thị</StatusBadge>}
                    {item.status === 'HIDDEN' && <StatusBadge variant="muted">Tạm ẩn</StatusBadge>}
                    {item.status === 'ARCHIVED' && <StatusBadge variant="danger">Vô hiệu hoá</StatusBadge>}
                  </td>
                  <td className="px-4 py-2.5 text-admin-text-3">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/san-pham/${item.id}`}
                        className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
                      >
                        <Pencil className="size-3.5" />
                      </Link>
                      <ConfirmDeleteButton
                        action={deleteSanPhamAction.bind(null, item.id)}
                        confirmMessage={`Xóa sản phẩm "${item.name}"?`}
                        label={<Trash2 className="size-3.5" />}
                        pendingLabel="…"
                        className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-rose/40 hover:text-admin-rose disabled:opacity-50"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-admin-text-3">
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-admin-border/12 px-4 py-3 text-xs text-admin-text-3">
          <span>Hiển thị {items.length} trên {items.length} sản phẩm</span>
        </div>
      </GlassCard>
    </div>
  )
}
