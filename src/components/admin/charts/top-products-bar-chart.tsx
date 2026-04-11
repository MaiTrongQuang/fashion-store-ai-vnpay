"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Package } from "lucide-react";
import {
    AdminChartTooltip,
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/admin/charts/admin-chart-tooltip";

interface ProductData {
    name: string;
    quantity: number;
}

const BAR_COLORS = [
    "#1e293b",
    "#334155",
    "#475569",
    "#64748b",
    "#94a3b8",
    "#cbd5e1",
    "#e2e8f0",
    "#f1f5f9",
];

const topProductsChartConfig = {
    quantity: {
        label: "Đã bán",
        color: BAR_COLORS[0],
    },
} satisfies ChartConfig;

export function TopProductsBarChart({ data }: { data: ProductData[] }) {
    if (data.length === 0) {
        return (
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-purple-600" />
                        <CardTitle className="text-base">
                            Top sản phẩm bán chạy
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
                    <Package className="h-4 w-4 text-purple-600" />
                    <CardTitle className="text-base">
                        Top sản phẩm bán chạy
                    </CardTitle>
                </div>
                <CardDescription>Theo số lượng đã bán</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={topProductsChartConfig}
                    className="aspect-auto h-[300px] w-full min-w-0"
                    initialDimension={{ width: 320, height: 300 }}
                >
                    <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ left: 20, right: 20 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                className="stroke-muted"
                                horizontal={false}
                            />
                            <XAxis type="number" tick={{ fontSize: 12 }} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                tick={{ fontSize: 11 }}
                                width={120}
                                className="fill-muted-foreground"
                            />
                            <ChartTooltip
                                content={
                                    <AdminChartTooltip
                                        valueFormatter={(value) =>
                                            `${value ?? 0} sản phẩm`
                                        }
                                    />
                                }
                                cursor={{
                                    fill: "transparent",
                                    stroke: "hsl(var(--muted-foreground) / 0.4)",
                                    strokeWidth: 1,
                                }}
                            />
                            <Bar dataKey="quantity" radius={[0, 4, 4, 0]}>
                                {data.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            BAR_COLORS[
                                                index % BAR_COLORS.length
                                            ]
                                        }
                                    />
                                ))}
                            </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
