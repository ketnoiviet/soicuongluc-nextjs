import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, decryptSession } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Trang đăng nhập luôn cho phép truy cập
  if (pathname === '/admin/login') {
    // Nếu đã đăng nhập rồi thì chuyển thẳng vào dashboard
    const token = request.cookies.get(SESSION_COOKIE)?.value
    const session = await decryptSession(token)
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value
    const session = await decryptSession(token)
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
