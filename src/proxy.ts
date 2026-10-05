import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * proxy.ts — Next.js 16 Server-side Auth Guard
 *
 * Runs before page render. Reads only the server-signed JWT cookie.
 * localStorage does not exist here — this cannot be bypassed by any
 * client-side manipulation.
 *
 * Protected routes:
 *   /dashboard     — any authenticated session
 *   /admin         — ADMIN or SUPER_ADMIN role only
 *   /learn/*       — any authenticated session
 *
 * Already-authenticated users are redirected away from /login and /register.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Decode the JWT from the signed session cookie
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  const role = (token as any)?.role as string | undefined;
  const isAuthenticated = !!token;
  const isAdminRole = role === 'ADMIN' || role === 'SUPER_ADMIN';

  // ---- /admin — ADMIN or SUPER_ADMIN only ----
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    if (!isAdminRole) {
      // Authenticated but insufficient role — redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // ---- /dashboard — any authenticated user ----
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', '/dashboard');
      return NextResponse.redirect(url);
    }
  }

  // ---- /learn/* — any authenticated user ----
  if (pathname.startsWith('/learn/')) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  // ---- Redirect authenticated users away from /login and /register ----
  if (pathname === '/login' || pathname === '/register') {
    if (isAuthenticated) {
      const dest = isAdminRole ? '/admin' : '/dashboard';
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/dashboard',
    '/dashboard/:path*',
    '/learn/:path*',
    '/login',
    '/register',
  ],
};
