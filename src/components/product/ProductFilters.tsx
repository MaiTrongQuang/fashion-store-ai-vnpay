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
        <div className="border-b pb-4">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full text-sm font-medium py-2"
            >
                {title}
                <ChevronDown
                    className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
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
                router.push(`${basePath}?${params.toString()}`, {
                    scroll: false,
                });
            });
        },
        [searchParams, basePath, router],
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
                "space-y-4 transition-opacity duration-200",
                isPending && "opacity-60 pointer-events-none",
            )}
        >
            <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
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
                        className="text-xs h-7"
                    >
                        <X className="h-3 w-3 mr-1" />
                        Xóa lọc
                    </Button>
                )}
            </div>

            <Separator />

            {/* Sort */}
            <div className="space-y-2">
                <p className="text-sm font-medium">Sắp xếp</p>
                <select
                    value={currentSort}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <Separator />

            {/* Categories */}
            <FilterSection title="Danh mục">
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <label
                            key={cat.id}
                            className="flex items-center gap-2 cursor-pointer text-sm hover:text-primary transition-colors"
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
                            className="flex items-center gap-2 cursor-pointer text-sm hover:text-primary transition-colors"
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
                            className="flex items-center gap-2 cursor-pointer text-sm hover:text-primary transition-colors"
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
                                        router.push(
                                            `${basePath}?${params.toString()}`,
                                            { scroll: false },
                                        );
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

