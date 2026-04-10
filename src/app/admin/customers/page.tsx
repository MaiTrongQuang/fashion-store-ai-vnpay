import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quản lý khách hàng" };

export default async function AdminCustomersPage() {
    const supabase = await createClient();

    // Fetch customers with their order stats
    const { data: customers } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "customer")
        .order("created_at", { ascending: false });

    // Fetch order summaries per user
    const { data: orderStats } = await supabase
        .from("orders")
        .select("user_id, total, status");

    // Compute per-customer stats
    const statsMap: Record<string, { count: number; spent: number }> = {};
    orderStats?.forEach((o: any) => {
        if (!statsMap[o.user_id]) statsMap[o.user_id] = { count: 0, spent: 0 };
        statsMap[o.user_id].count++;
        if (["paid", "processing", "shipping", "completed"].includes(o.status)) {
            statsMap[o.user_id].spent += Number(o.total);
        }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Quản Lý Khách Hàng</h1>
                <p className="text-muted-foreground">{customers?.length || 0} khách hàng</p>
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Họ tên</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>SĐT</TableHead>
                                <TableHead>Số đơn</TableHead>
                                <TableHead>Tổng chi tiêu</TableHead>
                                <TableHead>Ngày đăng ký</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers?.map((c: any) => {
                                const stats = statsMap[c.id] || { count: 0, spent: 0 };
                                return (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold">
                                                    {c.full_name?.charAt(0)?.toUpperCase() || "?"}
                                                </div>
                                                {c.full_name || "—"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{c.email}</TableCell>
                                        <TableCell className="text-sm">{c.phone || "—"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{stats.count}</Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold text-sm">
                                            {formatPrice(stats.spent)}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDate(c.created_at)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {(!customers || customers.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Chưa có khách hàng
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
