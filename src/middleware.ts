import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de protección de rutas.
 * Redirige a /login si el usuario no está autenticado.
 */
export function middleware(request: NextRequest) {
  const session = request.cookies.get('a_session')?.value;

  const protectedRoutes = ['/dashboard'];

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};