import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { LoginSuccessResponse } from "@/lib/auth/api-types";

function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return false;
    if (url.includes("your_") || key.includes("your_")) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    if (!isSupabaseConfigured()) {
        return NextResponse.json(
            { error: "Xác thực chưa được cấu hình." },
            { status: 503 },
        );
    }

    let body: { email?: string; password?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
    }

    const email = body.email?.trim();
    const password = body.password;
    if (!email || !password) {
        return NextResponse.json(
            { error: "Thiếu email hoặc mật khẩu." },
            { status: 400 },
        );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
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
                        /* ignore */
                    }
                },
            },
        },
    );

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return NextResponse.json(
            {
                error:
                    error.message === "Invalid login credentials"
                        ? "Email hoặc mật khẩu không đúng"
                        : error.message,
            },
            { status: 401 },
        );
    }

    const user = data.user!;
    const payload: LoginSuccessResponse = {
        user: {
            id: user.id,
            email: user.email,
            user_metadata: (user.user_metadata ?? {}) as Record<
                string,
                unknown
            >,
        },
        session: {
            expires_at: data.session?.expires_at ?? null,
            expires_in: data.session?.expires_in ?? null,
        },
    };

    return NextResponse.json(payload);
}
