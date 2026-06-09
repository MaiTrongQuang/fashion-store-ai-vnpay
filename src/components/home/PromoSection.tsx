"use client";

import { RotateCcw, ShieldCheck, Truck, WalletCards } from "lucide-react";

const features = [
    {
        icon: Truck,
        title: "Giao hàng nhanh",
        description: "Miễn phí từ 500.000đ",
    },
    {
        icon: RotateCcw,
        title: "Đổi trả 7 ngày",
        description: "Hỗ trợ đổi size, đổi màu",
    },
    {
        icon: ShieldCheck,
        title: "Sản phẩm chọn lọc",
        description: "Ảnh và thông tin rõ ràng",
    },
    {
        icon: WalletCards,
        title: "Thanh toán linh hoạt",
        description: "COD hoặc VNPay an toàn",
    },
];

export default function PromoSection() {
    return (
        <section className="border-b border-border bg-background py-8">
            <div className="container mx-auto px-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="flex items-start gap-3 border-l border-border pl-4 first:border-l-0 first:pl-0 sm:first:border-l sm:first:pl-4 lg:first:border-l-0 lg:first:pl-0"
                            >
                                <Icon
                                    className="mt-0.5 h-5 w-5 shrink-0 text-foreground"
                                    aria-hidden
                                />
                                <div>
                                    <h3 className="text-sm font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
