import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('session')?.value;

  // Public routes that don't need authentication
  const publicRoutes = ['/signin', '/signup', '/forgot-password', '/admin', '/']; // Added /admin to public
  const isPublicRoute = publicRoutes.some(route => pathname === route || (route !== '/' && pathname.startsWith(route))) || 
                        pathname.startsWith('/inventory') ||
                        pathname.startsWith('/_next') ||
                        pathname.startsWith('/api');

  // Admin protected routes (not the login page)
  const isAdminProtectedRoute = pathname.startsWith('/admin/') && pathname !== '/admin';

  // User account routes
  const isAccountRoute = pathname.startsWith('/account');

  // If no session and trying to access protected route
  if (!session && (isAdminProtectedRoute || isAccountRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin'; // Redirect to admin login page
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // If session exists and trying to access admin protected route, verify admin role
  if (session && isAdminProtectedRoute) {
    try {
      // Verify token and check role
      const response = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });

      if (!response.ok) {
        // Invalid session, redirect to signin
        const url = request.nextUrl.clone();
        url.pathname = '/signin';
        url.searchParams.set('redirect', pathname);
        const redirectResponse = NextResponse.redirect(url);
        redirectResponse.cookies.delete('session');
        return redirectResponse;
      }

      const { role } = await response.json();

      // If not admin, redirect to home
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.error('Middleware auth error:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

