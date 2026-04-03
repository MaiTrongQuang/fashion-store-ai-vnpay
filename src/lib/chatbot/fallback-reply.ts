import type { ChatbotFaqRow } from "@/lib/chatbot/build-context";
import { SITE_CONTACT } from "@/lib/constants";

/** Trả lời khi không gọi được Gemini hoặc API trả rỗng. */
export function getFallbackReply(
    message: string,
    faqs: ChatbotFaqRow[] | undefined,
): string {
    const lowerMsg = message.toLowerCase();
    const matchedFaq = faqs?.find(
        (f) =>
            f.question.toLowerCase().includes(lowerMsg) ||
            lowerMsg.includes(
                f.question.toLowerCase().split(" ").slice(0, 3).join(" "),
            ),
    );

    if (matchedFaq) {
        return matchedFaq.answer;
    }

    const contactHint = `Liên hệ hotline ${SITE_CONTACT.hotline} hoặc email ${SITE_CONTACT.email}, hoặc trang /contact.`;

    if (lowerMsg.includes("size") || lowerMsg.includes("cỡ")) {
        return `Bạn có thể tham khảo bảng size tại trang chi tiết sản phẩm. Nếu đang phân vân, có thể chọn size lớn hơn một chút. ${contactHint}`;
    }
    if (lowerMsg.includes("giao") || lowerMsg.includes("ship")) {
        return `Thời gian và phí giao hàng chi tiết nằm tại /policies/shipping. ${contactHint}`;
    }
    if (lowerMsg.includes("thanh toán") || lowerMsg.includes("trả tiền")) {
        return `Cửa hàng hỗ trợ thanh toán COD và VNPay (ATM, thẻ, QR tùy cấu hình). Chi tiết xem khi thanh toán và tại /policies/terms. ${contactHint}`;
    }
    if (
        lowerMsg.includes("đổi trả") ||
        lowerMsg.includes("hoàn tiền") ||
        lowerMsg.includes("khiếu nại")
    ) {
        return `Chính sách đổi trả: xem /policies/return. ${contactHint}`;
    }
    if (
        lowerMsg.includes("giảm giá") ||
        lowerMsg.includes("voucher") ||
        lowerMsg.includes("mã")
    ) {
        return `Mã khuyến mãi (nếu có) thường được công bố trên trang chủ hoặc email từ cửa hàng. Mình không thể tự bịa mã giảm giá — bạn kiểm tra banner trang chủ hoặc ${contactHint}`;
    }

    return `Cảm ơn bạn đã liên hệ! Mình có thể gợi ý sản phẩm, hướng dẫn trang chính sách, hoặc cách xem đơn tại /account/orders. ${contactHint}`;
}
