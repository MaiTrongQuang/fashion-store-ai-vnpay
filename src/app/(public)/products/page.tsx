import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import Link from "next/link";
import { Flame, Star, Sparkles, LayoutGrid } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sản Phẩm",
    description: "Khám phá bộ sưu tập thời trang đa dạng tại LUXE Fashion",
};

interface Props {
    searchParams: Promise<{
        category?: string;
        brand?: string;
        minPrice?: string;
        maxPrice?: string;
        sort?: string;
        page?: string;
        featured?: string;
        new?: string;
        sale?: string;
        q?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: Props) {
    const params = await searchParams;
    const supabase = await createClient();
    const page = parseInt(params.page || "1");
    const limit = 12;
    const offset = (page - 1) * limit;

    let query = supabase
        .from("products")
        .select(
            "*, category:categories(*), brand:brands(*), images:product_images(*)",
            {
                count: "exact",
            },
        )
        .eq("is_active", true);

    if (params.category) {
        const { data: cat } = await supabase
            .from("categories")
            .select("id")
            .eq("slug", params.category)
            .single();
        if (cat) query = query.eq("category_id", cat.id);
    }

    if (params.brand) {
        const { data: brand } = await supabase
            .from("brands")
            .select("id")
            .eq("slug", params.brand)
            .single();
        if (brand) query = query.eq("brand_id", brand.id);
    }

    if (params.minPrice) {
        query = query.gte("base_price", parseInt(params.minPrice));
    }
    if (params.maxPrice) {
        query = query.lte("base_price", parseInt(params.maxPrice));
    }
    if (params.featured === "true") {
        query = query.eq("is_featured", true);
    }
    if (params.new === "true") {
        query = query.eq("is_new", true);
    }
    if (params.sale === "true") {
        query = query.not("sale_price", "is", null);
    }
    if (params.q) {
        query = query.ilike("name", `%${params.q}%`);
    }

    // Sort
    switch (params.sort) {
        case "price_asc":
            query = query.order("base_price", { ascending: true });
            break;
        case "price_desc":
            query = query.order("base_price", { ascending: false });
            break;
        case "newest":
            query = query.order("created_at", { ascending: false });
            break;
        case "name_asc":
            query = query.order("name", { ascending: true });
            break;
        default:
            query = query.order("created_at", { ascending: false });
    }

    const { data: products, count } = await query.range(
        offset,
        offset + limit - 1,
    );

    const [categoriesRes, brandsRes] = await Promise.all([
        supabase
            .from("categories")
            .select("*")
            .eq("is_active", true)
            .order("sort_order"),
        supabase.from("brands").select("*").eq("is_active", true).order("name"),
    ]);

    const totalPages = Math.ceil((count || 0) / limit);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground mb-6">
                <Link href="/" className="hover:text-primary">
                    Trang chủ
                </Link>
                <span className="mx-2">/</span>
                <span className="text-foreground font-medium">Sản phẩm</span>
            </nav>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 shrink-0">
                    <ProductFilters
                        categories={categoriesRes.data || []}
                        brands={brandsRes.data || []}
                    />
                </aside>

                {/* Products Grid */}
                <div className="flex-1">
                    {/* Quick Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <Link
                            href="/products"
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                !params.sale && !params.featured && !params.new
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-accent hover:bg-accent/80 text-foreground"
                            }`}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            Tất cả
                        </Link>
                        <Link
                            href="/products?sale=true"
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                params.sale === "true"
                                    ? "bg-red-500 text-white shadow-sm"
                                    : "bg-accent hover:bg-accent/80 text-foreground"
                            }`}
                        >
                            <Flame className="h-3.5 w-3.5" />
                            Đang giảm giá
                        </Link>
                        <Link
                            href="/products?featured=true"
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                params.featured === "true"
                                    ? "bg-amber-500 text-white shadow-sm"
                                    : "bg-accent hover:bg-accent/80 text-foreground"
                            }`}
                        >
                            <Star className="h-3.5 w-3.5" />
                            Nổi bật
                        </Link>
                        <Link
                            href="/products?new=true"
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                params.new === "true"
                                    ? "bg-emerald-500 text-white shadow-sm"
                                    : "bg-accent hover:bg-accent/80 text-foreground"
                            }`}
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            Hàng mới
                        </Link>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <p className="text-sm text-muted-foreground">
                            Hiển thị{" "}
                            <span className="font-semibold text-foreground">
                                {products?.length || 0}
                            </span>{" "}
                            /{" "}
                            <span className="font-semibold text-foreground">
                                {count || 0}
                            </span>{" "}
                            sản phẩm
                        </p>
                    </div>

                    {products && products.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {products.map((product: any) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-lg text-muted-foreground">
                                Không tìm thấy sản phẩm nào
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-10">
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1,
                            ).map((p) => (
                                <a
                                    key={p}
                                    href={`/products?${new URLSearchParams({
                                        ...params,
                                        page: p.toString(),
                                    }).toString()}`}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                                        p === page
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-accent hover:bg-accent/80 text-foreground"
                                    }`}
                                >
                                    {p}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
