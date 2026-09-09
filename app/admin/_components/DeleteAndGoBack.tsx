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
      className="rounded-admin-sm border border-admin-rose/25 px-2.5 py-1.5 text-xs font-medium text-admin-rose transition-colors hover:bg-admin-rose/10 disabled:opacity-50"
    >
      {isPending ? 'Đang xóa...' : label}
    </button>
  )
}
