import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import ProductCard from "@/components/product/ProductCard";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: product } = await supabase
        .from("products")
        .select("name, description")
        .eq("slug", slug)
        .single();

    if (!product) return {};

    return {
        title: product.name,
        description: product.description?.slice(0, 160),
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from("products")
        .select(
            "*, category:categories(*), brand:brands(*), images:product_images(*), variants:product_variants(*)",
        )
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (!product) notFound();

    // Get reviews
    const { data: reviews } = await supabase
        .from("reviews")
        .select("*, profile:profiles(full_name, avatar_url)")
        .eq("product_id", product.id)
        .eq("is_visible", true)
        .order("created_at", { ascending: false });

    // Related products
    const { data: relatedProducts } = await supabase
        .from("products")
        .select(
            "*, category:categories(*), brand:brands(*), images:product_images(*)",
        )
        .eq("is_active", true)
        .eq("category_id", product.category_id)
        .neq("id", product.id)
        .limit(4);

    const avgRating =
        reviews && reviews.length > 0
            ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
              reviews.length
            : 0;

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* Breadcrumb */}
            <nav
                aria-label="Breadcrumb"
                className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground"
            >
                <Link href="/" className="transition-colors hover:text-primary">
                    Trang chủ
                </Link>
                <span>/</span>
                <Link
                    href="/products"
                    className="transition-colors hover:text-primary"
                >
                    Sản phẩm
                </Link>
                {product.category && (
                    <>
                        <span>/</span>
                        <Link
                            href={`/collections/${product.category.slug}`}
                            className="transition-colors hover:text-primary"
                        >
                            {product.category.name}
                        </Link>
                    </>
                )}
                <span>/</span>
                <span className="font-medium text-foreground">
                    {product.name}
                </span>
            </nav>

            {/* Product Detail */}
            <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:gap-12 xl:gap-16">
                <ProductGallery
                    images={product.images || []}
                    productName={product.name}
                />
                <ProductInfo
                    product={product}
                    avgRating={avgRating}
                    reviewCount={reviews?.length || 0}
                />
            </section>

            {/* Description */}
            {product.description && (
                <section className="mt-12 border-t border-border pt-8">
                    <div className="max-w-3xl">
                        <h2 className="mb-4 text-xl font-bold">
                            Mô Tả Sản Phẩm
                        </h2>
                        <p className="text-sm leading-7 text-muted-foreground">
                            {product.description}
                        </p>
                    </div>
                </section>
            )}

            {/* Reviews */}
            <ProductReviews reviews={reviews || []} avgRating={avgRating} />

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-xl font-bold mb-6">
                        Sản Phẩm Liên Quan
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {relatedProducts.map((p: any) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
