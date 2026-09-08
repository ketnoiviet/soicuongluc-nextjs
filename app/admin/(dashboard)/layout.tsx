import { Plus_Jakarta_Sans } from 'next/font/google'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '../_components/AppSidebar'
import AdminHeader from '../_components/AdminHeader'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-admin',
})

export const metadata = { title: 'Quản trị | HARIFA' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  // middleware.ts đã chặn /admin/* chưa đăng nhập, đây là lớp bảo vệ thứ 2 ở server component
  if (!session) redirect('/admin/login')

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className={`admin-root ${jakarta.variable}`} style={{ fontFamily: 'var(--font-admin), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
        <div className="admin-mesh" />
        <SidebarProvider style={{ '--sidebar-width': '264px', '--sidebar-width-icon': '80px' } as React.CSSProperties}>
          <AppSidebar />
          <SidebarInset className="bg-transparent">
            <AdminHeader fullName={session.fullName} email={session.email} />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  )
}
