import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_MAP, PAYMENT_METHOD_MAP } from "@/lib/constants";
import { notFound } from "next/navigation";
import { OrderStatusActions } from "./order-status-actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Chi tiết đơn hàng" };

export default async function AdminOrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: order } = await supabase
        .from("orders")
        .select(
            "*, profile:profiles(full_name, email, phone), items:order_items(*), payment:payments(*), voucher:vouchers(code, type, value)"
        )
        .eq("id", id)
        .single();

    if (!order) notFound();

    const statusInfo = ORDER_STATUS_MAP[order.status] || {
        label: order.status,
        color: "bg-gray-100 text-gray-800",
    };

    const statusFlow = [
        "pending",
        "awaiting_payment",
        "paid",
        "processing",
        "shipping",
        "completed",
    ];
    const currentIndex = statusFlow.indexOf(order.status);

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        {order.order_number}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Tạo lúc {formatDate(order.created_at)}
                    </p>
                </div>
                <Badge className={`${statusInfo.color} text-sm px-4 py-1`} variant="secondary">
                    {statusInfo.label}
                </Badge>
            </div>

            {/* Status Timeline */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                        Tiến trình đơn hàng
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-1 overflow-x-auto pb-2">
                        {statusFlow.map((st, idx) => {
                            const info = ORDER_STATUS_MAP[st];
                            const isActive = idx <= currentIndex;
                            const isCurrent = st === order.status;
                            return (
                                <div
                                    key={st}
                                    className="flex items-center gap-1 flex-shrink-0"
                                >
                                    <div
                                        className={`h-8 px-3 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                                            isCurrent
                                                ? "bg-primary text-primary-foreground"
                                                : isActive
                                                  ? "bg-primary/20 text-foreground"
                                                  : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {info?.label || st}
                                    </div>
                                    {idx < statusFlow.length - 1 && (
                                        <div
                                            className={`w-6 h-0.5 ${isActive ? "bg-primary" : "bg-muted"}`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Status Update Actions */}
                    {order.status !== "completed" &&
                        order.status !== "cancelled" && (
                            <div className="mt-4 pt-4 border-t">
                                <OrderStatusActions
                                    orderId={order.id}
                                    currentStatus={order.status}
                                />
                            </div>
                        )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Khách hàng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p>
                            <span className="text-muted-foreground">Tên:</span>{" "}
                            <span className="font-medium">
                                {(order.profile as any)?.full_name || "Khách"}
                            </span>
                        </p>
                        <p>
                            <span className="text-muted-foreground">
                                Email:
                            </span>{" "}
                            {(order.profile as any)?.email}
                        </p>
                        <p>
                            <span className="text-muted-foreground">SĐT:</span>{" "}
                            {(order.profile as any)?.phone || order.shipping_phone}
                        </p>
                    </CardContent>
                </Card>

                {/* Shipping Info */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                            Giao hàng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p>
                            <span className="text-muted-foreground">
                                Người nhận:
                            </span>{" "}
                            <span className="font-medium">
                                {order.shipping_name}
                            </span>
                        </p>
                        <p>
                            <span className="text-muted-foreground">SĐT:</span>{" "}
                            {order.shipping_phone}
                        </p>
                        <p>
                            <span className="text-muted-foreground">
                                Địa chỉ:
                            </span>{" "}
                            {order.shipping_address}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Order Items */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Sản phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {(order.items as any[])?.map((item: any) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-accent/30"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {item.product_image && (
                                        <img
                                            src={item.product_image}
                                            alt={item.product_name}
                                            className="w-12 h-12 object-cover rounded-lg"
                                        />
                                    )}
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm truncate">
                                            {item.product_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.color} / {item.size} × {item.quantity}
                                        </p>
                                    </div>
                                </div>
                                <span className="font-semibold text-sm flex-shrink-0">
                                    {formatPrice(
                                        Number(item.price) * item.quantity
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Summary */}
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Tạm tính
                            </span>
                            <span>{formatPrice(Number(order.subtotal))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Phí giao hàng
                            </span>
                            <span>
                                {formatPrice(Number(order.shipping_fee))}
                            </span>
                        </div>
                        {Number(order.discount) > 0 && (
                            <div className="flex justify-between text-emerald-600">
                                <span>
                                    Giảm giá
                                    {(order.voucher as any)?.code &&
                                        ` (${(order.voucher as any).code})`}
                                </span>
                                <span>
                                    -{formatPrice(Number(order.discount))}
                                </span>
                            </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-bold text-base">
                            <span>Tổng cộng</span>
                            <span>{formatPrice(Number(order.total))}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Info */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>
                        <span className="text-muted-foreground">
                            Phương thức:
                        </span>{" "}
                        {PAYMENT_METHOD_MAP[order.payment_method] ||
                            order.payment_method}
                    </p>
                    {(order.payment as any[])?.map((p: any) => (
                        <div key={p.id}>
                            <p>
                                <span className="text-muted-foreground">
                                    Trạng thái TT:
                                </span>{" "}
                                <Badge variant="outline" className="text-xs">
                                    {p.status}
                                </Badge>
                            </p>
                            {p.vnpay_transaction_no && (
                                <p>
                                    <span className="text-muted-foreground">
                                        Mã GD VNPay:
                                    </span>{" "}
                                    {p.vnpay_transaction_no}
                                </p>
                            )}
                            {p.paid_at && (
                                <p>
                                    <span className="text-muted-foreground">
                                        Thanh toán lúc:
                                    </span>{" "}
                                    {formatDate(p.paid_at)}
                                </p>
                            )}
                        </div>
                    ))}
                    {order.note && (
                        <p>
                            <span className="text-muted-foreground">
                                Ghi chú:
                            </span>{" "}
                            {order.note}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
