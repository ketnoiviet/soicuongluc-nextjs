import { cn } from '@/lib/utils'

export default function GlassCard({
  as: Comp = 'div',
  className,
  children,
  ...props
}: {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Comp className={cn('admin-glass rounded-admin-lg', className)} {...props}>
      {children}
    </Comp>
  )
}
