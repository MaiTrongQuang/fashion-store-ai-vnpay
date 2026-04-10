import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ReviewToggle } from "./review-toggle";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quản lý đánh giá" };

export default async function AdminReviewsPage() {
    const supabase = await createClient();

    const { data: reviews } = await supabase
        .from("reviews")
        .select("*, profile:profiles(full_name, email), product:products(name)")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Quản Lý Đánh Giá</h1>
                <p className="text-muted-foreground">{reviews?.length || 0} đánh giá</p>
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Khách hàng</TableHead>
                                <TableHead>Sản phẩm</TableHead>
                                <TableHead>Đánh giá</TableHead>
                                <TableHead>Nội dung</TableHead>
                                <TableHead>Ngày</TableHead>
                                <TableHead>Hiển thị</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews?.map((review: any) => (
                                <TableRow key={review.id}>
                                    <TableCell className="text-sm">
                                        <div>
                                            <p className="font-medium">{(review.profile as any)?.full_name || "Khách"}</p>
                                            <p className="text-xs text-muted-foreground">{(review.profile as any)?.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm font-medium">
                                        {(review.product as any)?.name || "—"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3.5 w-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm max-w-[300px] truncate">
                                        {review.comment || "—"}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(review.created_at)}
                                    </TableCell>
                                    <TableCell>
                                        <ReviewToggle
                                            reviewId={review.id}
                                            isVisible={review.is_visible}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!reviews || reviews.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Chưa có đánh giá nào
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
