"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { FolderTree } from "lucide-react";
import { AdminChartTooltip } from "@/components/admin/charts/admin-chart-tooltip";
import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart";

const categoryRevenueChartConfig = {
    revenue: {
        label: "Doanh thu",
        color: "#1e293b",
    },
} satisfies ChartConfig;

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
                <ChartContainer
                    config={categoryRevenueChartConfig}
                    className="aspect-auto h-[300px] w-full min-w-0"
                    initialDimension={{ width: 320, height: 300 }}
                >
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
                            <ChartTooltip
                                content={
                                    <AdminChartTooltip
                                        valueFormatter={(value) =>
                                            new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(Number(value || 0))
                                        }
                                    />
                                }
                                cursor={{
                                    fill: "transparent",
                                    stroke: "hsl(var(--muted-foreground) / 0.4)",
                                    strokeWidth: 1,
                                }}
                            />
                            <Bar
                                dataKey="revenue"
                                fill="#1e293b"
                                radius={[4, 4, 0, 0]}
                            />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
