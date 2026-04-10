import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatPrice, formatDate } from "@/lib/utils";
import { VoucherActions } from "./voucher-actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quản lý voucher" };

export default async function AdminVouchersPage() {
    const supabase = await createClient();
    const { data: vouchers } = await supabase
        .from("vouchers")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản Lý Voucher</h1>
                    <p className="text-muted-foreground">{vouchers?.length || 0} voucher</p>
                </div>
                <VoucherActions />
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead>Giá trị</TableHead>
                                <TableHead>Đơn tối thiểu</TableHead>
                                <TableHead>Sử dụng</TableHead>
                                <TableHead>Thời hạn</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="w-24">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vouchers?.map((v: any) => {
                                const isExpired = new Date(v.expires_at) < new Date();
                                const isUsedUp = v.used_count >= v.usage_limit;
                                return (
                                    <TableRow key={v.id}>
                                        <TableCell className="font-mono font-bold text-sm">{v.code}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {v.type === "percentage" ? "Phần trăm" : "Cố định"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium text-sm">
                                            {v.type === "percentage" ? `${v.value}%` : formatPrice(Number(v.value))}
                                        </TableCell>
                                        <TableCell className="text-sm">{formatPrice(Number(v.min_order))}</TableCell>
                                        <TableCell className="text-sm">{v.used_count}/{v.usage_limit}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            <div>{formatDate(v.starts_at).split(",")[0]}</div>
                                            <div>→ {formatDate(v.expires_at).split(",")[0]}</div>
                                        </TableCell>
                                        <TableCell>
                                            {isExpired ? (
                                                <Badge variant="secondary" className="bg-red-50 text-red-600">Hết hạn</Badge>
                                            ) : isUsedUp ? (
                                                <Badge variant="secondary" className="bg-orange-50 text-orange-600">Hết lượt</Badge>
                                            ) : v.is_active ? (
                                                <Badge variant="default">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <VoucherActions editItem={v} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {(!vouchers || vouchers.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        Chưa có voucher nào
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
