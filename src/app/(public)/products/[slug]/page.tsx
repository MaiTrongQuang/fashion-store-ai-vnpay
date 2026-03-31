import { createClient } from "@/lib/supabase/server";
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
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground mb-6">
                <a href="/" className="hover:text-primary">
                    Trang chủ
                </a>
                <span className="mx-2">/</span>
                <a href="/products" className="hover:text-primary">
                    Sản phẩm
                </a>
                {product.category && (
                    <>
                        <span className="mx-2">/</span>
                        <a
                            href={`/collections/${product.category.slug}`}
                            className="hover:text-primary"
                        >
                            {product.category.name}
                        </a>
                    </>
                )}
                <span className="mx-2">/</span>
                <span className="text-foreground font-medium">
                    {product.name}
                </span>
            </nav>

            {/* Product Detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <ProductGallery
                    images={product.images || []}
                    productName={product.name}
                />
                <ProductInfo
                    product={product}
                    avgRating={avgRating}
                    reviewCount={reviews?.length || 0}
                />
            </div>

            {/* Description */}
            <div className="mt-12 max-w-3xl">
                <h2 className="text-xl font-bold mb-4">Mô Tả Sản Phẩm</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                    {product.description}
                </div>
            </div>

            {/* Reviews */}
            <ProductReviews reviews={reviews || []} avgRating={avgRating} />

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-xl font-bold mb-6">
                        Sản Phẩm Liên Quan
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
