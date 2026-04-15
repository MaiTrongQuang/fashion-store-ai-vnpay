import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendOtpEmail, generateOtp } from "@/lib/email";

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

    let body: { email?: string; purpose?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Dữ liệu không hợp lệ." },
            { status: 400 },
        );
    }

    const email = body.email?.trim().toLowerCase();
    const purpose = body.purpose;
    if (!email || !purpose) {
        return NextResponse.json(
            { error: "Thiếu email hoặc mục đích." },
            { status: 400 },
        );
    }
    if (purpose !== "register" && purpose !== "reset_password") {
        return NextResponse.json(
            { error: "Mục đích không hợp lệ." },
            { status: 400 },
        );
    }

    const supabase = createClient(url, serviceKey);

    // Rate limit: max 3 OTP sends per 5 minutes per email+purpose
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count } = await supabase
        .from("otp_codes")
        .select("*", { count: "exact", head: true })
        .eq("email", email)
        .eq("purpose", purpose)
        .gte("created_at", fiveMinutesAgo);

    if (count !== null && count >= 3) {
        return NextResponse.json(
            {
                error: "Bạn đã gửi quá nhiều mã. Vui lòng đợi 5 phút.",
            },
            { status: 429 },
        );
    }

    // Invalidate old OTPs for same email+purpose
    await supabase
        .from("otp_codes")
        .delete()
        .eq("email", email)
        .eq("purpose", purpose)
        .eq("verified", false);

    // Generate & store new OTP
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase.from("otp_codes").insert({
        email,
        code,
        purpose,
        expires_at: expiresAt,
    });

    if (insertError) {
        console.error("OTP insert error:", insertError);
        return NextResponse.json(
            { error: "Không thể tạo mã OTP." },
            { status: 500 },
        );
    }

    // Send email
    const { success, error: emailError } = await sendOtpEmail(
        email,
        code,
        purpose,
    );

    if (!success) {
        console.error("OTP email error:", emailError);
        return NextResponse.json(
            { error: "Không thể gửi email. Vui lòng thử lại." },
            { status: 500 },
        );
    }

    return NextResponse.json({
        message: "Đã gửi mã OTP đến email của bạn.",
    });
}
