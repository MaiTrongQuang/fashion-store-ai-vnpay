import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    CreditCard,
    MapPinned,
    Package,
    Receipt,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import {
    ORDER_STATUS_MAP,
    PAYMENT_METHOD_MAP,
} from "@/lib/constants";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { title: "Chi tiết đơn hàng" };

    const { data: order } = await supabase
        .from("orders")
        .select("order_number")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    return {
        title: order?.order_number
            ? `Đơn ${order.order_number}`
            : "Chi tiết đơn hàng",
    };
}

export default async function AccountOrderDetailPage({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) notFound();

    const { data: order } = await supabase
        .from("orders")
        .select(
            `
      *,
      items:order_items(*),
      payments:payments(*)
    `,
        )
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (!order) notFound();

    const statusInfo = ORDER_STATUS_MAP[order.status] || {
        label: order.status,
        color: "bg-muted text-foreground",
    };

    const payment = Array.isArray(order.payments)
        ? order.payments[0]
        : null;
    const items = (order.items as any[]) || [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="font-mono text-lg font-bold tabular-nums text-foreground">
                        {order.order_number}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Đặt ngày {formatDate(order.created_at)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Badge className={statusInfo.color} variant="secondary">
                            {statusInfo.label}
                        </Badge>
                    </div>
                </div>
                <Link href="/account/orders" className="shrink-0">
                    <Button
                        variant="outline"
                        className="min-h-11 w-full cursor-pointer gap-2 sm:w-auto"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại danh sách
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card className="border-border/50 bg-background/60 shadow-none">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <Package className="h-5 w-5 text-primary" />
                                Sản phẩm
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Không có dòng sản phẩm.
                                </p>
                            ) : (
                                <ul className="divide-y divide-border/60">
                                    {items.map((line: any) => (
                                        <li
                                            key={line.id}
                                            className="flex gap-4 py-4 first:pt-0 last:pb-0"
                                        >
                                            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted">
                                                {line.product_image ? (
                                                    <Image
                                                        src={line.product_image}
                                                        alt={line.product_name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                        —
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium leading-snug text-foreground">
                                                    {line.product_name}
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {line.color} · Size{" "}
                                                    {line.size}
                                                </p>
                                                <p className="mt-2 text-sm">
                                                    <span className="text-muted-foreground">
                                                        SL:{" "}
                                                    </span>
                                                    <span className="font-medium tabular-nums">
                                                        {line.quantity}
                                                    </span>
                                                    <span className="mx-2 text-border">
                                                        ·
                                                    </span>
                                                    <span className="font-semibold tabular-nums">
                                                        {formatPrice(
                                                            Number(
                                                                line.price,
                                                            ) *
                                                                Number(
                                                                    line.quantity,
                                                                ),
                                                        )}
                                                    </span>
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-border/50 bg-background/60 shadow-none">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <Receipt className="h-5 w-5 text-primary" />
                                Tổng thanh toán
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">
                                    Tạm tính
                                </span>
                                <span className="tabular-nums font-medium">
                                    {formatPrice(Number(order.subtotal))}
                                </span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">
                                    Giảm giá
                                </span>
                                <span className="tabular-nums font-medium text-emerald-600 dark:text-emerald-400">
                                    −{formatPrice(Number(order.discount))}
                                </span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">
                                    Phí vận chuyển
                                </span>
                                <span className="tabular-nums font-medium">
                                    {formatPrice(Number(order.shipping_fee))}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between gap-4 text-base">
                                <span className="font-semibold">Thành tiền</span>
                                <span className="tabular-nums text-lg font-bold text-foreground">
                                    {formatPrice(Number(order.total))}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-background/60 shadow-none">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <CreditCard className="h-5 w-5 text-primary" />
                                Thanh toán
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>
                                <span className="text-muted-foreground">
                                    Phương thức:{" "}
                                </span>
                                <span className="font-medium">
                                    {PAYMENT_METHOD_MAP[order.payment_method] ||
                                        order.payment_method}
                                </span>
                            </p>
                            {payment && (
                                <p>
                                    <span className="text-muted-foreground">
                                        Trạng thái:{" "}
                                    </span>
                                    <span className="font-medium capitalize">
                                        {payment.status}
                                    </span>
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-background/60 shadow-none">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <MapPinned className="h-5 w-5 text-primary" />
                                Giao hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="font-medium text-foreground">
                                {order.shipping_name}
                            </p>
                            <p className="tabular-nums text-muted-foreground">
                                {order.shipping_phone}
                            </p>
                            <p className="leading-relaxed text-muted-foreground">
                                {order.shipping_address}
                            </p>
                            {order.note ? (
                                <p className="mt-3 rounded-lg border border-border/50 bg-muted/30 p-3 text-muted-foreground">
                                    <span className="font-medium text-foreground">
                                        Ghi chú:{" "}
                                    </span>
                                    {order.note}
                                </p>
                            ) : null}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
