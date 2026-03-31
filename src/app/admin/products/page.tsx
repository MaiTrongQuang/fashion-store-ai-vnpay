import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Edit } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quản lý sản phẩm" };

export default async function AdminProductsPage() {
    const supabase = await createClient();

    const { data: products } = await supabase
        .from("products")
        .select(
            "*, category:categories(name), brand:brands(name), images:product_images(url, is_primary)",
        )
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản Lý Sản Phẩm</h1>
                    <p className="text-muted-foreground">
                        {products?.length || 0} sản phẩm
                    </p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm sản phẩm
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">Ảnh</TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead>Danh mục</TableHead>
                            <TableHead>Thương hiệu</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="w-20">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products?.map((product: any) => {
                            const primaryImage =
                                product.images?.find(
                                    (img: any) => img.is_primary,
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
                                        {(product.category as any)?.name || "-"}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {(product.brand as any)?.name || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-sm">
                                                {formatPrice(
                                                    product.sale_price ||
                                                        product.base_price,
                                                )}
                                            </p>
                                            {product.sale_price && (
                                                <p className="text-xs text-muted-foreground line-through">
                                                    {formatPrice(
                                                        product.base_price,
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                product.is_active
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {product.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                        >
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
