import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quản lý đơn hàng" };

export default async function AdminOrdersPage() {
    const supabase = await createClient();

    const { data: orders } = await supabase
        .from("orders")
        .select("*, profile:profiles(full_name, email)")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Quản Lý Đơn Hàng</h1>
                <p className="text-muted-foreground">
                    {orders?.length || 0} đơn hàng
                </p>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã đơn</TableHead>
                            <TableHead>Khách hàng</TableHead>
                            <TableHead>Thanh toán</TableHead>
                            <TableHead>Tổng tiền</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead className="w-20">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders?.map((order) => {
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
                                                {(order.profile as any)?.email}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {order.payment_method === "vnpay"
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
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
