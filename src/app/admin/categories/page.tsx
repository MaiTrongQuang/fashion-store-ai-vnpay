import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CategoryActions } from "./category-actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quản lý danh mục" };

export default async function AdminCategoriesPage() {
    const supabase = await createClient();

    const { data: categories } = await supabase
        .from("categories")
        .select("*, parent:categories!categories_parent_id_fkey(name)")
        .order("sort_order", { ascending: true });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản Lý Danh Mục</h1>
                    <p className="text-muted-foreground">
                        {categories?.length || 0} danh mục
                    </p>
                </div>
                <CategoryActions categories={categories || []} />
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên danh mục</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Danh mục cha</TableHead>
                                <TableHead>Thứ tự</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="w-24">
                                    Thao tác
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories?.map((cat: any) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium text-sm">
                                        {cat.name}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {cat.slug}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {(cat.parent as any)?.name || "—"}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {cat.sort_order}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                cat.is_active
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {cat.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <CategoryActions
                                            categories={categories || []}
                                            editItem={cat}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!categories || categories.length === 0) && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        Chưa có danh mục nào
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
