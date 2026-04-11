import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đánh giá của tôi",
    description: "Các đánh giá sản phẩm bạn đã gửi tại Nana Store.",
};

export default function ReviewsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
