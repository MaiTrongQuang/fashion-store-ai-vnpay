import { SITE_NAME } from "@/lib/constants";

export type ChatPromptScope = "home" | "product";

/** Short prompts for chips; clicking sends the string as the user message. */
export function getSuggestedChatPrompts(opts: {
    scope: ChatPromptScope;
    productName?: string;
}): string[] {
    if (opts.scope === "product") {
        const n = opts.productName?.trim();
        const label = n ? `"${n}"` : "san pham nay";
        return [
            `Size nao hop voi minh khi chon ${label}?`,
            `Chat lieu va form dang cua ${label} the nao?`,
            `Goi y phoi do voi ${label}.`,
            `Chinh sach doi tra khi mua ${label} ap dung the nao?`,
        ];
    }
    return [
        `Goi y outfit phu hop mua nay tai ${SITE_NAME}?`,
        "Lam sao chon size cho phom nguoi Viet?",
        "Cua hang ho tro thanh toan va giao hang ra sao?",
        "Co san pham moi hoac dang sale khong?",
    ];
}
