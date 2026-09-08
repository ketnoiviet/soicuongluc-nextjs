'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteAndGoBack({
  action,
  redirectTo,
  confirmMessage = 'Bạn có chắc muốn xóa mục này?',
  label = 'Xóa',
}: {
  action: () => Promise<void>
  redirectTo: string
  confirmMessage?: string
  label?: string
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (window.confirm(confirmMessage)) {
          startTransition(async () => {
            try {
              await action()
              router.push(redirectTo)
            } catch (e) {
              window.alert(e instanceof Error ? e.message : 'Có lỗi xảy ra, vui lòng thử lại.')
            }
          })
        }
      }}
      className="text-xs px-2.5 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
    >
      {isPending ? 'Đang xóa...' : label}
    </button>
  )
}
