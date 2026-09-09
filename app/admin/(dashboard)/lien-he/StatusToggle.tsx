'use client'

import { useTransition } from 'react'
import { cn } from '@/lib/utils'
import type { ContactStatus } from '@/lib/enums'

export default function StatusToggle({
  currentStatus,
  onToggle,
}: {
  currentStatus: ContactStatus
  onToggle: (nextStatus: ContactStatus) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()
  const isDone = currentStatus === 'RESOLVED'

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => onToggle(isDone ? 'PENDING' : 'RESOLVED'))}
      className={cn(
        'rounded-admin-sm border px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50',
        isDone
          ? 'border-admin-emerald/25 bg-admin-emerald/10 text-admin-emerald hover:bg-admin-emerald/20'
          : 'border-admin-amber/25 bg-admin-amber/10 text-admin-amber hover:bg-admin-amber/20'
      )}
    >
      {isPending ? '...' : isDone ? '✓ Đã xử lý' : '● Chưa xử lý'}
    </button>
  )
}
