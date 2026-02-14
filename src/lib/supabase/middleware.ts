import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protect Dashboard Routes
    // This logic runs for every request that middleware matches.
    // We can filter here or in main middleware. ts, but best to keep specific logic here or return user.

    // Protect /admin Routes
    if (request.nextUrl.pathname.includes('/admin')) {
        const locale = request.nextUrl.pathname.split('/')[1] || 'en';

        if (!user) {
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }

        const role = user.user_metadata?.role;
        // Strict check: Only ADMIN role allowed
        if (role !== 'ADMIN') {
            // Redirect unauthorized users to home
            return NextResponse.redirect(new URL(`/${locale}`, request.url));
        }
    }

    // Protect Dashboard Routes (User Dashboard)
    if (
        request.nextUrl.pathname.includes('/dashboard') ||
        request.nextUrl.pathname.includes('/guest')
    ) {
        if (!user) {
            const locale = request.nextUrl.pathname.split('/')[1] || 'en';
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }
    }

    // IMPORTANT: You *must* return the response object as created by
    // the middleware handler, because that response contains the
    // cookie updates.
    return response
}
