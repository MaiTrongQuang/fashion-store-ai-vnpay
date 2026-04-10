import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { VNPAY_RESPONSE_CODES } from "@/lib/vnpay";
import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
    title: "Kết Quả Thanh Toán",
};

interface Props {
    searchParams: Promise<{
        status?: string;
        order?: string;
        code?: string;
        txn?: string;
        amount?: string;
        bank?: string;
    }>;
}

export default async function CheckoutResultPage({ searchParams }: Props) {
    const params = await searchParams;
    const { status, order, code, txn, amount, bank } = params;

    const vnpMessage = code ? VNPAY_RESPONSE_CODES[code] : undefined;

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
            description: `Đơn hàng ${order || ""} đã được thanh toán và đặt thành công. Cảm ơn bạn đã mua sắm tại hệ thống!`,
        },
        failed: {
            icon: XCircle,
            iconColor: "text-red-500",
            title: "Thanh Toán Thất Bại",
            description: vnpMessage || `Giao dịch cho đơn hàng ${order || ""} không thành công. Vui lòng thử lại hoặc chọn phương thức khác.`,
        },
        invalid: {
            icon: AlertTriangle,
            iconColor: "text-amber-500",
            title: "Giao Dịch Không Hợp Lệ",
            description: "Chữ ký thanh toán không hợp lệ hoặc dữ liệu bị sai lệch. Vui lòng liên hệ hỗ trợ.",
        },
        error: {
            icon: AlertTriangle,
            iconColor: "text-red-500",
            title: "Lỗi Hệ Thống",
            description: "Đã xảy ra lỗi trong quá trình xử lý giao dịch. Vui lòng kiểm tra lại đơn hàng trong lịch sử mua hàng.",
        }
    };

    const config = configs[status || ""] || configs.invalid;
    const Icon = config.icon;

    return (
        <div className="container mx-auto px-4 py-16">
            <Card className="max-w-xl mx-auto border shadow-sm">
                <CardHeader className="text-center pb-2 pt-8">
                    <Icon className={`h-16 w-16 mx-auto mb-4 ${config.iconColor}`} />
                    <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    <p className="text-muted-foreground text-center px-4">
                        {config.description}
                    </p>

                    {(order || txn || amount || bank) && (
                        <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm mt-6">
                            <div className="flex items-center gap-2 mb-2 font-medium text-foreground">
                                <Receipt className="h-4 w-4" />
                                Chi tiết giao dịch
                            </div>
                            <Separator />
                            {order && (
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-muted-foreground">Mã đơn hàng</span>
                                    <span className="font-medium">{order}</span>
                                </div>
                            )}
                            {txn && (
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-muted-foreground">Mã giao dịch</span>
                                    <span className="font-medium">{txn}</span>
                                </div>
                            )}
                            {bank && (
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-muted-foreground">Ngân hàng</span>
                                    <span className="font-medium">{bank}</span>
                                </div>
                            )}
                            {amount && (
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-muted-foreground">Số tiền</span>
                                    <span className="font-medium text-primary">{formatPrice(Number(amount))}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
                        <Link href="/account/orders" className="w-full sm:w-auto">
                            <Button className="w-full" variant={status === "success" ? "default" : "outline"}>
                                Xem Đơn Hàng
                            </Button>
                        </Link>
                        <Link href="/products" className="w-full sm:w-auto">
                            <Button className="w-full" variant={status === "success" ? "outline" : "default"}>
                                {status === "failed" ? "Thử lại thanh toán" : "Tiếp Tục Mua Sắm"}
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
