import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
        return NextResponse.json(
            { error: "Server chưa được cấu hình." },
            { status: 503 },
        );
    }

    let body: { email?: string; password?: string; otpCode?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Dữ liệu không hợp lệ." },
            { status: 400 },
        );
    }

    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const otpCode = body.otpCode?.trim();

    if (!email || !password || !otpCode) {
        return NextResponse.json(
            { error: "Thiếu thông tin bắt buộc." },
            { status: 400 },
        );
    }
    if (password.length < 6) {
        return NextResponse.json(
            { error: "Mật khẩu tối thiểu 6 ký tự." },
            { status: 400 },
        );
    }

    const supabase = createClient(url, serviceKey);

    // Verify OTP is verified
    const { data: otpRecord } = await supabase
        .from("otp_codes")
        .select("*")
        .eq("email", email)
        .eq("purpose", "reset_password")
        .eq("verified", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (!otpRecord) {
        return NextResponse.json(
            {
                error: "Mã OTP chưa được xác thực. Vui lòng xác thực trước.",
            },
            { status: 400 },
        );
    }

    // Clean up used OTP
    await supabase
        .from("otp_codes")
        .delete()
        .eq("email", email)
        .eq("purpose", "reset_password");

    // Find user by email
    const { data: existingUsers } =
        await supabase.auth.admin.listUsers();

    const user = existingUsers?.users?.find(
        (u) => u.email?.toLowerCase() === email,
    );

    if (!user) {
        return NextResponse.json(
            { error: "Tài khoản không tồn tại." },
            { status: 404 },
        );
    }

    // Update password using admin API (user is not logged in)
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
        password,
    });

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
