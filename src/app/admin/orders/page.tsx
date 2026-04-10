import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Eye, Search } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quản lý đơn hàng" };

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}) {
    const params = await searchParams;
    const supabase = await createClient();
    const statusFilter = params.status || "all";
    const searchQuery = params.search || "";
    const currentPage = Number(params.page) || 1;
    const pageSize = 20;

    let query = supabase
        .from("orders")
        .select("*, profile:profiles(full_name, email)", { count: "exact" })
        .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
    }

    if (searchQuery) {
        query = query.ilike("order_number", `%${searchQuery}%`);
    }

    const from = (currentPage - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);

    const { data: orders, count } = await query;
    const totalPages = Math.ceil((count || 0) / pageSize);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Quản Lý Đơn Hàng</h1>
                <p className="text-muted-foreground">
                    {count || 0} đơn hàng
                </p>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <form className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="search"
                                placeholder="Tìm mã đơn hàng..."
                                defaultValue={searchQuery}
                                className="pl-9"
                            />
                        </div>
                        <Select name="status" defaultValue={statusFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                {Object.entries(ORDER_STATUS_MAP).map(
                                    ([key, val]) => (
                                        <SelectItem key={key} value={key}>
                                            {val.label}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                        <Button type="submit" variant="secondary">
                            Lọc
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã đơn</TableHead>
                                <TableHead>Khách hàng</TableHead>
                                <TableHead>Thanh toán</TableHead>
                                <TableHead>Tổng tiền</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead className="w-20">
                                    Thao tác
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders?.map((order: any) => {
                                const statusInfo = ORDER_STATUS_MAP[
                                    order.status
                                ] || {
                                    label: order.status,
                                    color: "bg-gray-100 text-gray-800",
                                };
                                return (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium text-sm">
                                            {order.order_number}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {(order.profile as any)
                                                        ?.full_name || "Khách"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {
                                                        (order.profile as any)
                                                            ?.email
                                                    }
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {order.payment_method ===
                                                "vnpay"
                                                    ? "VNPay"
                                                    : "COD"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold text-sm">
                                            {formatPrice(Number(order.total))}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={statusInfo.color}
                                                variant="secondary"
                                            >
                                                {statusInfo.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDate(order.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {(!orders || orders.length === 0) && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        Không có đơn hàng nào
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
                            <Link
                                key={p}
                                href={`/admin/orders?status=${statusFilter}&search=${searchQuery}&page=${p}`}
                            >
                                <Button
                                    variant={
                                        p === currentPage
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                >
                                    {p}
                                </Button>
                            </Link>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
