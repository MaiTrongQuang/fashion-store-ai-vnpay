import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    TrendingUp,
    Clock,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
    const supabase = await createClient();

    const [
        { count: productCount },
        { count: orderCount },
        { count: customerCount },
        { data: recentOrders },
        { data: revenueData },
    ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "customer"),
        supabase
            .from("orders")
            .select("*, profile:profiles(full_name)")
            .order("created_at", { ascending: false })
            .limit(5),
        supabase
            .from("orders")
            .select("total, status")
            .in("status", ["paid", "processing", "shipping", "completed"]),
    ]);

    const totalRevenue =
        revenueData?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

    const stats = [
        {
            title: "Tổng doanh thu",
            value: formatPrice(totalRevenue),
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            title: "Đơn hàng",
            value: orderCount?.toString() || "0",
            icon: ShoppingCart,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            title: "Sản phẩm",
            value: productCount?.toString() || "0",
            icon: Package,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            title: "Khách hàng",
            value: customerCount?.toString() || "0",
            icon: Users,
            color: "text-orange-600",
            bg: "bg-orange-50",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Tổng quan hệ thống quản lý LUXE Fashion
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {stat.value}
                                    </p>
                                </div>
                                <div
                                    className={`h-12 w-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}
                                >
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Orders */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Đơn Hàng Gần Đây
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {recentOrders && recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {recentOrders.map((order) => {
                                const statusInfo = ORDER_STATUS_MAP[
                                    order.status
                                ] || {
                                    label: order.status,
                                    color: "bg-gray-100 text-gray-800",
                                };
                                return (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {order.order_number}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(order.profile as any)
                                                        ?.full_name ||
                                                        "Khách"}{" "}
                                                    •{" "}
                                                    {formatDate(
                                                        order.created_at,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                className={statusInfo.color}
                                                variant="secondary"
                                            >
                                                {statusInfo.label}
                                            </Badge>
                                            <span className="font-semibold text-sm">
                                                {formatPrice(
                                                    Number(order.total),
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">
                            Chưa có đơn hàng nào
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
