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

    if (
        request.nextUrl.pathname.includes('/dashboard') ||
        request.nextUrl.pathname.includes('/guest')
    ) {
        // Check if user exists
        if (!user) {
            const locale = request.nextUrl.pathname.split('/')[1] || 'en';
            // If pathname starts with /dashboard (no locale), this might be an issue with i18n middleware not handling it yet.
            // However middleware.ts usually handles locale redirection first.
            // Let's assume URL is /en/dashboard.
            // We redirect to login.
            const loginUrl = new URL(`/${locale}/login`, request.url);
            return NextResponse.redirect(loginUrl);
        }

        // We could check role here too if we want strict security,
        // but role is in user_metadata which supabase.auth.getUser() returns.
        // However, we need to decode JWT or check DB if metadata is not trusted (usually metadata in jwt is fine for quick check).
        // Let's check metadata role.
        /*
        const role = user.user_metadata.role;
        if (role !== 'admin' && role !== 'HOST') {
           return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url));
        }
        */
    }

    // IMPORTANT: You *must* return the response object as created by
    // the middleware handler, because that response contains the
    // cookie updates.
    return response
}
