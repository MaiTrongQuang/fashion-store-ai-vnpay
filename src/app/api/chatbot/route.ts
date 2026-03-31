import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { message, conversationId } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 },
            );
        }

        // Get FAQs for context
        const { data: faqs } = await supabase
            .from("chatbot_faqs")
            .select("question, answer, category")
            .eq("is_active", true)
            .order("sort_order");

        // Get some product data for recommendations
        const { data: products } = await supabase
            .from("products")
            .select(
                "name, slug, base_price, sale_price, description, category:categories(name)",
            )
            .eq("is_active", true)
            .limit(20);

        // Build context
        const faqContext = faqs
            ?.map((f) => `Q: ${f.question}\nA: ${f.answer}`)
            .join("\n\n");

        const productContext = products
            ?.map(
                (p) =>
                    `- ${p.name} (${(p.category as any)?.name || ""}): ${
                        p.sale_price
                            ? `Giá ${p.sale_price.toLocaleString()}đ (giảm từ ${p.base_price.toLocaleString()}đ)`
                            : `Giá ${p.base_price.toLocaleString()}đ`
                    }`,
            )
            .join("\n");

        const systemPrompt = `Bạn là trợ lý mua sắm AI của LUXE Fashion - cửa hàng thời trang trực tuyến.
Nhiệm vụ:
- Tư vấn sản phẩm thời trang phù hợp nhu cầu khách hàng
- Trả lời các câu hỏi về chính sách, giao hàng, đổi trả, thanh toán
- Gợi ý sản phẩm dựa trên sở thích: giới tính, phong cách, màu sắc, giá, size
- Trả lời bằng tiếng Việt, thân thiện, chuyên nghiệp
- Nếu không biết câu trả lời, hướng dẫn liên hệ hotline 1900-xxxx

FAQ tham khảo:
${faqContext}

Danh sách sản phẩm hiện có:
${productContext}

Hãy trả lời ngắn gọn, hữu ích và thân thiện.`;

        // Try to use OpenAI API if available
        let reply = "";

        if (process.env.OPENAI_API_KEY) {
            try {
                const response = await fetch(
                    "https://api.openai.com/v1/chat/completions",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                        },
                        body: JSON.stringify({
                            model: "gpt-3.5-turbo",
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: message },
                            ],
                            max_tokens: 500,
                            temperature: 0.7,
                        }),
                    },
                );

                const data = await response.json();
                reply = data.choices?.[0]?.message?.content || "";
            } catch {
                // Fallback if API fails
            }
        }

        // Fallback: Simple FAQ matching
        if (!reply) {
            const lowerMsg = message.toLowerCase();
            const matchedFaq = faqs?.find(
                (f) =>
                    f.question.toLowerCase().includes(lowerMsg) ||
                    lowerMsg.includes(
                        f.question
                            .toLowerCase()
                            .split(" ")
                            .slice(0, 3)
                            .join(" "),
                    ),
            );

            if (matchedFaq) {
                reply = matchedFaq.answer;
            } else if (lowerMsg.includes("size") || lowerMsg.includes("cỡ")) {
                reply =
                    "Bạn có thể tham khảo bảng size tại trang chi tiết sản phẩm. Nếu đang phân vân, hãy chọn size lớn hơn. Liên hệ hotline 1900-xxxx để được tư vấn chi tiết nhé!";
            } else if (lowerMsg.includes("giao") || lowerMsg.includes("ship")) {
                reply =
                    "Giao hàng nội thành HCM/HN mất 1-2 ngày, tỉnh khác 3-5 ngày. Đơn trên 500K được miễn phí ship! 🚚";
            } else if (
                lowerMsg.includes("thanh toán") ||
                lowerMsg.includes("trả")
            ) {
                reply =
                    "LUXE Fashion hỗ trợ thanh toán COD và VNPay. VNPay hỗ trợ ATM, Visa, MasterCard và QR Code. Chính sách đổi trả trong 7 ngày! 💳";
            } else if (
                lowerMsg.includes("giảm giá") ||
                lowerMsg.includes("voucher") ||
                lowerMsg.includes("mã")
            ) {
                reply =
                    "Bạn có thể kiểm tra mã giảm giá tại trang chủ hoặc nhập mã WELCOME10 để được giảm 10% cho đơn đầu tiên! Nhập mã tại bước thanh toán nhé! 🎉";
            } else {
                reply =
                    "Cảm ơn bạn đã liên hệ LUXE Fashion! Mình có thể giúp bạn tìm sản phẩm phù hợp, tư vấn size, hoặc giải đáp các thắc mắc về đơn hàng. Bạn cần hỗ trợ gì nhé? 😊";
            }
        }

        // Save to conversation if user is logged in
        let convId = conversationId;
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
        });
    } catch (error) {
        console.error("Chatbot error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
