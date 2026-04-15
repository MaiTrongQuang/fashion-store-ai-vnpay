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

    let body: { email?: string; code?: string; purpose?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Dữ liệu không hợp lệ." },
            { status: 400 },
        );
    }

    const email = body.email?.trim().toLowerCase();
    const code = body.code?.trim();
    const purpose = body.purpose;

    if (!email || !code || !purpose) {
        return NextResponse.json(
            { error: "Thiếu thông tin xác thực." },
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

    // Find the latest non-expired, non-verified OTP
    const { data: otpRecord, error: fetchError } = await supabase
        .from("otp_codes")
        .select("*")
        .eq("email", email)
        .eq("purpose", purpose)
        .eq("verified", false)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (fetchError || !otpRecord) {
        return NextResponse.json(
            {
                error: "Mã OTP không tồn tại hoặc đã hết hạn. Vui lòng gửi lại mã mới.",
            },
            { status: 400 },
        );
    }

    // Check max attempts (5)
    if (otpRecord.attempts >= 5) {
        return NextResponse.json(
            {
                error: "Bạn đã nhập sai quá nhiều lần. Vui lòng gửi lại mã mới.",
            },
            { status: 429 },
        );
    }

    // Verify code
    if (otpRecord.code !== code) {
        // Increment attempts
        await supabase
            .from("otp_codes")
            .update({ attempts: otpRecord.attempts + 1 })
            .eq("id", otpRecord.id);

        const remaining = 4 - otpRecord.attempts;
        return NextResponse.json(
            {
                error:
                    remaining > 0
                        ? `Mã OTP không đúng. Còn ${remaining} lần thử.`
                        : "Mã OTP không đúng. Vui lòng gửi lại mã mới.",
            },
            { status: 400 },
        );
    }

    // Mark as verified
    await supabase
        .from("otp_codes")
        .update({ verified: true })
        .eq("id", otpRecord.id);

    return NextResponse.json({ verified: true });
}
