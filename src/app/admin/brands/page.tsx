import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { BrandActions } from "./brand-actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quản lý thương hiệu" };

export default async function AdminBrandsPage() {
    const supabase = await createClient();
    const { data: brands } = await supabase
        .from("brands")
        .select("*")
        .order("name", { ascending: true });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản Lý Thương Hiệu</h1>
                    <p className="text-muted-foreground">
                        {brands?.length || 0} thương hiệu
                    </p>
                </div>
                <BrandActions />
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên thương hiệu</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Mô tả</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="w-24">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {brands?.map((brand: any) => (
                                <TableRow key={brand.id}>
                                    <TableCell className="font-medium text-sm">
                                        <div className="flex items-center gap-2">
                                            {brand.logo_url && (
                                                <img
                                                    src={brand.logo_url}
                                                    alt={brand.name}
                                                    className="w-8 h-8 object-contain rounded"
                                                />
                                            )}
                                            {brand.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {brand.slug}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                                        {brand.description || "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={brand.is_active ? "default" : "secondary"}>
                                            {brand.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <BrandActions editItem={brand} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!brands || brands.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Chưa có thương hiệu nào
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
