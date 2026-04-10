"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { FolderTree } from "lucide-react";

interface CategoryData {
    name: string;
    revenue: number;
}

export function CategoryRevenueBarChart({ data }: { data: CategoryData[] }) {
    const formatVND = (value: number) => {
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}tr`;
        if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
        return value.toString();
    };

    if (data.length === 0) {
        return (
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <FolderTree className="h-4 w-4 text-teal-600" />
                        <CardTitle className="text-base">
                            Doanh thu theo danh mục
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
                    <FolderTree className="h-4 w-4 text-teal-600" />
                    <CardTitle className="text-base">
                        Doanh thu theo danh mục
                    </CardTitle>
                </div>
                <CardDescription>
                    Doanh thu từ các danh mục sản phẩm
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                className="stroke-muted"
                            />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 11 }}
                                className="fill-muted-foreground"
                            />
                            <YAxis
                                tickFormatter={formatVND}
                                tick={{ fontSize: 12 }}
                                className="fill-muted-foreground"
                            />
                            <Tooltip
                                formatter={(value: any) => [
                                    new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(Number(value)),
                                    "Doanh thu",
                                ]}
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid hsl(var(--border))",
                                    background: "hsl(var(--card))",
                                }}
                            />
                            <Bar
                                dataKey="revenue"
                                fill="#1e293b"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
