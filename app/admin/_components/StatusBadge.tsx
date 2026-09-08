import { cn } from '@/lib/utils'

const styles = {
  success: 'bg-admin-emerald/12 text-admin-emerald',
  muted: 'bg-admin-text-3/15 text-admin-text-2',
  warning: 'bg-admin-amber/12 text-admin-amber',
  danger: 'bg-admin-rose/12 text-admin-rose',
  info: 'bg-admin-sky/12 text-admin-sky',
  primary: 'bg-admin-primary/12 text-admin-primary',
} as const

export default function StatusBadge({
  variant = 'muted',
  className,
  children,
}: {
  variant?: keyof typeof styles
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
