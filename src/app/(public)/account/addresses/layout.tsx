import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Địa chỉ giao hàng",
    description: "Quản lý địa chỉ nhận hàng tại LUXE Fashion.",
};

export default function AddressesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
