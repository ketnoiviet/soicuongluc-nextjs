'use client'

import { useTransition } from 'react'

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
      className={`text-xs px-2.5 py-1.5 rounded-md border transition-colors disabled:opacity-50 ${
        active
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
      }`}
    >
      {isPending ? '...' : active ? 'Đang hoạt động' : 'Đã khóa'}
    </button>
  )
}
