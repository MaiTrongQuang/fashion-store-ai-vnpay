import { GoogleGenerativeAI } from "@google/generative-ai";

export type ChatTurn = { role: "user" | "assistant"; content: string };

const TEMPERATURE = 0.3;
const MAX_429_RETRIES = 3;
const MAX_RETRY_DELAY_MS = 60_000;

function toGeminiHistory(turns: ChatTurn[]) {
    const out: {
        role: "user" | "model";
        parts: { text: string }[];
    }[] = [];
    for (const t of turns) {
        out.push({
            role: t.role === "assistant" ? "model" : "user",
            parts: [{ text: t.content }],
        });
    }
    while (out.length && out[0].role !== "user") {
        out.shift();
    }
    return out;
}

function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

function isRateLimitError(err: unknown): boolean {
    const msg = err instanceof Error ? err.message : String(err);
    return (
        msg.includes("429") ||
        msg.includes("Too Many Requests") ||
        msg.includes("RESOURCE_EXHAUSTED") ||
        msg.includes("quota")
    );
}

/** Model ID cũ / sai (ví dụ gemini-1.5-flash) thường trả 404. */
function isModelNotFoundError(err: unknown): boolean {
    const msg = err instanceof Error ? err.message : String(err);
    return (
        msg.includes("404") ||
        msg.includes("Not Found") ||
        msg.includes("is not found for API version")
    );
}

/** Trích delay từ thông báo Google (RetryInfo / "Please retry in Xs"). */
function parseRetryDelayMs(err: unknown): number | null {
    const msg = err instanceof Error ? err.message : String(err);
    const m = msg.match(/Please retry in ([\d.]+)s/i);
    if (m) {
        const sec = parseFloat(m[1]);
        if (!Number.isNaN(sec)) {
            return Math.min(Math.ceil(sec * 1000) + 250, MAX_RETRY_DELAY_MS);
        }
    }
    return null;
}

async function sendOnce(
    apiKey: string,
    modelName: string,
    systemInstruction: string,
    history: ChatTurn[],
    userMessage: string,
): Promise<string | null> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
    });

    const geminiHistory = toGeminiHistory(history);
    const chat = model.startChat({
        history: geminiHistory,
        generationConfig: {
            temperature: TEMPERATURE,
            maxOutputTokens: 1024,
        },
    });

    const result = await chat.sendMessage(userMessage);
    const text = result.response.text();
    const trimmed = text?.trim();
    return trimmed || null;
}

function uniqueModels(primary: string, ...fallbacks: (string | undefined)[]): string[] {
    const out: string[] = [];
    for (const m of [primary, ...fallbacks]) {
        const t = m?.trim();
        if (t && !out.includes(t)) out.push(t);
    }
    return out;
}

/**
 * Fallback mặc định khi không set GEMINI_FALLBACK_MODEL: ưu tiên Gemini 3 Flash (text), tránh 1.5 (thường 404).
 */
function defaultFallbackForPrimary(primary: string): string {
    return primary.includes("3.1-flash-live")
        ? "gemini-3-flash-preview"
        : "gemini-3.1-flash-live-preview";
}

/**
 * Sinh câu trả lời Gemini Flash.
 * - 429: chờ theo RetryInfo rồi thử lại (tối đa MAX_429_RETRIES lần / model).
 * - 404 / model không hỗ trợ: chuyển sang model dự phòng trong chuỗi.
 */
export async function generateGeminiReply(
    apiKey: string,
    modelName: string,
    systemInstruction: string,
    history: ChatTurn[],
    userMessage: string,
    fallbackModel?: string,
): Promise<string | null> {
    const fb =
        fallbackModel?.trim() ||
        process.env.GEMINI_FALLBACK_MODEL?.trim() ||
        defaultFallbackForPrimary(modelName);
    const extra = process.env.GEMINI_FALLBACK_MODEL_2?.trim();
    const models = uniqueModels(modelName, fb, extra);

    for (const m of models) {
        let lastErr: unknown;
        for (let attempt = 0; attempt < MAX_429_RETRIES; attempt++) {
            try {
                const text = await sendOnce(
                    apiKey,
                    m,
                    systemInstruction,
                    history,
                    userMessage,
                );
                if (text) return text;
                return null;
            } catch (err) {
                lastErr = err;
                if (isModelNotFoundError(err)) {
                    console.warn(
                        `Gemini model=${m} không khả dụng (404) — thử model khác.`,
                    );
                    break;
                }
                if (!isRateLimitError(err)) {
                    console.warn(`Gemini model=${m} (không phải 429):`, err);
                    break;
                }
                if (attempt < MAX_429_RETRIES - 1) {
                    const delay =
                        parseRetryDelayMs(err) ?? 1500 * (attempt + 1);
                    console.warn(
                        `Gemini 429 model=${m}, thử lại sau ${delay}ms (lần ${attempt + 2}/${MAX_429_RETRIES})`,
                    );
                    await sleep(delay);
                }
            }
        }
        if (lastErr && isRateLimitError(lastErr)) {
            console.warn(
                `Gemini model=${m} vẫn rate limit sau ${MAX_429_RETRIES} lần — thử model khác nếu có.`,
            );
        }
    }

    return null;
}
