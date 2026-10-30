import { NextResponse, type NextRequest } from 'next/server';
import { createSessionToken, getAdminPassword, getAuthSecret, SESSION_COOKIE } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthEndpoint = pathname.startsWith('/api/auth');

  const expectedToken = await createSessionToken(getAdminPassword(), getAuthSecret());
  const isAuthenticated = request.cookies.get(SESSION_COOKIE)?.value === expectedToken;

  if (pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (isAuthEndpoint) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('from', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
