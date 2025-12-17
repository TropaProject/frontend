// middleware.ts (в корне проекта)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Пропускаем публичные пути
  const publicPaths = ['/login', '/register', '/api/auth', '/', '/test']
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // Проверяем наличие токена в куках или localStorage (через заголовки)
  const authHeader = request.headers.get('authorization')
  const accessToken = request.cookies.get('access_token')
  
  if (!authHeader && !accessToken && pathname.startsWith('/api/')) {
    // Для API без авторизации
    return NextResponse.json(
      { status: 'error', error: 'Authorization required' },
      { status: 401 }
    )
  }
  
  // Для защищенных страниц (dashboard, profile, quiz)
  const protectedPaths = ['/dashboard', '/profile', '/quiz']
  const isProtected = protectedPaths.some(path => pathname.startsWith(path))
  
  if (isProtected && !authHeader && !accessToken) {
    // Редирект на логин для защищенных страниц
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}