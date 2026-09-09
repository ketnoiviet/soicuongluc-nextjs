import ActionForm from '@/app/admin/_components/ActionForm'
import SubmitButton from '@/app/admin/_components/SubmitButton'
import { loginAction } from './actions'

export const metadata = { title: 'Đăng nhập quản trị | HARIFA' }

export default async function AdminLoginPage(props: { searchParams: Promise<{ redirect?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="min-h-screen bg-[#0f1620] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl mx-auto mb-3">
            🧵
          </div>
          <h1 className="text-lg font-bold text-slate-800">Đăng nhập quản trị</h1>
          <p className="text-sm text-slate-500 mt-1">soicuongluc.com - HARIFA</p>
        </div>

        <ActionForm action={loginAction}>
          <input type="hidden" name="redirectTo" value={searchParams.redirect || '/admin'} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              autoFocus
              placeholder="admin@harifavn.com"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <SubmitButton className="w-full bg-primary text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity">
            Đăng nhập
          </SubmitButton>
        </ActionForm>
      </div>
    </div>
  )
}
