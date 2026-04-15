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

    let body: { password?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Dữ liệu không hợp lệ." },
            { status: 400 },
        );
    }

    const password = body.password;
    if (!password || password.length < 6) {
        return NextResponse.json(
            { error: "Mật khẩu tối thiểu 6 ký tự." },
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

    // Verify user is authenticated (came from reset password link)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            {
                error: "Phiên đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại.",
            },
            { status: 401 },
        );
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 },
        );
    }

    return NextResponse.json({
        message: "Đặt lại mật khẩu thành công!",
    });
}
