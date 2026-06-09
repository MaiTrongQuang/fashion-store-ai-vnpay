"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, ChevronDown, Loader2 } from "lucide-react";
import type { Category, Brand } from "@/lib/types";
import { useState, useTransition, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
    categories: Category[];
    brands: Brand[];
    /** Base path for filter navigation. Defaults to "/products". */
    basePath?: string;
}

const PRICE_RANGES = [
    { label: "Dưới 200K", min: "0", max: "200000" },
    { label: "200K - 500K", min: "200000", max: "500000" },
    { label: "500K - 1 triệu", min: "500000", max: "1000000" },
    { label: "Trên 1 triệu", min: "1000000", max: "" },
];

const SORT_OPTIONS = [
    { label: "Mới nhất", value: "newest" },
    { label: "Giá thấp → cao", value: "price_asc" },
    { label: "Giá cao → thấp", value: "price_desc" },
    { label: "Tên A → Z", value: "name_asc" },
];

function FilterSection({
    title,
    defaultOpen = true,
    children,
}: {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-border/70 pb-4">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between rounded-md py-2 text-left text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-expanded={open}
            >
                {title}
                <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                    aria-hidden
                />
            </button>
            {open && <div className="mt-2">{children}</div>}
        </div>
    );
}

export default function ProductFilters({
    categories,
    brands,
    basePath = "/products",
}: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const getNextPath = useCallback(
        (params: URLSearchParams) => {
            const qs = params.toString();
            return qs ? `${basePath}?${qs}` : basePath;
        },
        [basePath],
    );

    // Navigate without scrolling to top; wrap in startTransition
    // so React marks the navigation as non-blocking and lets the
    // checkbox state update (optimistic) before the server responds.
    const updateFilter = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            params.delete("page");
            startTransition(() => {
                router.push(getNextPath(params), {
                    scroll: false,
                });
            });
        },
        [searchParams, getNextPath, router],
    );

    const clearFilters = useCallback(() => {
        startTransition(() => {
            router.push(basePath, { scroll: false });
        });
    }, [basePath, router]);

    const hasFilters = searchParams.toString().length > 0;
    const currentSort = searchParams.get("sort") || "newest";

    return (
        <div
            className={cn(
                "space-y-5 transition-opacity duration-200",
                isPending && "opacity-60 pointer-events-none",
            )}
        >
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold">
                    <SlidersHorizontal className="h-4 w-4" />
                    Bộ lọc
                    {isPending && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                    )}
                </h3>
                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8 rounded-md text-xs"
                    >
                        <X className="mr-1 h-3 w-3" />
                        Xóa lọc
                    </Button>
                )}
            </div>

            <Separator />

            {/* Sort */}
            <div className="space-y-2">
                <p className="text-sm font-semibold">Sắp xếp</p>
                <div className="relative">
                    <select
                        value={currentSort}
                        onChange={(e) => updateFilter("sort", e.target.value)}
                        className="h-11 w-full rounded-md border border-input bg-background px-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                    />
                </div>
            </div>

            <Separator />

            {/* Categories */}
            <FilterSection title="Danh mục">
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <label
                            key={cat.id}
                            className="flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-sm transition-colors hover:bg-muted/70 hover:text-primary"
                        >
                            <Checkbox
                                checked={
                                    searchParams.get("category") === cat.slug
                                }
                                onCheckedChange={(checked) =>
                                    updateFilter(
                                        "category",
                                        checked ? cat.slug : "",
                                    )
                                }
                            />
                            {cat.name}
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Brands */}
            <FilterSection title="Thương hiệu">
                <div className="space-y-2">
                    {brands.map((brand) => (
                        <label
                            key={brand.id}
                            className="flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-sm transition-colors hover:bg-muted/70 hover:text-primary"
                        >
                            <Checkbox
                                checked={
                                    searchParams.get("brand") === brand.slug
                                }
                                onCheckedChange={(checked) =>
                                    updateFilter(
                                        "brand",
                                        checked ? brand.slug : "",
                                    )
                                }
                            />
                            {brand.name}
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Giá">
                <div className="space-y-2">
                    {PRICE_RANGES.map((range, index) => (
                        <label
                            key={index}
                            className="flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-sm transition-colors hover:bg-muted/70 hover:text-primary"
                        >
                            <Checkbox
                                checked={
                                    searchParams.get("minPrice") ===
                                        range.min &&
                                    searchParams.get("maxPrice") === range.max
                                }
                                onCheckedChange={(checked) => {
                                    const params = new URLSearchParams(
                                        searchParams.toString(),
                                    );
                                    if (checked) {
                                        params.set("minPrice", range.min);
                                        if (range.max)
                                            params.set("maxPrice", range.max);
                                        else params.delete("maxPrice");
                                    } else {
                                        params.delete("minPrice");
                                        params.delete("maxPrice");
                                    }
                                    params.delete("page");
                                    startTransition(() => {
                                        router.push(getNextPath(params), {
                                            scroll: false,
                                        });
                                    });
                                }}
                            />
                            {range.label}
                        </label>
                    ))}
                </div>
            </FilterSection>
        </div>
    );
}
