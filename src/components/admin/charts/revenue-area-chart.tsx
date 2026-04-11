"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface RevenueData {
    month: string;
    revenue: number;
}

export function RevenueAreaChart({ data }: { data: RevenueData[] }) {
    const formatVND = (value: number) => {
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}tr`;
        if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
        return value.toString();
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <CardTitle className="text-base">Doanh thu theo tháng</CardTitle>
                </div>
                <CardDescription>
                    Biểu đồ doanh thu 12 tháng gần nhất
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full min-w-0">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                        initialDimension={{ width: 320, height: 300 }}
                    >
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient
                                    id="revenueGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="hsl(142, 76%, 36%)"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="hsl(142, 76%, 36%)"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                className="stroke-muted"
                            />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12 }}
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
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="hsl(142, 76%, 36%)"
                                strokeWidth={2}
                                fill="url(#revenueGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
