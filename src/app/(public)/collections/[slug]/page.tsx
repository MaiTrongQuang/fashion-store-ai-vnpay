import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: category } = await supabase
        .from("categories")
        .select("name")
        .eq("slug", slug)
        .single();

    return { title: category?.name || slug };
}

export default async function CollectionPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!category) notFound();

    const { data: products } = await supabase
        .from("products")
        .select(
            "*, category:categories(*), brand:brands(*), images:product_images(*)",
        )
        .eq("is_active", true)
        .eq("category_id", category.id)
        .order("created_at", { ascending: false });

    return (
        <div className="container mx-auto px-4 py-8">
            <nav className="text-sm text-muted-foreground mb-6">
                <a href="/" className="hover:text-primary">
                    Trang chủ
                </a>
                <span className="mx-2">/</span>
                <span className="text-foreground font-medium">
                    {category.name}
                </span>
            </nav>

            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">
                    {category.name}
                </h1>
                {category.description && (
                    <p className="text-muted-foreground mt-2">
                        {category.description}
                    </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                    {products?.length || 0} sản phẩm
                </p>
            </div>

            {products && products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-lg text-muted-foreground">
                        Chưa có sản phẩm nào trong danh mục này
                    </p>
                </div>
            )}
        </div>
    );
}
