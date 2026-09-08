import Link from 'next/link'
import { Bell, Search } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

export default async function AdminHeader({ fullName, email }: { fullName: string | null; email: string }) {
  const soLienHeMoi = await prisma.contactSubmission.count({ where: { status: 'PENDING' } })

  return (
    <header className="sticky top-0 z-30 m-3 flex h-16 shrink-0 items-center gap-3 px-2 md:m-4 md:h-[72px]">
      <div className="admin-glass flex h-full w-full items-center gap-3 rounded-admin-lg px-3 md:px-4">
        <SidebarTrigger className="md:hidden" />

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-admin-border/15 bg-white/70 px-4 py-2 text-sm text-admin-text-3 dark:bg-white/5">
          <Search className="size-4 shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, bài viết, đơn hàng..."
            className="w-full min-w-0 bg-transparent text-sm text-admin-text outline-none placeholder:text-admin-text-3"
          />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/admin/lien-he"
            className="relative flex size-9 items-center justify-center rounded-full text-admin-text-2 transition-colors hover:bg-admin-primary/10 hover:text-admin-primary"
          >
            <Bell className="size-[18px]" />
            {soLienHeMoi > 0 && (
              <span className="absolute right-2 top-2 size-2 rounded-full bg-admin-rose ring-2 ring-white dark:ring-[rgb(36,32,58)]" />
            )}
          </Link>
          <ThemeToggle />
          <Separator orientation="vertical" className="hidden h-6 bg-admin-border/20 sm:block" />
          <UserMenu fullName={fullName} email={email} />
        </div>
      </div>
    </header>
  )
}
