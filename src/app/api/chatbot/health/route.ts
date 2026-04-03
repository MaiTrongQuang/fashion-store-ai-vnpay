import { NextResponse } from "next/server";

export type ChatbotHealthStatus = "ok" | "degraded";

export type ChatbotHealthBody = {
    status: ChatbotHealthStatus;
    geminiConfigured: boolean;
    liveCheckOk: boolean | null;
    reasons: string[];
};

async function pingGeminiModelsList(apiKey: string): Promise<boolean> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
        method: "GET",
        next: { revalidate: 0 },
    });
    return res.ok;
}

export async function GET() {
    const reasons: string[] = [];
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const geminiConfigured = Boolean(apiKey);
    const liveCheck =
        process.env.CHATBOT_HEALTH_LIVE_CHECK === "true" ||
        process.env.CHATBOT_HEALTH_LIVE_CHECK === "1";

    let liveCheckOk: boolean | null = null;

    if (!geminiConfigured) {
        reasons.push("Chưa cấu hình GEMINI_API_KEY — chatbot chỉ dùng FAQ / trả lời mẫu.");
    }

    if (geminiConfigured && liveCheck) {
        try {
            liveCheckOk = await pingGeminiModelsList(apiKey!);
            if (!liveCheckOk) {
                reasons.push("Kiểm tra trực tiếp Google Generative Language API không thành công.");
            }
        } catch {
            liveCheckOk = false;
            reasons.push("Lỗi mạng khi gọi Google API (health check).");
        }
    }

    const status: ChatbotHealthStatus =
        geminiConfigured && (!liveCheck || liveCheckOk === true)
            ? "ok"
            : "degraded";

    const body: ChatbotHealthBody = {
        status,
        geminiConfigured,
        liveCheckOk: liveCheck ? liveCheckOk : null,
        reasons,
    };

    return NextResponse.json(body);
}
