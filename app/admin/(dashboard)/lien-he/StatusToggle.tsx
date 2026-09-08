'use client'

import { useTransition } from 'react'
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
      className={`text-xs px-2.5 py-1.5 rounded-md border transition-colors disabled:opacity-50 ${
        isDone
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          : 'border-accent/30 bg-accent/10 text-accent hover:bg-accent/20'
      }`}
    >
      {isPending ? '...' : isDone ? '✓ Đã xử lý' : '● Chưa xử lý'}
    </button>
  )
}
