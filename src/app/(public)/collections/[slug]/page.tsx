import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, PackageSearch } from "lucide-react";
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
        <div className="bg-background">
            <section className="border-b border-border bg-muted/25">
                <div className="container mx-auto px-4 py-8 md:py-10">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-5 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
                    >
                        <Link href="/" className="hover:text-primary">
                            Trang chủ
                        </Link>
                        <ChevronRight
                            className="h-4 w-4 shrink-0 opacity-60"
                            aria-hidden
                        />
                        <span className="font-medium text-foreground">
                            {category.name}
                        </span>
                    </nav>

                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Danh mục
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                                {category.name}
                            </h1>
                            {category.description && (
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                                    {category.description}
                                </p>
                            )}
                        </div>
                        <span className="inline-flex w-fit items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold tabular-nums">
                            {products?.length || 0} sản phẩm
                        </span>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 md:py-10 lg:py-12">
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 px-6 py-16 text-center md:py-24">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <PackageSearch
                                className="h-8 w-8 text-muted-foreground"
                                aria-hidden
                            />
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Chưa có sản phẩm
                        </h2>
                        <p className="mt-2 max-w-md text-muted-foreground">
                            Danh mục này hiện chưa có sản phẩm đang hiển thị.
                        </p>
                        <Link
                            href="/products"
                            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Xem tất cả sản phẩm
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
