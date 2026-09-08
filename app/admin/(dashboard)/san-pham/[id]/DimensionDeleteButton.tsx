'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'

export default function DimensionDeleteButton({ action }: { action: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      aria-label="Xóa kích thước"
      disabled={isPending}
      onClick={() => {
        if (window.confirm('Xóa dòng kích thước này?')) {
          startTransition(async () => {
            try {
              await action()
            } catch (e) {
              window.alert(e instanceof Error ? e.message : 'Có lỗi xảy ra.')
            }
          })
        }
      }}
      className="flex size-7 items-center justify-center rounded-admin-sm text-admin-text-3 transition-colors hover:bg-admin-rose/10 hover:text-admin-rose disabled:opacity-50"
    >
      {isPending ? '…' : <Trash2 className="size-3.5" />}
    </button>
  )
}
