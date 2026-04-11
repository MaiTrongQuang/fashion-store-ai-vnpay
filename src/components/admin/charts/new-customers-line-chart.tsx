"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { AdminChartTooltip } from "@/components/admin/charts/admin-chart-tooltip";
import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart";

const newCustomersChartConfig = {
    count: {
        label: "Khách mới",
        color: "#f97316",
    },
} satisfies ChartConfig;

interface CustomerData {
    month: string;
    count: number;
}

export function NewCustomersLineChart({ data }: { data: CustomerData[] }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-600" />
                    <CardTitle className="text-base">
                        Khách hàng mới theo tháng
                    </CardTitle>
                </div>
                <CardDescription>Số tài khoản đăng ký mới</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={newCustomersChartConfig}
                    className="aspect-auto h-[300px] w-full min-w-0"
                    initialDimension={{ width: 320, height: 300 }}
                >
                    <LineChart data={data}>
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
                                tick={{ fontSize: 12 }}
                                className="fill-muted-foreground"
                                allowDecimals={false}
                            />
                            <ChartTooltip
                                content={
                                    <AdminChartTooltip
                                        valueFormatter={(value) =>
                                            `${value ?? 0} khách`
                                        }
                                    />
                                }
                                cursor={{
                                    stroke: "hsl(var(--muted-foreground))",
                                    strokeWidth: 1,
                                    strokeDasharray: "4 4",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#f97316"
                                strokeWidth={2}
                                dot={{ fill: "#f97316", r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
