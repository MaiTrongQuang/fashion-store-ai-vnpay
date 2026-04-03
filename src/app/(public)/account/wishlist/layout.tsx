import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Danh sách yêu thích",
    description: "Sản phẩm bạn đã lưu tại LUXE Fashion.",
};

export default function WishlistLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
