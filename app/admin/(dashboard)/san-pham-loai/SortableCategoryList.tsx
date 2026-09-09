'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, GripVertical } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'
import StatusBadge from '@/app/admin/_components/StatusBadge'
import ConfirmDeleteButton from '@/app/admin/_components/ConfirmDeleteButton'
import { deleteSanPhamLoaiAction, reorderSanPhamLoaiAction } from './actions'

type CategoryRow = {
  id: number
  name: string
  slug: string
  imageUrl: string | null
  sortOrder: number
  status: string
  parentName: string | null
  productCount: number
}

export default function SortableCategoryList({ items: initialItems }: { items: CategoryRow[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [dragId, setDragId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  // Kéo-thả bằng HTML5 drag events thuần (không thêm thư viện) - đổi vị trí trong state cục
  // bộ ngay khi kéo qua 1 dòng khác để phản hồi tức thì, rồi mới lưu thứ tự cuối cùng lên
  // server khi thả tay ra.
  const handleDragOver = (overId: number) => {
    if (dragId === null || dragId === overId) return
    setItems((prev) => {
      const fromIndex = prev.findIndex((i) => i.id === dragId)
      const toIndex = prev.findIndex((i) => i.id === overId)
      if (fromIndex === -1 || toIndex === -1) return prev
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const handleDrop = () => {
    if (dragId === null) return
    setDragId(null)
    startTransition(async () => {
      try {
        await reorderSanPhamLoaiAction(items.map((i) => i.id))
        router.refresh()
      } catch (e) {
        window.alert(e instanceof Error ? e.message : 'Không thể lưu thứ tự mới.')
      }
    })
  }

  return (
    <tbody className="divide-y divide-admin-border/10">
      {items.map((item) => (
        <tr
          key={item.id}
          draggable
          onDragStart={() => setDragId(item.id)}
          onDragOver={(e) => {
            e.preventDefault()
            handleDragOver(item.id)
          }}
          onDrop={(e) => {
            e.preventDefault()
            handleDrop()
          }}
          onDragEnd={handleDrop}
          className={`cursor-grab transition-colors hover:bg-admin-primary/5 active:cursor-grabbing ${
            dragId === item.id ? 'opacity-40' : ''
          } ${isPending ? 'pointer-events-none' : ''}`}
        >
          <td className="w-8 px-2 py-2.5 text-admin-text-3">
            <GripVertical className="size-4" />
          </td>
          <td className="px-4 py-2.5">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-admin-sm bg-admin-text-3/10">
              <Image src={getImageUrl(item.imageUrl)} alt={item.name} fill className="object-cover" sizes="40px" />
            </div>
          </td>
          <td className="px-4 py-2.5">
            <p className="font-semibold text-admin-text">{item.name}</p>
            <p className="text-xs text-admin-text-3">/{item.slug}</p>
          </td>
          <td className="px-4 py-2.5 text-admin-text-2">{item.parentName || '—'}</td>
          <td className="px-4 py-2.5 text-admin-text-2">{item.productCount}</td>
          <td className="px-4 py-2.5 text-admin-text-2">{item.sortOrder}</td>
          <td className="px-4 py-2.5">
            {item.status === 'PUBLISHED' ? (
              <StatusBadge variant="success">Đang hoạt động</StatusBadge>
            ) : (
              <StatusBadge variant="muted">Đã ẩn</StatusBadge>
            )}
          </td>
          <td className="px-4 py-2.5">
            <div className="flex justify-end gap-2">
              <Link
                href={`/admin/san-pham-loai/${item.id}`}
                className="flex size-8 items-center justify-center rounded-admin-sm border border-admin-border/20 text-admin-text-2 transition-colors hover:border-admin-primary/40 hover:text-admin-primary"
              >
                <Pencil className="size-3.5" />
              </Link>
              <ConfirmDeleteButton action={() => deleteSanPhamLoaiAction(item.id)} confirmMessage={`Xóa danh mục "${item.name}"?`} />
            </div>
          </td>
        </tr>
      ))}
      {items.length === 0 && (
        <tr>
          <td colSpan={8} className="px-4 py-10 text-center text-admin-text-3">
            Chưa có danh mục nào.
          </td>
        </tr>
      )}
    </tbody>
  )
}
