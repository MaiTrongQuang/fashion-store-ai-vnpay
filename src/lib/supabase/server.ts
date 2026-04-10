import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function isSupabaseConfigured(url?: string, key?: string): boolean {
    if (!url || !key) return false;
    if (url.includes("your_") || key.includes("your_")) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// A stub that mimics the Supabase client interface but returns empty data.
// This allows all pages to render without errors when Supabase is not configured.
function createStubClient(): any {
    const emptyResponse = { data: null, error: null, count: null };
    const chainable: any = new Proxy(
        {},
        {
            get(_target, prop) {
                // Terminal methods that return a promise
                if (prop === "then") return undefined; // Not a thenable itself
                if (prop === "single" || prop === "maybeSingle") {
                    return () => Promise.resolve(emptyResponse);
                }
                // Return chainable for query-building methods
                return (..._args: any[]) => {
                    // If called with .then() (i.e. awaited), resolve with empty response
                    const nextChainable: any = new Proxy(
                        {},
                        {
                            get(_t, p) {
                                if (p === "then") {
                                    return (resolve: any) =>
                                        resolve(emptyResponse);
                                }
                                if (p === "single" || p === "maybeSingle") {
                                    return () => Promise.resolve(emptyResponse);
                                }
                                return (..._a: any[]) => nextChainable;
                            },
                        },
                    );
                    return nextChainable;
                };
            },
        },
    );

    return {
        from: () => chainable,
        auth: {
            getUser: () =>
                Promise.resolve({ data: { user: null }, error: null }),
            getSession: () =>
                Promise.resolve({ data: { session: null }, error: null }),
            signOut: () => Promise.resolve({ error: null }),
        },
        storage: {
            from: () => ({
                upload: () => Promise.resolve({ data: null, error: null }),
                getPublicUrl: () => ({ data: { publicUrl: "" } }),
            }),
        },
        rpc: () => Promise.resolve(emptyResponse),
    };
}

export async function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!isSupabaseConfigured(url, key)) {
        return createStubClient();
    }

    const cookieStore = await cookies();

    return createServerClient(url!, key!, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options),
                    );
                } catch {
                    // The `setAll` method was called from a Server Component.
                    // This can be ignored if you have middleware refreshing user sessions.
                }
            },
        },
    });
}

export async function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!isSupabaseConfigured(url, key)) {
        return createStubClient();
    }

    // Must use raw supabase-js client to prevent @supabase/ssr from
    // automatically attaching the current user's session from cookies,
    // which would override the Service Role and enforce RLS policies.
    const { createClient: createRawClient } = await import('@supabase/supabase-js');
    
    return createRawClient(url!, key!, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        }
    });
}
