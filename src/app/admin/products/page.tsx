import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ProductToggle } from "./product-toggle";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quản lý sản phẩm" };

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; page?: string }>;
}) {
    const params = await searchParams;
    const supabase = await createClient();
    const searchQuery = params.search || "";
    const currentPage = Number(params.page) || 1;
    const pageSize = 20;

    let query = supabase
        .from("products")
        .select(
            "*, category:categories(name), brand:brands(name), images:product_images(url, is_primary)",
            { count: "exact" }
        )
        .order("created_at", { ascending: false });

    if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
    }

    const from = (currentPage - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);

    const { data: products, count } = await query;
    const totalPages = Math.ceil((count || 0) / pageSize);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản Lý Sản Phẩm</h1>
                    <p className="text-muted-foreground">
                        {count || 0} sản phẩm
                    </p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm sản phẩm
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <form className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="search"
                                placeholder="Tìm tên sản phẩm..."
                                defaultValue={searchQuery}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Tìm
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">Ảnh</TableHead>
                                <TableHead>Tên sản phẩm</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Thương hiệu</TableHead>
                                <TableHead>Giá</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="w-24">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products?.map((product: any) => {
                                const primaryImage =
                                    product.images?.find(
                                        (img: any) => img.is_primary
                                    ) || product.images?.[0];
                                return (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                                {primaryImage && (
                                                    <Image
                                                        src={primaryImage.url}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {product.slug}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {(product.category as any)?.name ||
                                                "-"}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {(product.brand as any)?.name ||
                                                "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {formatPrice(
                                                        product.sale_price ||
                                                            product.base_price
                                                    )}
                                                </p>
                                                {product.sale_price && (
                                                    <p className="text-xs text-muted-foreground line-through">
                                                        {formatPrice(
                                                            product.base_price
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <ProductToggle
                                                productId={product.id}
                                                isActive={product.is_active}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {(!products || products.length === 0) && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        Không có sản phẩm nào
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
                            <Link
                                key={p}
                                href={`/admin/products?search=${searchQuery}&page=${p}`}
                            >
                                <Button
                                    variant={
                                        p === currentPage
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                >
                                    {p}
                                </Button>
                            </Link>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
