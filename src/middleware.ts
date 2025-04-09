import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Only these pages are accessible without login
const publicRoutes = ['/en', '/auth/signup'];

// Create localization middleware
const i18nMiddleware = createMiddleware({
  locales: ['mr', 'en', 'hi'],  // Supported locales
  defaultLocale: 'mr',          // Default locale (Marathi)
});

// Middleware function to check authentication
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token'); // Get auth token

  // Check if route is public (login/signup)
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // If not logged in & trying to access a protected route, redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/en', request.url)); // Redirect to login
  }

  // Allow authenticated users & apply localization
  return i18nMiddleware(request);
}

// Apply middleware to all routes except API and static files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)' // Apply to all except static assets
  ],
};
