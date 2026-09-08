import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import Breadcrumbs from './Breadcrumbs'

export default function PageHeader({
  title,
  description,
  actionHref,
  actionLabel,
  backHref,
  children,
}: {
  title: string
  description?: string
  actionHref?: string
  actionLabel?: string
  backHref?: string
  children?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="admin-glass mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-admin-text-2 transition-colors hover:text-admin-primary"
          >
            <ArrowLeft className="size-4" />
          </Link>
        )}
        <div>
          <div className="mb-1">
            <Breadcrumbs />
          </div>
          <h1 className="text-xl font-extrabold text-admin-text sm:text-[26px]">{title}</h1>
          {description && <p className="mt-1 text-sm text-admin-text-2">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className={cn(
              'admin-gradient inline-flex items-center gap-1.5 rounded-admin-md px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgb(var(--admin-primary)/0.6)] transition-transform hover:-translate-y-0.5'
            )}
          >
            <Plus className="size-4" /> {actionLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
