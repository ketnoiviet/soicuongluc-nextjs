'use client'

import { useTransition } from 'react'
import { cn } from '@/lib/utils'

export default function ActiveToggle({
  active,
  onToggle,
}: {
  active: boolean
  onToggle: (next: boolean) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            await onToggle(!active)
          } catch (e) {
            window.alert(e instanceof Error ? e.message : 'Có lỗi xảy ra.')
          }
        })
      }
      className={cn(
        'rounded-admin-sm border px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50',
        active
          ? 'border-admin-emerald/25 bg-admin-emerald/10 text-admin-emerald hover:bg-admin-emerald/20'
          : 'border-admin-text-3/25 bg-admin-text-3/10 text-admin-text-2 hover:bg-admin-text-3/20'
      )}
    >
      {isPending ? '...' : active ? 'Đang hoạt động' : 'Đã khóa'}
    </button>
  )
}
