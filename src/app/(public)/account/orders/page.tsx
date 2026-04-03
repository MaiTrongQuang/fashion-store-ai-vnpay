import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Package, Truck } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Đơn hàng của tôi" };

export default async function UserOrdersPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">
                    Theo dõi trạng thái và chi tiết từng đơn hàng.
                </p>
            </div>

            {!orders || orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Package
                            className="h-8 w-8 text-muted-foreground"
                            aria-hidden
                        />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Chưa có đơn hàng
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        Khám phá bộ sưu tập mới và thêm sản phẩm vào giỏ để đặt
                        hàng.
                    </p>
                    <Link href="/products" className="mt-6">
                        <Button className="min-h-11 w-full cursor-pointer sm:w-auto">
                            Bắt đầu mua sắm
                        </Button>
                    </Link>
                </div>
            ) : (
                <ul className="space-y-3">
                    {orders.map((order: any) => {
                        const statusInfo = ORDER_STATUS_MAP[order.status] || {
                            label: order.status,
                            color: "bg-muted text-foreground",
                        };
                        return (
                            <li key={order.id}>
                                <Card className="overflow-hidden border-border/50 bg-background/60 transition-[box-shadow] duration-200 hover:shadow-md">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                                            <div className="min-w-0 space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                                                        {order.order_number}
                                                    </span>
                                                    <Badge
                                                        className={
                                                            statusInfo.color
                                                        }
                                                        variant="secondary"
                                                    >
                                                        {statusInfo.label}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Truck
                                                            className="h-3.5 w-3.5 shrink-0"
                                                            aria-hidden
                                                        />
                                                        {formatDate(
                                                            order.created_at,
                                                        )}
                                                    </span>
                                                    <span className="text-border">
                                                        ·
                                                    </span>
                                                    <span>
                                                        {order.payment_method ===
                                                        "vnpay"
                                                            ? "VNPay"
                                                            : "COD"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border/40 pt-4 sm:border-t-0 sm:pt-0">
                                                <p className="text-lg font-bold tabular-nums text-foreground">
                                                    {formatPrice(
                                                        Number(order.total),
                                                    )}
                                                </p>
                                                <Link
                                                    href={`/account/orders/${order.id}`}
                                                    className="shrink-0"
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="min-h-11 w-full cursor-pointer gap-1 sm:w-auto"
                                                    >
                                                        Chi tiết
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
