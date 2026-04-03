import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { RegisterSuccessResponse } from "@/lib/auth/api-types";

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

    let body: {
        email?: string;
        password?: string;
        fullName?: string;
    };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
    }

    const email = body.email?.trim();
    const password = body.password;
    const fullName = body.fullName?.trim();
    if (!email || !password) {
        return NextResponse.json(
            { error: "Thiếu email hoặc mật khẩu." },
            { status: 400 },
        );
    }
    if (!fullName || fullName.length < 2) {
        return NextResponse.json(
            { error: "Họ tên không hợp lệ." },
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

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const u = data.user;
    const payload: RegisterSuccessResponse = {
        user: u
            ? {
                  id: u.id,
                  email: u.email,
                  user_metadata: (u.user_metadata ?? {}) as Record<
                      string,
                      unknown
                  >,
              }
            : null,
        session: data.session
            ? {
                  expires_at: data.session.expires_at ?? null,
                  expires_in: data.session.expires_in ?? null,
              }
            : null,
        needsEmailConfirmation: !data.session,
    };

    return NextResponse.json(payload);
}
