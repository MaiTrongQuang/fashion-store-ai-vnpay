import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/product/ProductCard";
import ProductFilterDrawer from "@/components/product/ProductFilterDrawer";
import ProductFilters from "@/components/product/ProductFilters";
import Link from "next/link";
import {
    ChevronRight,
    PackageSearch,
    Flame,
    Star,
    Sparkles,
    Timer,
    TrendingDown,
    BadgePercent,
} from "lucide-react";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";
import type { Brand, Category } from "@/lib/types";

export const metadata: Metadata = {
    title: `Sale - Giảm Giá Sốc | ${SITE_NAME}`,
    description:
        "Ưu đãi khủng - Giảm giá lên đến 70% các sản phẩm thời trang tại Nana Store. Mua ngay kẻo hết!",
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
    }>;
}

type SearchParams = {
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    featured?: string;
    new?: string;
};

const BASE_PATH = "/collections/sale";

function buildQuery(
    base: SearchParams,
    patch: Partial<Record<string, string | null | undefined>> = {},
): string {
    const combined: Record<string, string | undefined> = { ...base };
    for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === undefined) {
            delete combined[key];
        } else {
            combined[key] = value;
        }
    }
    const merged: Record<string, string> = {};
    for (const [key, value] of Object.entries(combined)) {
        if (value !== undefined && value !== "") {
            merged[key] = value;
        }
    }
    if (merged.page === "1") delete merged.page;
    const qs = new URLSearchParams(merged).toString();
    return qs ? `${BASE_PATH}?${qs}` : BASE_PATH;
}

function withoutQuickFilters(p: SearchParams): SearchParams {
    const rest: SearchParams = { ...p };
    delete rest.featured;
    delete rest.new;
    return rest;
}

function getPaginationItems(
    current: number,
    total: number,
): (number | "ellipsis")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const items: (number | "ellipsis")[] = [];
    const showLeftEllipsis = current > 3;
    const showRightEllipsis = current < total - 2;
    items.push(1);
    if (showLeftEllipsis) items.push("ellipsis");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let p = start; p <= end; p++) {
        if (!items.includes(p)) items.push(p);
    }
    if (showRightEllipsis) items.push("ellipsis");
    if (total > 1 && !items.includes(total)) items.push(total);
    return items;
}

