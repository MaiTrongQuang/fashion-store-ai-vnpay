import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return false;
    // Skip if still using placeholder values
    if (url.includes("your_") || key.includes("your_")) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    // Skip Supabase auth if not configured yet
    if (!isSupabaseConfigured()) {
        return supabaseResponse;
    }

    // Performance optimization: only run auth checks for routes that need them.
    // Public routes (products, collections, about, contact, etc.) skip getUser()
    // entirely, saving ~200-500ms per navigation.
    const pathname = request.nextUrl.pathname;
    const needsAuth =
        pathname.startsWith("/account") ||
        pathname.startsWith("/admin") ||
        pathname === "/login" ||
        pathname === "/register" ||
        pathname.startsWith("/checkout");

    if (!needsAuth) {
        return supabaseResponse;
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value),
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protect account routes
    if (!user && pathname.startsWith("/account")) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "admin") {
            const url = request.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }

    // Redirect logged-in users away from auth pages
    if (
        user &&
        (pathname === "/login" ||
            pathname === "/register")
    ) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
