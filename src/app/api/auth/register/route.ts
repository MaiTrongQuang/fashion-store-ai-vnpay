import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
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
        otpCode?: string;
    };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
    }

    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const fullName = body.fullName?.trim();
    const otpCode = body.otpCode?.trim();

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
    if (!otpCode) {
        return NextResponse.json(
            { error: "Vui lòng xác thực mã OTP." },
            { status: 400 },
        );
    }

    // Verify OTP with service role
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
        return NextResponse.json(
            { error: "Server chưa được cấu hình." },
            { status: 503 },
        );
    }

    const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey,
    );

    // Check OTP is verified
    const { data: otpRecord } = await adminSupabase
        .from("otp_codes")
        .select("*")
        .eq("email", email)
        .eq("purpose", "register")
        .eq("verified", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (!otpRecord) {
        return NextResponse.json(
            { error: "Mã OTP chưa được xác thực. Vui lòng xác thực trước." },
            { status: 400 },
        );
    }

    // Clean up used OTP
    await adminSupabase
        .from("otp_codes")
        .delete()
        .eq("email", email)
        .eq("purpose", "register");

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

    // Since OTP is already verified, we can skip email confirmation
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            // OTP already verified, so email confirmed via our custom flow
            emailRedirectTo: undefined,
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
