import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Thông tin tài khoản",
    description: "Cập nhật hồ sơ và thông tin liên hệ tại Nana Store.",
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
