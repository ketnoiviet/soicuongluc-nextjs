'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ExternalLink, Waves } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { navGroups } from './nav-data'
import { isPathAllowed } from '@/lib/permissions'
import type { AdminRole } from '@/lib/enums'

function CollapseToggle() {
  const { toggleSidebar, state } = useSidebar()
  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Thu gọn / mở rộng menu"
      className="admin-glass flex size-7 shrink-0 items-center justify-center rounded-full text-admin-text-2 transition-colors hover:text-admin-primary group-data-[collapsible=icon]:rotate-180"
    >
      <ChevronLeft className={`size-3.5 transition-transform ${state === 'collapsed' ? 'rotate-180' : ''}`} />
    </button>
  )
}

export default function AppSidebar({ role, allowedHrefs }: { role: AdminRole; allowedHrefs: string[] | null }) {
  const pathname = usePathname()
  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href))

  // Không hiện link mà chính user này bấm vào cũng sẽ bị chặn (xem layout.tsx) - tránh
  // để mục sidebar dẫn thẳng tới trang "không có quyền".
  const visibleGroups = navGroups
    .map((group) => ({ ...group, items: group.items.filter((item) => isPathAllowed(item.href, role, allowedHrefs)) }))
    .filter((group) => group.items.length > 0)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 px-3 pb-1 pt-4">
        <div className="flex items-center gap-2 px-1">
          <Link href="/admin" className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="admin-gradient flex size-9 shrink-0 items-center justify-center rounded-xl text-white shadow-[0_8px_18px_-6px_rgb(var(--admin-primary)/0.65)]">
              <Waves className="size-[18px]" />
            </div>
            <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate text-[15px] font-extrabold text-admin-text">
                {process.env.NEXT_PUBLIC_SITE_NAME || 'Quản trị'}
              </span>
              {process.env.NEXT_PUBLIC_SITE_URL && (
                <span className="truncate text-[11px] text-admin-text-3">
                  {process.env.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, '')}
                </span>
              )}
            </div>
          </Link>
          <div className="group-data-[collapsible=icon]:hidden">
            <CollapseToggle />
          </div>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <CollapseToggle />
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-1">
        {visibleGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wide text-admin-text-3">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                      className="rounded-admin-sm text-[13.5px] font-medium text-admin-text-2 data-[active=true]:shadow-[0_1px_2px_rgb(30,20,90,0.04)]"
                    >
                      <Link href={item.href}>
                        <item.icon className="size-[18px]" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="mt-auto p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Xem website"
              className="rounded-admin-sm border border-admin-primary/30 text-[13.5px] font-medium text-admin-primary hover:bg-admin-primary/10 hover:text-admin-primary"
            >
              <Link href="/" target="_blank">
                <ExternalLink className="size-[18px]" />
                <span>Xem website</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
