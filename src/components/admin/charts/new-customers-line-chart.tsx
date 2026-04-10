"use client";

import {
    LineChart,
    Line,
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
import { Users } from "lucide-react";

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
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
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
                            <Tooltip
                                formatter={(value: any) => [
                                    `${value} khách`,
                                    "Mới",
                                ]}
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid hsl(var(--border))",
                                    background: "hsl(var(--card))",
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
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
