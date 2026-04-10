import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Percent,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import { RevenueAreaChart } from "@/components/admin/charts/revenue-area-chart";
import { OrderStatusPieChart } from "@/components/admin/charts/order-status-pie-chart";
import { TopProductsBarChart } from "@/components/admin/charts/top-products-bar-chart";
import { PaymentMethodRadialChart } from "@/components/admin/charts/payment-method-radial-chart";
import { NewCustomersLineChart } from "@/components/admin/charts/new-customers-line-chart";
import { CategoryRevenueBarChart } from "@/components/admin/charts/category-revenue-bar-chart";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
    const supabase = await createClient();

    // ── Parallel data fetching ──
    const [
        { count: productCount },
        { count: orderCount },
        { count: customerCount },
        { data: recentOrders },
        { data: allOrders },
        { data: allProfiles },
        { data: orderItems },
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
            .limit(8),
        supabase
            .from("orders")
            .select("total, status, payment_method, created_at"),
        supabase.from("profiles").select("created_at, role"),
        supabase
            .from("order_items")
            .select(
                "product_name, quantity, price, order:orders(status), variant:product_variants(product:products(category:categories(name)))"
            ),
    ]);

    // ── Compute stats ──
    const paidStatuses = ["paid", "processing", "shipping", "completed"];
    const totalRevenue =
        allOrders
            ?.filter((o: any) => paidStatuses.includes(o.status))
            .reduce((sum: number, o: any) => sum + Number(o.total), 0) || 0;

    const completedOrders =
        allOrders?.filter((o: any) => o.status === "completed").length || 0;
    const totalOrders = orderCount || 0;
    const conversionRate =
        totalOrders > 0
            ? Math.round((completedOrders / totalOrders) * 100)
            : 0;

    // Revenue this month vs last month
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthRevenue =
        allOrders
            ?.filter(
                (o: any) =>
                    paidStatuses.includes(o.status) &&
                    new Date(o.created_at) >= thisMonthStart
            )
            .reduce((s: number, o: any) => s + Number(o.total), 0) || 0;

    const lastMonthRevenue =
        allOrders
            ?.filter(
                (o: any) =>
                    paidStatuses.includes(o.status) &&
                    new Date(o.created_at) >= lastMonthStart &&
                    new Date(o.created_at) <= lastMonthEnd
            )
            .reduce((s: number, o: any) => s + Number(o.total), 0) || 0;

    const revenueChange =
        lastMonthRevenue > 0
            ? Math.round(
                  ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) *
                      100
              )
            : thisMonthRevenue > 0
              ? 100
              : 0;

    const stats = [
        {
            title: "Tổng doanh thu",
            value: formatPrice(totalRevenue),
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-950/40",
            change: revenueChange,
        },
        {
            title: "Đơn hàng",
            value: totalOrders.toString(),
            icon: ShoppingCart,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-950/40",
        },
        {
            title: "Sản phẩm",
            value: (productCount ?? 0).toString(),
            icon: Package,
            color: "text-purple-600",
            bg: "bg-purple-50 dark:bg-purple-950/40",
        },
        {
            title: "Khách hàng",
            value: (customerCount ?? 0).toString(),
            icon: Users,
            color: "text-orange-600",
            bg: "bg-orange-50 dark:bg-orange-950/40",
        },
        {
            title: "Tỷ lệ hoàn thành",
            value: `${conversionRate}%`,
            icon: Percent,
            color: "text-teal-600",
            bg: "bg-teal-50 dark:bg-teal-950/40",
        },
        {
            title: "Tháng này",
            value: formatPrice(thisMonthRevenue),
            icon: DollarSign,
            color: "text-indigo-600",
            bg: "bg-indigo-50 dark:bg-indigo-950/40",
            change: revenueChange,
        },
    ];

    // ── Chart Data: Revenue by Month ──
    const revenueByMonth: Record<string, number> = {};
    allOrders
        ?.filter((o: any) => paidStatuses.includes(o.status))
        .forEach((o: any) => {
            const d = new Date(o.created_at);
            const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
            revenueByMonth[key] = (revenueByMonth[key] || 0) + Number(o.total);
        });

    // Build last 12 months
    const revenueChartData = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
        const shortLabel = `T${d.getMonth() + 1}`;
        revenueChartData.push({
            month: shortLabel,
            revenue: revenueByMonth[key] || 0,
        });
    }

    // ── Chart Data: Order Status Distribution ──
    const orderStatusCounts: Record<string, number> = {};
    allOrders?.forEach((o: any) => {
        orderStatusCounts[o.status] = (orderStatusCounts[o.status] || 0) + 1;
    });

    // ── Chart Data: Top Products ──
    const productSales: Record<string, number> = {};
    orderItems
        ?.filter((i: any) => {
            const orderStatus = (i.order as any)?.status;
            return paidStatuses.includes(orderStatus);
        })
        .forEach((i: any) => {
            const name = i.product_name || "N/A";
            productSales[name] = (productSales[name] || 0) + i.quantity;
        });

    const topProducts = Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([name, quantity]) => ({
            name: name.length > 20 ? name.slice(0, 20) + "…" : name,
            quantity,
        }));

    // ── Chart Data: Payment Methods ──
    const paymentMethods: Record<string, number> = {};
    allOrders?.forEach((o: any) => {
        paymentMethods[o.payment_method] =
            (paymentMethods[o.payment_method] || 0) + 1;
    });

    // ── Chart Data: New Customers by Month ──
    const customersByMonth: Record<string, number> = {};
    allProfiles
        ?.filter((p: any) => p.role === "customer")
        .forEach((p: any) => {
            const d = new Date(p.created_at);
            const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
            customersByMonth[key] = (customersByMonth[key] || 0) + 1;
        });

    const customersChartData = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
        const shortLabel = `T${d.getMonth() + 1}`;
        customersChartData.push({
            month: shortLabel,
            count: customersByMonth[key] || 0,
        });
    }

    // ── Chart Data: Category Revenue ──
    const categoryRevenue: Record<string, number> = {};
    orderItems
        ?.filter((i: any) => {
            const orderStatus = (i.order as any)?.status;
            return paidStatuses.includes(orderStatus);
        })
        .forEach((i: any) => {
            const catName =
                (i.variant as any)?.product?.category?.name || "Khác";
            categoryRevenue[catName] =
                (categoryRevenue[catName] || 0) + Number(i.price) * i.quantity;
        });

    const categoryChartData = Object.entries(categoryRevenue)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([name, revenue]) => ({ name, revenue }));

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Tổng quan hệ thống quản lý LUXE Fashion
                </p>
            </div>

            {/* Stats Grid — 6 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {stats.map((stat, index: number) => (
                    <Card key={index} className="border-0 shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {stat.title}
                                </p>
                                <div
                                    className={`h-9 w-9 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}
                                >
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="text-xl font-bold">{stat.value}</p>
                            {stat.change !== undefined && (
                                <div className="flex items-center gap-1 mt-1">
                                    {stat.change >= 0 ? (
                                        <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                                    )}
                                    <span
                                        className={`text-xs font-medium ${stat.change >= 0 ? "text-emerald-600" : "text-red-500"}`}
                                    >
                                        {Math.abs(stat.change)}% so với tháng
                                        trước
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row 1: Revenue + Order Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <RevenueAreaChart data={revenueChartData} />
                </div>
                <OrderStatusPieChart data={orderStatusCounts} />
            </div>

            {/* Charts Row 2: Top Products + Payment Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <TopProductsBarChart data={topProducts} />
                </div>
                <PaymentMethodRadialChart data={paymentMethods} />
            </div>

            {/* Charts Row 3: Customers + Category Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <NewCustomersLineChart data={customersChartData} />
                <CategoryRevenueBarChart data={categoryChartData} />
            </div>

            {/* Recent Orders */}
            <Card className="border-0 shadow-sm">
                <div className="p-6 pb-3">
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-base font-semibold">
                            Đơn Hàng Gần Đây
                        </h2>
                    </div>
                </div>
                <CardContent className="pt-0">
                    {recentOrders && recentOrders.length > 0 ? (
                        <div className="space-y-3">
                            {recentOrders.map((order: any) => {
                                const statusInfo = ORDER_STATUS_MAP[
                                    order.status
                                ] || {
                                    label: order.status,
                                    color: "bg-gray-100 text-gray-800",
                                };
                                return (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm truncate">
                                                    {order.order_number}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {(order.profile as any)
                                                        ?.full_name ||
                                                        "Khách"}{" "}
                                                    •{" "}
                                                    {formatDate(
                                                        order.created_at
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <Badge
                                                className={statusInfo.color}
                                                variant="secondary"
                                            >
                                                {statusInfo.label}
                                            </Badge>
                                            <span className="font-semibold text-sm">
                                                {formatPrice(
                                                    Number(order.total)
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
