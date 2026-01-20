import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Ignore public files
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('.') ||
        pathname.startsWith('/api')
    ) {
        return NextResponse.next();
    }

    // Check if pathname has a locale
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Special Handling for the broken URL reported by user: /login/guest/profile
    // This likely resulted from a bad redirect. We direct them to the guest profile.
    if (pathname.includes('/login/guest/profile')) {
        return NextResponse.redirect(new URL(`/${defaultLocale}/guest/profile`, request.url));
    }

    // Special handling for /login -> /en/login
    if (pathname === '/login') {
        return NextResponse.redirect(new URL(`/${defaultLocale}/login`, request.url));
    }

    if (pathnameIsMissingLocale) {
        const locale = defaultLocale;
        return NextResponse.redirect(
            new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        '/((?!_next|api|favicon.ico).*)',
    ],
};
