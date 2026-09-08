'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { navItemsFlat } from './nav-data'

const EXTRA_LABELS: Record<string, string> = {
  new: 'Thêm mới',
  edit: 'Chỉnh sửa',
}

export default function Breadcrumbs() {
  const pathname = usePathname()

  if (pathname === '/admin') {
    return (
      <Breadcrumb>
        <BreadcrumbList className="text-xs text-admin-text-3">
          <BreadcrumbItem>
            <BreadcrumbPage className="text-admin-text-3">Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  const match = navItemsFlat
    .filter((item) => item.href !== '/admin' && pathname.startsWith(item.href))
    .sort((a, b) => b.href.length - a.href.length)[0]

  const rest = match
    ? pathname
        .slice(match.href.length)
        .split('/')
        .filter(Boolean)
    : []

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xs text-admin-text-3">
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild className="hover:text-admin-primary">
            <Link href="/admin">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {match && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              {rest.length === 0 ? (
                <BreadcrumbPage className="text-admin-text-3">{match.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild className="hover:text-admin-primary">
                  <Link href={match.href}>{match.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </>
        )}
        {rest.map((segment, i) => {
          const isLast = i === rest.length - 1
          const label = EXTRA_LABELS[segment] || decodeURIComponent(segment)
          return (
            <Fragment key={segment + i}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? <BreadcrumbPage className="text-admin-text-3">{label}</BreadcrumbPage> : <span>{label}</span>}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
