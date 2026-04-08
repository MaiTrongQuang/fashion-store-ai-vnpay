import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import Link from "next/link";
import {
    LayoutGrid,
    ChevronRight,
    PackageSearch,
    Heart,
    Flame,
    Star,
    Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import { DotPattern } from "@/components/ui/backgrounds";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";
import type { Brand, Category } from "@/lib/types";

export const metadata: Metadata = {
    title: `Thời Trang Nữ | ${SITE_NAME}`,
    description:
        "Khám phá bộ sưu tập thời trang nữ mới nhất - Thanh lịch, nữ tính, tự tin toả sáng tại LUXE Fashion",
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
    sale?: string;
};

const BASE_PATH = "/collections/nu";

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
    delete rest.sale;
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

export default async function WomenCollectionPage({ searchParams }: Props) {
    const params = await searchParams;
    const supabase = await createClient();
    const page = parseInt(params.page || "1", 10);
    const limit = 12;
    const offset = (page - 1) * limit;

    // ── Lọc sản phẩm Nữ: category slug "nu" hoặc tags chứa "nu" ──
    const { data: genderCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", "nu")
        .maybeSingle();

    // Optimized: chỉ select fields cần thiết
    const productSelect =
        "id, name, slug, base_price, sale_price, is_new, is_featured, tags, category:categories(name, slug), brand:brands(name, slug), images:product_images(url, alt, is_primary, sort_order)";

    let query = supabase
        .from("products")
        .select(productSelect, { count: "exact" })
        .eq("is_active", true);

    if (genderCategory) {
        query = query.eq("category_id", genderCategory.id);
    } else {
        query = query.contains("tags", ["nu"]);
    }

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
    if (params.sale === "true")
        query = query.not("sale_price", "is", null);

    switch (params.sort) {
        case "price_asc":
            query = query.order("base_price", { ascending: true });
            break;
        case "price_desc":
            query = query.order("base_price", { ascending: false });
            break;
        case "name_asc":
            query = query.order("name", { ascending: true });
            break;
        default:
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
        params.sale === "true" ||
        params.featured === "true" ||
        params.new === "true";

    const pillBase =
        "inline-flex min-h-11 min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

    const paginationItems =
        totalPages > 1 ? getPaginationItems(page, totalPages) : [];

    return (
        <div className="relative">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-pink-50/60 via-rose-50/30 to-background dark:from-pink-950/20 dark:via-rose-950/10 dark:to-background">
                <DotPattern
                    width={20}
                    height={20}
                    cx={1}
                    cy={1}
                    cr={1.5}
                    className="absolute inset-0 opacity-40 mask-[radial-gradient(500px_circle_at_center,white,transparent)]"
                />
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-pink-500/8 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-rose-500/8 rounded-full blur-3xl" />

                <div className="container relative z-10 mx-auto px-4 py-10 md:py-14">
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
                        <span className="font-medium text-foreground">
                            Thời trang Nữ
                        </span>
                    </nav>

                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400 shadow-sm">
                                <Heart
                                    className="h-4 w-4"
                                    aria-hidden
                                    fill="currentColor"
                                />
                                <span>Bộ sưu tập Nữ</span>
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                                Thời Trang{" "}
                                <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent dark:from-pink-400 dark:to-rose-400">
                                    Nữ
                                </span>
                            </h1>
                            <p className="mt-3 text-base text-muted-foreground md:text-lg">
                                Thanh lịch, nữ tính, tự tin toả sáng — khám phá
                                phong cách dành riêng cho phái đẹp.
                            </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
                            <span className="inline-flex items-center rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-semibold tabular-nums shadow-sm backdrop-blur-sm">
                                {count ?? 0} sản phẩm
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <div className="container mx-auto px-4 py-8 md:py-10 lg:py-12">
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-10 xl:gap-12">
                    <aside className="w-full shrink-0 lg:w-72 lg:max-w-[20rem]">
                        <div className="rounded-2xl border border-border/60 bg-card/50 p-4 shadow-sm backdrop-blur-sm md:p-5 lg:sticky lg:top-24">
                            <ProductFilters
                                categories={categories}
                                brands={brands}
                                basePath="/collections/nu"
                            />
                        </div>
                    </aside>

                    <div className="min-w-0 flex-1">
                        {/* Quick filters */}
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    href={buildQuery(
                                        withoutQuickFilters(params),
                                        { page: null },
                                    )}
                                    className={cn(
                                        pillBase,
                                        !hasQuickFilter
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "bg-muted/80 text-foreground hover:bg-muted",
                                    )}
                                >
                                    <LayoutGrid className="h-3.5 w-3.5" />
                                    Tất cả
                                </Link>
                                <Link
                                    href={buildQuery(
                                        withoutQuickFilters(params),
                                        { sale: "true", page: null },
                                    )}
                                    className={cn(
                                        pillBase,
                                        params.sale === "true"
                                            ? "bg-red-600 text-white shadow-sm hover:bg-red-600"
                                            : "bg-muted/80 text-foreground hover:bg-muted",
                                    )}
                                >
                                    <Flame className="h-3.5 w-3.5" />
                                    Đang giảm giá
                                </Link>
                                <Link
                                    href={buildQuery(
                                        withoutQuickFilters(params),
                                        { featured: "true", page: null },
                                    )}
                                    className={cn(
                                        pillBase,
                                        params.featured === "true"
                                            ? "bg-amber-500 text-white shadow-sm hover:bg-amber-500"
                                            : "bg-muted/80 text-foreground hover:bg-muted",
                                    )}
                                >
                                    <Star className="h-3.5 w-3.5" />
                                    Nổi bật
                                </Link>
                                <Link
                                    href={buildQuery(
                                        withoutQuickFilters(params),
                                        { new: "true", page: null },
                                    )}
                                    className={cn(
                                        pillBase,
                                        params.new === "true"
                                            ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-600"
                                            : "bg-muted/80 text-foreground hover:bg-muted",
                                    )}
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Hàng mới
                                </Link>
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
                                sản phẩm
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
                            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
                                {products.map((product: any) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center md:py-24">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                    <PackageSearch
                                        className="h-8 w-8 text-muted-foreground"
                                        aria-hidden
                                    />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    Không tìm thấy sản phẩm
                                </h2>
                                <p className="mt-2 max-w-md text-muted-foreground">
                                    Thử đổi bộ lọc hoặc xóa lọc để xem toàn bộ
                                    sản phẩm nữ.
                                </p>
                                <Link
                                    href="/collections/nu"
                                    className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    Xem tất cả sản phẩm Nữ
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
                                            "inline-flex min-h-11 min-w-[44px] cursor-pointer items-center justify-center rounded-2xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
                                                    "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-2xl border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                    item === page
                                                        ? "border-primary bg-primary text-primary-foreground"
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
                                            "inline-flex min-h-11 min-w-[44px] cursor-pointer items-center justify-center rounded-2xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
