"use client";

import { RadialBarChart, RadialBar, Legend } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { AdminChartTooltip } from "@/components/admin/charts/admin-chart-tooltip";
import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart";

const paymentRadialChartConfig = {
    value: {
        label: "Tỷ lệ",
    },
} satisfies ChartConfig;

interface PaymentData {
    name: string;
    value: number;
    fill: string;
}

export function PaymentMethodRadialChart({
    data,
}: {
    data: Record<string, number>;
}) {
    const total = Object.values(data).reduce((s, v) => s + v, 0) || 1;
    const chartData: PaymentData[] = [
        {
            name: "COD",
            value: Math.round(((data.cod || 0) / total) * 100),
            fill: "#475569",
        },
        {
            name: "VNPay",
            value: Math.round(((data.vnpay || 0) / total) * 100),
            fill: "#3b82f6",
        },
    ].filter((d) => d.value > 0);

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-indigo-600" />
                    <CardTitle className="text-base">
                        Phương thức thanh toán
                    </CardTitle>
                </div>
                <CardDescription>Tỷ lệ COD vs VNPay</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={paymentRadialChartConfig}
                    className="aspect-auto h-[300px] w-full min-w-0"
                    initialDimension={{ width: 320, height: 300 }}
                >
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="30%"
                        outerRadius="90%"
                        barSize={20}
                        data={chartData}
                    >
                        <RadialBar
                            dataKey="value"
                            cornerRadius={6}
                            background={{ fill: "hsl(var(--muted))" }}
                        />
                        <ChartTooltip
                            content={
                                <AdminChartTooltip
                                    valueFormatter={(value) =>
                                        `${value ?? 0}%`
                                    }
                                />
                            }
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
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
