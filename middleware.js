import { NextResponse } from 'next/server';

const PRODUCTION_DOMAIN = 'aibricksrealtors.com';

export function middleware(request) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // Skip rewrites for API, static assets, admin, and location pages
  // /locations is excluded so that city-subdomain fallback redirects land correctly
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/locations') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Strip port before splitting (e.g. lodha.localhost:3000 → lodha.localhost)
  const host = hostname.split(':')[0];
  const parts = host.split('.');

  let subdomain = null;

  if (host === 'localhost' || host === '127.0.0.1') {
    // Plain localhost — no subdomain
  } else if (host.endsWith('.localhost')) {
    // e.g. lodha.localhost → subdomain = 'lodha'
    if (parts.length >= 2 && parts[0] !== 'www') {
      subdomain = parts[0];
    }
  } else if (host === PRODUCTION_DOMAIN || host.endsWith(`.${PRODUCTION_DOMAIN}`)) {
    // Only apply subdomain logic for the real production domain.
    // Vercel preview URLs (*.vercel.app), ngrok, and other tunnels are intentionally
    // excluded so they don't get rewritten to /sub/[random-hostname].
    if (parts.length >= 3 && parts[0] !== 'www') {
      subdomain = parts[0];
    }
  }

  if (subdomain) {
    // Rewrite to the unified subdomain handler.
    // /sub/[slug] checks developer first, then city — URL stays clean (no redirect).
    const targetPath =
      url.pathname === '/'
        ? `/sub/${subdomain}`
        : `/sub/${subdomain}${url.pathname}`;

    return NextResponse.rewrite(new URL(targetPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
