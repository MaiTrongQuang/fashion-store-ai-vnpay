import { createBrowserClient } from "@supabase/ssr";

function createStubClient(): any {
    const emptyResponse = { data: null, error: null, count: null };
    const chainable: any = new Proxy(
        {},
        {
            get(_target, prop) {
                if (prop === "then") return undefined;
                if (prop === "single" || prop === "maybeSingle") {
                    return () => Promise.resolve(emptyResponse);
                }
                return (..._args: any[]) => {
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
            onAuthStateChange: (_callback: any) => ({
                data: { subscription: { unsubscribe: () => {} } },
            }),
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

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key || url.includes("your_") || key.includes("your_")) {
        return createStubClient();
    }

    try {
        new URL(url);
    } catch {
        return createStubClient();
    }

    return createBrowserClient(url, key);
}
