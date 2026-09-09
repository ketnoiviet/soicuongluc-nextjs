'use client'

import { useState } from 'react'
// navGroups chứa component icon (hàm) - không thể truyền qua props từ Server Component
// xuống Client Component, nên import thẳng ở đây thay vì nhận qua props.
import { navGroups } from '@/app/admin/_components/nav-data'

export default function PermissionsEditor({ defaultAllowed }: { defaultAllowed: string[] | null }) {
  const [fullAccess, setFullAccess] = useState(defaultAllowed === null)
  const [selected, setSelected] = useState<Set<string>>(
    new Set(defaultAllowed ?? navGroups.flatMap((g) => g.items.map((i) => i.href)))
  )

  const toggleHref = (href: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(href)) next.delete(href)
      else next.add(href)
      return next
    })
  }

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-admin-sm border border-admin-border/15 px-3 py-2.5">
        <span className="min-w-0">
          <span className="block text-sm font-medium text-admin-text">Toàn quyền truy cập</span>
          <span className="block text-xs text-admin-text-3">Không giới hạn - vào được tất cả các trang hiện có và trang thêm sau này.</span>
        </span>
        <input
          type="checkbox"
          name="fullAccess"
          checked={fullAccess}
          onChange={(e) => setFullAccess(e.target.checked)}
          className="size-4 shrink-0 rounded border-admin-border/30 text-admin-primary focus:ring-admin-primary/40"
        />
      </label>

      <div className={fullAccess ? 'pointer-events-none space-y-4 opacity-40' : 'space-y-4'}>
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-admin-text-3">{group.label}</p>
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <label key={item.href} className="flex cursor-pointer items-center gap-2.5 text-sm text-admin-text-2">
                  <input
                    type="checkbox"
                    name={`perm_${item.href}`}
                    disabled={fullAccess}
                    checked={fullAccess || selected.has(item.href)}
                    onChange={() => toggleHref(item.href)}
                    className="size-4 rounded border-admin-border/30 text-admin-primary focus:ring-admin-primary/40"
                  />
                  <item.icon className="size-4 text-admin-text-3" />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
