import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
    buildDynamicStoreContext,
    buildFullSystemInstruction,
    extractProductSlugs,
    fetchActiveProductForChatbot,
    fetchChatbotContextData,
    fetchProductCardsForReply,
    formatActiveProductContextBlock,
    normalizeChatbotPageContext,
    type ChatbotProductCard,
} from "@/lib/chatbot/build-context";
import { getFallbackReply } from "@/lib/chatbot/fallback-reply";
import { generateGeminiReply, type ChatTurn } from "@/lib/chatbot/gemini";

/** Gemini 3.1 Flash Live (preview) — hỗ trợ text qua generateContent; xem ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-live-preview */
const DEFAULT_GEMINI_MODEL = "gemini-3.1-flash-live-preview";
const MAX_HISTORY_MESSAGES = 20;

export type ChatbotPostSource = "gemini" | "fallback";

async function loadConversationHistory(
    supabase: Awaited<ReturnType<typeof createClient>>,
    conversationId: string,
): Promise<ChatTurn[]> {
    const { data: rows, error } = await supabase
        .from("chatbot_messages")
        .select("role, content")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(MAX_HISTORY_MESSAGES);

    if (error) {
        console.warn("chatbot_messages history (created_at):", error.message);
    }

    const list = rows ?? [];
    const chronological = list
        .slice()
        .reverse()
        .map((r: { role: string; content: string }) => ({
            role: (r.role === "assistant" ? "assistant" : "user") as
                | "user"
                | "assistant",
            content: r.content,
        }));

    while (chronological.length && chronological[0].role !== "user") {
        chronological.shift();
    }

    return chronological;
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { message, conversationId, pageContext: rawPageContext } =
            await request.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 },
            );
        }

        let faqs: Awaited<
            ReturnType<typeof fetchChatbotContextData>
        >["faqs"] = [];
        let categories: Awaited<
            ReturnType<typeof fetchChatbotContextData>
        >["categories"] = [];
        let products: Awaited<
            ReturnType<typeof fetchChatbotContextData>
        >["products"] = [];

        try {
            const data = await fetchChatbotContextData(supabase);
            faqs = data.faqs;
            categories = data.categories;
            products = data.products;
        } catch (e) {
            console.error("Chatbot context fetch:", e);
        }

        const pageContext = normalizeChatbotPageContext(rawPageContext);
        let activeProductSuffix = "";
        if (pageContext.type === "product") {
            const active = await fetchActiveProductForChatbot(
                supabase,
                pageContext.slug,
            );
            if (active) {
                activeProductSuffix =
                    "\n\n" + formatActiveProductContextBlock(active);
            }
        }

        const dynamicBlock = buildDynamicStoreContext(
            faqs,
            categories,
            products,
        );
        const systemInstruction =
            buildFullSystemInstruction(dynamicBlock) + activeProductSuffix;

        let history: ChatTurn[] = [];
        if (conversationId && typeof conversationId === "string") {
            history = await loadConversationHistory(supabase, conversationId);
        }

        const apiKey = process.env.GEMINI_API_KEY?.trim();
        const modelName =
            process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

        let reply = "";
        let source: ChatbotPostSource = "fallback";

        if (apiKey) {
            const fallbackModel = process.env.GEMINI_FALLBACK_MODEL?.trim();
            const geminiText = await generateGeminiReply(
                apiKey,
                modelName,
                systemInstruction,
                history,
                message.trim(),
                fallbackModel,
            );
            if (geminiText) {
                reply = geminiText;
                source = "gemini";
            }
        }

        if (!reply) {
            reply = getFallbackReply(message, faqs);
            source = "fallback";
        }

        // ---- Enrich: extract product cards from reply ----
        let productCards: ChatbotProductCard[] = [];
        try {
            const slugs = extractProductSlugs(reply);
            if (slugs.length) {
                productCards = await fetchProductCardsForReply(supabase, slugs);
            }
        } catch (e) {
            console.warn("Product card enrichment:", e);
        }

        let convId: string | undefined =
            typeof conversationId === "string" ? conversationId : undefined;
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!convId) {
            const { data: conv } = await supabase
                .from("chatbot_conversations")
                .insert({
                    user_id: user?.id || null,
                    session_id: null,
                })
                .select("id")
                .single();
            convId = conv?.id;
        }

        if (convId) {
            await supabase.from("chatbot_messages").insert([
                { conversation_id: convId, role: "user", content: message },
                { conversation_id: convId, role: "assistant", content: reply },
            ]);
        }

        return NextResponse.json({
            reply,
            conversationId: convId,
            source,
            productCards,
        });
    } catch (error) {
        console.error("Chatbot error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
