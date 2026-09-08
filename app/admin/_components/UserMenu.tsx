'use client'

import { ChevronDown, KeyRound, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { logoutAction } from '@/app/admin/actions'

export default function UserMenu({ fullName, email }: { fullName: string | null; email: string }) {
  const router = useRouter()
  const displayName = fullName || 'Quản trị viên'
  const initial = (fullName || email || 'A').charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-auto items-center gap-2 rounded-full px-2 py-1.5 hover:bg-admin-primary/10">
          <span className="admin-gradient flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white">
            {initial}
          </span>
          <div className="hidden text-left text-sm leading-tight sm:grid">
            <span className="truncate font-semibold text-admin-text">{displayName}</span>
            <span className="truncate text-xs text-admin-text-3">{email}</span>
          </div>
          <ChevronDown className="hidden size-3.5 text-admin-text-3 sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="admin-glass w-56 rounded-admin-md border-none">
        <DropdownMenuLabel className="font-normal">
          <div className="grid text-sm leading-tight">
            <span className="truncate font-semibold text-admin-text">{displayName}</span>
            <span className="truncate text-xs text-admin-text-3">{email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-admin-border/15" />
        <DropdownMenuItem
          onClick={() => router.push('/admin/doi-mat-khau')}
          className="text-admin-text-2 focus:bg-admin-primary/10 focus:text-admin-primary"
        >
          <KeyRound className="mr-2 size-4" /> Đổi mật khẩu
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-admin-border/15" />
        <DropdownMenuItem asChild className="text-admin-rose focus:bg-admin-rose/10 focus:text-admin-rose">
          <form action={logoutAction} className="w-full">
            <button type="submit" className="flex w-full items-center">
              <LogOut className="mr-2 size-4" /> Đăng xuất
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
