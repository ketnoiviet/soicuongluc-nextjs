'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { formatDate, getImageUrl } from '@/lib/utils'
import { CONTENT_STATUSES, CONTENT_STATUS_LABELS } from '@/lib/enums'
import GlassCard from '@/app/admin/_components/GlassCard'
import AdminSelect from '@/app/admin/_components/AdminSelect'
import StatusBadge from '@/app/admin/_components/StatusBadge'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteSanPhamAction, bulkDeleteSanPhamAction } from './actions'

const currency = new Intl.NumberFormat('vi-VN')

const selectCls =
  'h-10 w-auto rounded-admin-sm border border-admin-border/20 bg-white/70 px-3 text-sm text-admin-text outline-none focus:border-admin-primary/50 dark:bg-white/5'

type ProductRow = {
  id: number
  name: string
  sku: string | null
  thumbnailUrl: string | null
  categoryName: string | null
  price: number | null
  isFeatured: boolean
  isNew: boolean
  isOnSale: boolean
  status: string
  createdAt: Date
}

export default function ProductsManager({
  items,
  categories,
  suppliers,
}: {
  items: ProductRow[]
  categories: { id: number; name: string }[]
  suppliers: { id: number; name: string }[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [isPending, startTransition] = useTransition()

  const hasFilters = !!(searchParams.get('q') || searchParams.get('loai') || searchParams.get('trangthai') || searchParams.get('nsx'))

  // Đổi 1 tham số lọc và giữ nguyên các tham số còn lại - dùng cho các select "chọn xong
  // reload danh sách luôn" (2.1/2.2), khác input tìm kiếm text vẫn submit qua nút Lọc.
  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/admin/san-pham?${params.toString()}`)
  }

  const allSelected = items.length > 0 && selected.size === items.length
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(items.map((i) => i.id)))
  const toggleOne = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const handleBulkDelete = () => {
    if (
      !window.confirm(
        `Xóa ${selected.size} sản phẩm đã chọn? Toàn bộ hình ảnh liên quan (ảnh đại diện, ảnh trong mô tả, thư viện ảnh) sẽ bị xóa vĩnh viễn khỏi máy chủ.`
      )
    )
      return
    startTransition(async () => {
      try {
        await bulkDeleteSanPhamAction(Array.from(selected))
        setSelected(new Set())
      } catch (e) {
        window.alert(e instanceof Error ? e.message : 'Có lỗi xảy ra.')
      }
    })
  }

  return (
    <>
      <GlassCard className="mb-4 flex flex-wrap items-center gap-3 p-3">
        <form
          className="flex flex-1 flex-wrap items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value
            updateParam('q', q)
          }}
        >
          <input
            type="text"
            name="q"
            defaultValue={searchParams.get('q') || ''}
            placeholder="Tìm sản phẩm..."
            className="h-10 w-full min-w-[180px] flex-1 rounded-admin-sm border border-admin-border/20 bg-white/70 px-3.5 text-sm text-admin-text outline-none placeholder:text-admin-text-3 focus:border-admin-primary/50 dark:bg-white/5 sm:w-56 sm:flex-none"
          />
          <AdminSelect value={searchParams.get('loai') || ''} onChange={(v) => updateParam('loai', v)} className={selectCls}>
            <option value="">Danh mục: Tất cả</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </AdminSelect>
          <AdminSelect value={searchParams.get('trangthai') || ''} onChange={(v) => updateParam('trangthai', v)} className={selectCls}>
            <option value="">Trạng thái: Tất cả</option>
            {CONTENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {CONTENT_STATUS_LABELS[s]}
              </option>
            ))}
          </AdminSelect>
          <AdminSelect value={searchParams.get('nsx') || ''} onChange={(v) => updateParam('nsx', v)} className={selectCls}>
            <option value="">Nhà sản xuất: Tất cả</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </AdminSelect>
          <button
            type="submit"
            className="h-10 rounded-admin-sm border border-admin-border/20 bg-white/70 px-4 text-sm font-medium text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary dark:bg-white/5"
          >
            Lọc
          </button>
          {hasFilters && (
            <Link href="/admin/san-pham" className="text-sm text-admin-text-3 hover:text-admin-rose">
              Xóa lọc
            </Link>
          )}
        </form>

        {selected.size > 0 && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleBulkDelete}
            className="flex h-10 items-center gap-1.5 rounded-admin-sm border border-admin-rose/25 bg-admin-rose/10 px-4 text-sm font-medium text-admin-rose transition-colors hover:bg-admin-rose/20 disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
            {isPending ? 'Đang xóa...' : `Xóa (${selected.size})`}
          </button>
        )}
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/12 text-left">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Chọn tất cả"
                    className="size-4 rounded border-admin-border/30 text-admin-primary focus:ring-admin-primary/40"
                  />
                </th>
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
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggleOne(item.id)}
                      aria-label={`Chọn ${item.name}`}
                      className="size-4 rounded border-admin-border/30 text-admin-primary focus:ring-admin-primary/40"
                    />
                  </td>
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
                  <td className="px-4 py-2.5 text-admin-text-2">{item.categoryName || '—'}</td>
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
                        action={() => deleteSanPhamAction(item.id)}
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
                  <td colSpan={8} className="px-4 py-10 text-center text-admin-text-3">
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
    </>
  )
}
