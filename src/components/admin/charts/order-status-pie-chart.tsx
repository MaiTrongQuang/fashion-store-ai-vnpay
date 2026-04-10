"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface StatusData {
    name: string;
    value: number;
    color: string;
}

const STATUS_COLORS: Record<string, { label: string; color: string }> = {
    pending: { label: "Chờ xử lý", color: "#eab308" },
    awaiting_payment: { label: "Chờ thanh toán", color: "#f97316" },
    paid: { label: "Đã thanh toán", color: "#3b82f6" },
    processing: { label: "Đang xử lý", color: "#6366f1" },
    shipping: { label: "Đang giao", color: "#a855f7" },
    completed: { label: "Hoàn thành", color: "#22c55e" },
    cancelled: { label: "Đã hủy", color: "#ef4444" },
    payment_failed: { label: "TT thất bại", color: "#dc2626" },
};

export function OrderStatusPieChart({
    data,
}: {
    data: Record<string, number>;
}) {
    const chartData: StatusData[] = Object.entries(data)
        .filter(([, count]) => count > 0)
        .map(([status, count]) => ({
            name: STATUS_COLORS[status]?.label || status,
            value: count,
            color: STATUS_COLORS[status]?.color || "#94a3b8",
        }));

    if (chartData.length === 0) {
        return (
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                        <CardTitle className="text-base">
                            Đơn hàng theo trạng thái
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-12">
                        Chưa có dữ liệu
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-base">
                        Đơn hàng theo trạng thái
                    </CardTitle>
                </div>
                <CardDescription>Phân bổ trạng thái đơn hàng</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        strokeWidth={0}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any, name: any) => [
                                    `${value} đơn`,
                                    name,
                                ]}
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid hsl(var(--border))",
                                    background: "hsl(var(--card))",
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value: string) => (
                                    <span className="text-xs text-muted-foreground">
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