export default async function SaleCollectionPage({ searchParams }: Props) {
    const params = await searchParams;
    const supabase = await createClient();
    const page = parseInt(params.page || "1", 10);
    const limit = 12;
    const offset = (page - 1) * limit;

    // Optimized: chỉ select fields cần thiết
    const productSelect =
        "id, name, slug, base_price, sale_price, is_new, is_featured, tags, category:categories(name, slug), brand:brands(name, slug), images:product_images(url, alt, is_primary, sort_order)";

    // ── Trang Sale: chỉ lấy sản phẩm có sale_price ──
    let query = supabase
        .from("products")
        .select(productSelect, { count: "exact" })
        .eq("is_active", true)
        .not("sale_price", "is", null);

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
    if (params.minPrice)
        query = query.gte("base_price", parseInt(params.minPrice, 10));
    if (params.maxPrice)
        query = query.lte("base_price", parseInt(params.maxPrice, 10));
    if (params.featured === "true") query = query.eq("is_featured", true);
    if (params.new === "true") query = query.eq("is_new", true);

    // Mặc định: sắp xếp giảm giá cao nhất trước, fallback theo giá thấp
    switch (params.sort) {
        case "price_asc":
            query = query.order("sale_price", { ascending: true });
            break;
        case "price_desc":
            query = query.order("sale_price", { ascending: false });
            break;
        case "name_asc":
            query = query.order("name", { ascending: true });
            break;
        case "newest":
            query = query.order("created_at", { ascending: false });
            break;
        default:
            // Giảm giá nhiều nhất: base_price desc (sản phẩm đắt giảm giá = tiết kiệm nhiều nhất)
            query = query.order("created_at", { ascending: false });
    }

    // Run product query + filter data in parallel
    const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        query.range(offset, offset + limit - 1),
        supabase
            .from("categories")
            .select("id, name, slug, is_active, sort_order")
            .eq("is_active", true)
            .order("sort_order"),
        supabase
            .from("brands")
            .select("id, name, slug, is_active")
            .eq("is_active", true)
            .order("name"),
    ]);

    const products = productsRes.data;
    const count = productsRes.count;

    const categories = categoriesRes.data || [];
    const brands = brandsRes.data || [];
    const totalPages = Math.ceil((count || 0) / limit);

    const activeCategoryName = params.category
        ? categories.find((c: Category) => c.slug === params.category)?.name
        : undefined;
    const activeBrandName = params.brand
        ? brands.find((b: Brand) => b.slug === params.brand)?.name
        : undefined;

    const hasQuickFilter =
        params.featured === "true" || params.new === "true";

    const pillBase =
        "inline-flex min-h-10 min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

    const paginationItems =
        totalPages > 1 ? getPaginationItems(page, totalPages) : [];

    // Tính toán thống kê sale
    const totalSaleProducts = count ?? 0;

    return (
        <div className="relative bg-background">
            {/* Hero */}
            <section className="border-b border-border bg-red-50/70 dark:bg-red-950/10">
                <div className="container mx-auto px-4 py-8 md:py-10">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
                    >
                        <Link
                            href="/"
                            className="text-foreground/80 transition-colors hover:text-primary"
                        >
                            Trang chủ
                        </Link>
                        <ChevronRight
                            className="h-4 w-4 shrink-0 opacity-60"
                            aria-hidden
                        />
                        <span className="font-medium text-red-700 dark:text-red-300">
                            Sale
                        </span>
                    </nav>

                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-700 dark:text-red-300">
                                <Flame
                                    className="h-4 w-4"
                                    aria-hidden
                                />
                                <span>Flash Sale</span>
                            </div>
                            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                                Sản phẩm đang giảm giá
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                                Nhanh tay chọn ngay — ưu đãi có hạn, giá cực
                                tốt! Tiết kiệm lên đến 70% cho các sản phẩm
                                thời trang hàng hiệu.
                            </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-3 md:flex-col md:items-end">
                            <span className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-background px-4 py-2 text-sm font-bold tabular-nums text-red-700 dark:border-red-900 dark:text-red-300">
                                <BadgePercent className="h-4 w-4" />
                                {totalSaleProducts} sản phẩm giảm giá
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold">
                                <Timer className="h-4 w-4" />
                                Ưu đãi có hạn
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <div className="container mx-auto px-4 py-8 md:py-10 lg:py-12">
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-10 xl:gap-12">
                    <aside className="hidden w-full shrink-0 lg:block lg:w-72 lg:max-w-[20rem]">
                        <div className="rounded-md border border-border bg-card p-4 md:p-5 lg:sticky lg:top-24">
                            <ProductFilters
                                categories={categories}
                                brands={brands}
                                basePath="/collections/sale"
                            />
                        </div>
                    </aside>

                    <div className="min-w-0 flex-1">
                        {/* Quick filters */}
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                                <ProductFilterDrawer
                                    categories={categories}
                                    brands={brands}
                                    basePath="/collections/sale"
                                />
                                <div className="flex flex-wrap gap-2">
                                <Link
                                    href={buildQuery(
                                        withoutQuickFilters(params),
                                        { page: null },
                                    )}
                                    className={cn(
                                        pillBase,
                                        !hasQuickFilter
                                            ? "border-red-600 bg-red-600 text-white"
                                            : "border-border bg-background text-foreground hover:bg-muted",
                                    )}
                                >
                                    <TrendingDown className="h-3.5 w-3.5" />
                                    Tất cả Sale
                                </Link>
                                <Link
                                    href={buildQuery(
                                        withoutQuickFilters(params),
                                        { featured: "true", page: null },
                                    )}
                                    className={cn(
                                        pillBase,
                                        params.featured === "true"
                                            ? "border-red-600 bg-red-600 text-white hover:bg-red-600"
                                            : "border-border bg-background text-foreground hover:bg-muted",
                                    )}
                                >
                                    <Star className="h-3.5 w-3.5" />
                                    Sale nổi bật
                                </Link>
                                <Link
                                    href={buildQuery(
                                        withoutQuickFilters(params),
                                        { new: "true", page: null },
                                    )}
                                    className={cn(
                                        pillBase,
                                        params.new === "true"
                                            ? "border-red-600 bg-red-600 text-white hover:bg-red-600"
                                            : "border-border bg-background text-foreground hover:bg-muted",
                                    )}
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Hàng mới giảm giá
                                </Link>
                                </div>
                            </div>
                        </div>

                        {/* Count bar */}
                        <div className="mb-6 flex flex-col gap-3 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Hiển thị{" "}
                                <span className="font-semibold text-foreground">
                                    {products?.length ?? 0}
                                </span>{" "}
                                /{" "}
                                <span className="font-semibold text-foreground">
                                    {count ?? 0}
                                </span>{" "}
                                sản phẩm đang giảm giá
                                {activeCategoryName && (
                                    <>
                                        {" "}
                                        ·{" "}
                                        <span className="text-foreground">
                                            {activeCategoryName}
                                        </span>
                                    </>
                                )}
                                {activeBrandName && (
                                    <>
                                        {" "}
                                        ·{" "}
                                        <span className="text-foreground">
                                            {activeBrandName}
                                        </span>
                                    </>
                                )}
                            </p>
                        </div>

                        {/* Product grid */}
                        {products && products.length > 0 ? (
                            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
                                {products.map((product: any) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
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
                                    Chưa có sản phẩm giảm giá
                                </h2>
                                <p className="mt-2 max-w-md text-muted-foreground">
                                    Hiện tại chưa có sản phẩm nào đang giảm
                                    giá. Hãy quay lại sau hoặc khám phá các sản
                                    phẩm khác!
                                </p>
                                <Link
                                    href="/products"
                                    className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    Khám phá sản phẩm
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 &&
                            products &&
                            products.length > 0 && (
                                <nav
                                    aria-label="Phân trang"
                                    className="mt-10 flex flex-wrap items-center justify-center gap-2"
                                >
                                    <Link
                                        href={buildQuery(params, {
                                            page:
                                                page <= 1
                                                    ? null
                                                    : page - 1 === 1
                                                      ? null
                                                      : String(page - 1),
                                        })}
                                        aria-disabled={page <= 1}
                                        className={cn(
                                            "inline-flex min-h-11 min-w-[44px] cursor-pointer items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                            page <= 1 &&
                                                "pointer-events-none opacity-40",
                                        )}
                                    >
                                        Trước
                                    </Link>

                                    {paginationItems.map((item, idx) =>
                                        item === "ellipsis" ? (
                                            <span
                                                key={`e-${idx}`}
                                                className="px-2 text-muted-foreground"
                                                aria-hidden
                                            >
                                                …
                                            </span>
                                        ) : (
                                            <Link
                                                key={item}
                                                href={buildQuery(params, {
                                                    page:
                                                        item === 1
                                                            ? null
                                                            : String(item),
                                                })}
                                                className={cn(
                                                    "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                    item === page
                                                        ? "border-red-600 bg-red-600 text-white"
                                                        : "border-border bg-background hover:bg-muted",
                                                )}
                                                aria-current={
                                                    item === page
                                                        ? "page"
                                                        : undefined
                                                }
                                            >
                                                {item}
                                            </Link>
                                        ),
                                    )}

                                    <Link
                                        href={
                                            page >= totalPages
                                                ? buildQuery(params, {
                                                      page:
                                                          totalPages <= 1
                                                              ? null
                                                              : String(
                                                                    totalPages,
                                                                ),
                                                  })
                                                : buildQuery(params, {
                                                      page: String(page + 1),
                                                  })
                                        }
                                        aria-disabled={page >= totalPages}
                                        className={cn(
                                            "inline-flex min-h-11 min-w-[44px] cursor-pointer items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                            page >= totalPages &&
                                                "pointer-events-none opacity-40",
                                        )}
                                    >
                                        Sau
                                    </Link>
                                </nav>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
