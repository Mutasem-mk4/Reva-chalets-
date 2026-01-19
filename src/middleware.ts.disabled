import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes that require authentication
const protectedRoutes = [
    '/dashboard',
    '/bookings',
    '/profile',
];

// Routes that require specific roles
const roleProtectedRoutes: Record<string, string[]> = {
    '/dashboard/chalets': ['HOST', 'ADMIN'],
    '/dashboard/finances': ['HOST', 'ADMIN'],
    '/dashboard/admin': ['ADMIN'],
};

// Routes that should redirect authenticated users (e.g., login page)
const authRoutes = [
    '/auth/login',
    '/auth/signup',
];

export async function middleware(request: NextRequest) {
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    const pathname = request.nextUrl.pathname;

    // Extract language prefix
    const langMatch = pathname.match(/^\/(en|ar)/);
    const lang = langMatch ? langMatch[1] : 'en';
    const pathWithoutLang = pathname.replace(/^\/(en|ar)/, '');

    // Check if user is trying to access protected routes without auth
    const isProtectedRoute = protectedRoutes.some(route =>
        pathWithoutLang.startsWith(route)
    );

    if (isProtectedRoute && !user) {
        const loginUrl = new URL(`/${lang}/auth/login`, request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    for (const [route, roles] of Object.entries(roleProtectedRoutes)) {
        if (pathWithoutLang.startsWith(route)) {
            if (!user) {
                const loginUrl = new URL(`/${lang}/auth/login`, request.url);
                loginUrl.searchParams.set('redirect', pathname);
                return NextResponse.redirect(loginUrl);
            }

            const userRole = user.user_metadata?.role || 'USER';
            if (!roles.includes(userRole)) {
                // Redirect to unauthorized page or dashboard
                return NextResponse.redirect(new URL(`/${lang}/dashboard`, request.url));
            }
        }
    }

    // Redirect authenticated users away from auth pages
    const isAuthRoute = authRoutes.some(route =>
        pathWithoutLang.startsWith(route)
    );

    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL(`/${lang}/dashboard`, request.url));
    }

    return response;
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
