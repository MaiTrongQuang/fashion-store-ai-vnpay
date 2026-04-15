import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
        return NextResponse.json(
            { error: "Xác thực chưa được cấu hình." },
            { status: 503 },
        );
    }

    let body: { email?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Dữ liệu không hợp lệ." },
            { status: 400 },
        );
    }

    const email = body.email?.trim();
    if (!email) {
        return NextResponse.json(
            { error: "Vui lòng nhập email." },
            { status: 400 },
        );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(url, key, {
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
    });

    const appUrl = (
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ).replace(/\/+$/, "");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
    });

    if (error) {
        // Don't reveal if user exists or not for security
        console.error("Reset password error:", error.message);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
        message:
            "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu.",
    });
}
