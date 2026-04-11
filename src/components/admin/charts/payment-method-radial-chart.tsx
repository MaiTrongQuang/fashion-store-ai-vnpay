"use client";

import {
    RadialBarChart,
    RadialBar,
    Legend,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";

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
                <div className="h-[300px] w-full min-w-0">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
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
                            <Tooltip
                                formatter={(value: any, name: any) => [
                                    `${value}%`,
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
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
