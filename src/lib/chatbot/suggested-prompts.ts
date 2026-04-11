import { SITE_NAME } from "@/lib/constants";

export type ChatPromptScope = "home" | "product";

/** Short prompts for chips; clicking sends the string as the user message. */
export function getSuggestedChatPrompts(opts: {
    scope: ChatPromptScope;
    productName?: string;
}): string[] {
    if (opts.scope === "product") {
        const n = opts.productName?.trim();
        const label = n ? `"${n}"` : "s\u1ea3n ph\u1ea9m n\u00e0y";
        return [
            `Size n\u00e0o h\u1ee3p v\u1edbi m\u00ecnh khi ch\u1ecdn ${label}?`,
            `Ch\u1ea5t li\u1ec7u v\u00e0 form d\u00e1ng c\u1ee7a ${label} th\u1ebf n\u00e0o?`,
            `G\u1ee3i \u00fd ph\u1ed1i \u0111\u1ed3 v\u1edbi ${label}.`,
            `Ch\u00ednh s\u00e1ch \u0111\u1ed5i tr\u1ea3 khi mua ${label} \u00e1p d\u1ee5ng th\u1ebf n\u00e0o?`,
        ];
    }
    return [
        `G\u1ee3i \u00fd outfit ph\u00f9 h\u1ee3p m\u00f9a n\u00e0y t\u1ea1i ${SITE_NAME}?`,
        "L\u00e0m sao ch\u1ecdn size cho d\u00e1ng ng\u01b0\u1eddi Vi\u1ec7t?",
        "C\u1eeda h\u00e0ng h\u1ed7 tr\u1ee3 thanh to\u00e1n v\u00e0 giao h\u00e0ng ra sao?",
        "C\u00f3 s\u1ea3n ph\u1ea9m m\u1edbi ho\u1eb7c \u0111ang sale kh\u00f4ng?",
    ];
}
