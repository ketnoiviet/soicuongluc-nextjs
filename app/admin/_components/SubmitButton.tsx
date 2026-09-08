'use client'

import { useFormStatus } from 'react-dom'

export default function SubmitButton({
  children = 'Lưu',
  pendingLabel = 'Đang lưu...',
  className = '',
}: {
  children?: React.ReactNode
  pendingLabel?: string
  className?: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ||
        'admin-gradient rounded-admin-md px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgb(var(--admin-primary)/0.6)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60'
      }
    >
      {pending ? pendingLabel : children}
    </button>
  )
}
