'use client'

import { useActionState } from 'react'

export type ActionState = { error?: string | null; success?: string | null }

export default function ActionForm({
  action,
  children,
  className = 'space-y-5',
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  children: React.ReactNode
  className?: string
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, { error: null })

  return (
    <form action={formAction} className={className}>
      {state?.error && (
        <div className="rounded-admin-sm border border-admin-rose/25 bg-admin-rose/10 px-3.5 py-2.5 text-sm text-admin-rose">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-admin-sm border border-admin-emerald/25 bg-admin-emerald/10 px-3.5 py-2.5 text-sm text-admin-emerald">
          {state.success}
        </div>
      )}
      {children}
    </form>
  )
}
