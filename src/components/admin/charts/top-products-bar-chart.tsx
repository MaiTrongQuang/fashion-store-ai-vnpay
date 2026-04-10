"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Package } from "lucide-react";

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
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
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
                            <Tooltip
                                formatter={(value: any) => [
                                    `${value} sản phẩm`,
                                    "Đã bán",
                                ]}
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid hsl(var(--border))",
                                    background: "hsl(var(--card))",
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
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
