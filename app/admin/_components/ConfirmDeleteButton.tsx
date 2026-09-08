'use client'

import { useTransition } from 'react'

export default function ConfirmDeleteButton({
  action,
  confirmMessage = 'Bạn có chắc muốn xóa mục này? Hành động này không thể hoàn tác.',
  label = 'Xóa',
  pendingLabel = 'Đang xóa...',
  className = '',
}: {
  action: () => Promise<void>
  confirmMessage?: string
  label?: React.ReactNode
  pendingLabel?: React.ReactNode
  className?: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      aria-label={typeof label === 'string' ? label : 'Xóa'}
      title={typeof label === 'string' ? undefined : 'Xóa'}
      disabled={isPending}
      onClick={() => {
        if (window.confirm(confirmMessage)) {
          startTransition(async () => {
            try {
              await action()
            } catch (e) {
              window.alert(e instanceof Error ? e.message : 'Có lỗi xảy ra, vui lòng thử lại.')
            }
          })
        }
      }}
      className={
        className ||
        'rounded-admin-sm border border-admin-rose/25 px-2.5 py-1.5 text-xs font-medium text-admin-rose transition-colors hover:bg-admin-rose/10 disabled:opacity-50'
      }
    >
      {isPending ? pendingLabel : label}
    </button>
  )
}
