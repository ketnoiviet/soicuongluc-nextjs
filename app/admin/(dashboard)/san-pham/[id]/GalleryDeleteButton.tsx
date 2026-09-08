'use client'

import { useTransition } from 'react'

export default function GalleryDeleteButton({ action }: { action: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (window.confirm('Xóa ảnh này?')) {
          startTransition(async () => {
            try {
              await action()
            } catch (e) {
              window.alert(e instanceof Error ? e.message : 'Có lỗi xảy ra.')
            }
          })
        }
      }}
      className="rounded-admin-sm bg-admin-rose/90 px-2.5 py-1 text-xs text-white hover:bg-admin-rose disabled:opacity-50"
    >
      {isPending ? '...' : 'Xóa'}
    </button>
  )
}
