import ContactPageContent from "@/components/contact/ContactPageContent";
import { SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Liên hệ",
    description: `Liên hệ ${SITE_NAME} — hotline, email và form hỗ trợ đơn hàng, tư vấn sản phẩm.`,
};

export default function ContactPage() {
    return <ContactPageContent />;
}
