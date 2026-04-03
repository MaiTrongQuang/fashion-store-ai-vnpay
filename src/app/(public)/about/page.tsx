import AboutPageContent from "@/components/about/AboutPageContent";
import { SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Về chúng tôi",
    description: `Câu chuyện ${SITE_NAME} — sứ mệnh, giá trị và hành trình đồng hành cùng phong cách của bạn.`,
};

export default function AboutPage() {
    return <AboutPageContent />;
}
