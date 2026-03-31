import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kết Quả Thanh Toán",
};

interface Props {
    searchParams: Promise<{ status?: string; order?: string }>;
}

export default async function CheckoutResultPage({ searchParams }: Props) {
    const params = await searchParams;
    const { status, order } = params;

    const configs: Record<
        string,
        {
            icon: typeof CheckCircle2;
            iconColor: string;
            title: string;
            description: string;
        }
    > = {
        success: {
            icon: CheckCircle2,
            iconColor: "text-emerald-500",
            title: "Đặt Hàng Thành Công!",
            description: `Đơn hàng ${order || ""} đã được đặt thành công. Cảm ơn bạn đã mua sắm tại LUXE Fashion!`,
        },
        failed: {
            icon: XCircle,
            iconColor: "text-red-500",
            title: "Thanh Toán Thất Bại",
            description: `Thanh toán cho đơn hàng ${order || ""} không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.`,
        },
        invalid: {
            icon: AlertTriangle,
            iconColor: "text-amber-500",
            title: "Giao Dịch Không Hợp Lệ",
            description:
                "Thông tin thanh toán không hợp lệ. Vui lòng liên hệ hỗ trợ.",
        },
    };

    const config = configs[status || ""] || configs.invalid;
    const Icon = config.icon;

    return (
        <div className="container mx-auto px-4 py-16">
            <Card className="max-w-lg mx-auto border-0 shadow-2xl">
                <CardContent className="text-center py-12 space-y-6">
                    <Icon className={`h-20 w-20 mx-auto ${config.iconColor}`} />
                    <h1 className="text-2xl font-bold">{config.title}</h1>
                    <p className="text-muted-foreground">
                        {config.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        {status === "success" && (
                            <Link href="/account/orders">
                                <Button>Xem Đơn Hàng</Button>
                            </Link>
                        )}
                        <Link href="/products">
                            <Button variant="outline">Tiếp Tục Mua Sắm</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
