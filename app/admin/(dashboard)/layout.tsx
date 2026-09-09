import { Plus_Jakarta_Sans } from 'next/font/google'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getCurrentAdminUser } from '@/lib/auth'
import { logoutAction } from '@/app/admin/actions'
import { parsePermissions, isPathAllowed } from '@/lib/permissions'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '../_components/AppSidebar'
import AdminHeader from '../_components/AdminHeader'
import type { AdminRole } from '@/lib/enums'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-admin',
})

export const metadata = { title: `Quản trị | ${process.env.NEXT_PUBLIC_SITE_NAME || 'Admin'}` }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Đọc lại user từ DB (không chỉ giải mã JWT) để 1 tài khoản bị khoá/đổi quyền giữa
  // chừng bởi superadmin có hiệu lực ngay ở request kế tiếp, không phải đợi JWT hết hạn.
  const user = await getCurrentAdminUser()
  if (!user) {
    // Không redirect thẳng sang /admin/login ở đây: cookie phiên vẫn còn hợp lệ về
    // mặt chữ ký (chỉ là user đã bị khoá/xoá), nên middleware.ts sẽ lại đưa họ quay về
    // /admin ngay lập tức -> vòng lặp redirect vô hạn. cookies().delete() cũng không
    // gọi được ở đây vì Server Component đang render (chỉ Server Action/Route Handler
    // mới được sửa cookie) - dùng luôn logoutAction (Server Action) qua 1 nút bấm thật.
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1620] px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
          <p className="mb-1 text-lg font-bold text-slate-800">Tài khoản không còn hiệu lực</p>
          <p className="mb-5 text-sm text-slate-500">Tài khoản của bạn đã bị khoá hoặc không còn tồn tại. Vui lòng đăng nhập lại.</p>
          <form action={logoutAction}>
            <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
              Đăng xuất
            </button>
          </form>
        </div>
      </div>
    )
  }

  const role = user.role as AdminRole
  const allowedHrefs = parsePermissions(user.permissions)

  // App Router không cho layout Server Component biết URL đang render bằng cách nào
  // khác ngoài đọc lại header do middleware.ts gắn vào (xem middleware.ts).
  const pathname = (await headers()).get('x-pathname') || '/admin'
  if (!isPathAllowed(pathname, role, allowedHrefs)) {
    redirect('/admin')
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className={`admin-root ${jakarta.variable}`} style={{ fontFamily: 'var(--font-admin), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
        <div className="admin-mesh" />
        <SidebarProvider style={{ '--sidebar-width': '264px', '--sidebar-width-icon': '80px' } as React.CSSProperties}>
          <AppSidebar role={role} allowedHrefs={allowedHrefs} />
          <SidebarInset className="bg-transparent">
            <AdminHeader fullName={user.fullName} email={user.email} />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  )
}
