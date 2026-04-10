import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { BannerActions } from "./banner-actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quản lý banner" };

export default async function AdminBannersPage() {
    const supabase = await createClient();
    const { data: banners } = await supabase
        .from("banners")
        .select("*")
        .order("sort_order", { ascending: true });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản Lý Banner</h1>
                    <p className="text-muted-foreground">{banners?.length || 0} banner</p>
                </div>
                <BannerActions />
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-24">Ảnh</TableHead>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>Phụ đề</TableHead>
                                <TableHead>Link</TableHead>
                                <TableHead>Thứ tự</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="w-24">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {banners?.map((b: any) => (
                                <TableRow key={b.id}>
                                    <TableCell>
                                        <img src={b.image_url} alt={b.title} className="w-20 h-12 object-cover rounded-lg" />
                                    </TableCell>
                                    <TableCell className="font-medium text-sm">{b.title}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{b.subtitle || "—"}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">{b.link_url || "—"}</TableCell>
                                    <TableCell className="text-sm">{b.sort_order}</TableCell>
                                    <TableCell>
                                        <Badge variant={b.is_active ? "default" : "secondary"}>
                                            {b.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <BannerActions editItem={b} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!banners || banners.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        Chưa có banner nào
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
