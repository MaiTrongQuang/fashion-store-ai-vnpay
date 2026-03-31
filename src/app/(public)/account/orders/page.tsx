import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Package } from "lucide-react";
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
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Đơn Hàng Của Tôi</h2>

            {!orders || orders.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground/40" />
                    <p className="text-muted-foreground">
                        Bạn chưa có đơn hàng nào
                    </p>
                    <Link href="/products">
                        <Button>Bắt Đầu Mua Sắm</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order: any) => {
                        const statusInfo = ORDER_STATUS_MAP[order.status] || {
                            label: order.status,
                            color: "bg-gray-100 text-gray-800",
                        };
                        return (
                            <Card
                                key={order.id}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold">
                                                    {order.order_number}
                                                </p>
                                                <Badge
                                                    className={statusInfo.color}
                                                    variant="secondary"
                                                >
                                                    {statusInfo.label}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(order.created_at)} •{" "}
                                                {order.payment_method ===
                                                "vnpay"
                                                    ? "VNPay"
                                                    : "COD"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold">
                                                {formatPrice(
                                                    Number(order.total),
                                                )}
                                            </span>
                                            <Link
                                                href={`/account/orders/${order.id}`}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
