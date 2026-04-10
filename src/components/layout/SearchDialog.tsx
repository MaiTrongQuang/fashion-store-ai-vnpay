"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2, ImageOff, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatPrice, getDiscountPercent } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";

export default function SearchDialog() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const supabase = createClient();

    // Keyboard shortcut: Ctrl/Cmd + K
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    // Focus input when dialog opens
    useEffect(() => {
        if (open) {
            // small delay for dialog animation
            const timer = setTimeout(() => inputRef.current?.focus(), 100);
            return () => clearTimeout(timer);
        } else {
            // Reset state when closing
            setQuery("");
            setResults([]);
            setHasSearched(false);
        }
    }, [open]);

    // Debounced search
    const doSearch = useCallback(
        async (searchQuery: string) => {
            const trimmed = searchQuery.trim();
            if (!trimmed || trimmed.length < 2) {
                setResults([]);
                setHasSearched(false);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            try {
                const { data } = await supabase
                    .from("products")
                    .select(
                        "*, category:categories(*), brand:brands(*), images:product_images(*)",
                    )
                    .eq("is_active", true)
                    .ilike("name", `%${trimmed}%`)
                    .limit(12);
                setResults(data || []);
                setHasSearched(true);
            } catch {
                setResults([]);
                setHasSearched(true);
            } finally {
                setIsSearching(false);
            }
        },
        [supabase],
    );

    function handleInputChange(value: string) {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doSearch(value), 350);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <>
            {/* Search trigger button */}
            <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex"
                onClick={() => setOpen(true)}
                aria-label="Tìm kiếm (Ctrl+K)"
            >
                <Search className="h-4 w-4" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className="sm:max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden"
                    showCloseButton={false}
                >
                    <DialogTitle className="sr-only">
                        Tìm kiếm sản phẩm
                    </DialogTitle>

                    {/* Search input */}
                    <div className="flex items-center gap-3 border-b px-4 py-3">
                        <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <Input
                            ref={inputRef}
                            value={query}
                            onChange={(e) =>
                                handleInputChange(e.target.value)
                            }
                            placeholder="Tìm kiếm sản phẩm..."
                            className="h-10 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
                        />
                        {query && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="shrink-0"
                                onClick={() => {
                                    setQuery("");
                                    setResults([]);
                                    setHasSearched(false);
                                    inputRef.current?.focus();
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                        <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
                            ESC
                        </kbd>
                    </div>

                    {/* Results area */}
                    <ScrollArea className="flex-1 overflow-auto">
                        <div className="p-2">
                            {/* Loading state */}
                            {isSearching && (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    <span className="ml-3 text-sm text-muted-foreground">
                                        Đang tìm kiếm...
                                    </span>
                                </div>
                            )}

                            {/* Results */}
                            {!isSearching && hasSearched && results.length > 0 && (
                                <div>
                                    <p className="px-2 pb-2 text-xs font-medium text-muted-foreground">
                                        Tìm thấy{" "}
                                        <span className="font-semibold text-foreground">
                                            {results.length}
                                        </span>{" "}
                                        kết quả
                                    </p>
                                    <div className="flex flex-col gap-0.5">
                                        {results.map((product) => (
                                            <SearchResultItem
                                                key={product.id}
                                                product={product}
                                                onSelect={handleClose}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No results */}
                            {!isSearching &&
                                hasSearched &&
                                results.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                            <Search className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <p className="font-medium text-foreground">
                                            Không tìm thấy sản phẩm
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Thử tìm với từ khóa khác
                                        </p>
                                    </div>
                                )}

                            {/* Default empty state */}
                            {!isSearching && !hasSearched && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                        <Search className="h-5 w-5 text-primary" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Nhập từ khóa để tìm sản phẩm
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground/60">
                                        VD: Áo thun, quần jean, đầm...
                                    </p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}

// ─── Individual result item ──────────────────────────────────────────────

function SearchResultItem({
    product,
    onSelect,
}: {
    product: Product;
    onSelect: () => void;
}) {
    const images = product.images ?? [];
    const primaryImage =
        images.find((img) => img.is_primary) || images[0];
    const discount = product.sale_price
        ? getDiscountPercent(product.base_price, product.sale_price)
        : 0;
    const currentPrice = product.sale_price ?? product.base_price;

    return (
        <Link
            href={`/products/${product.slug}`}
            onClick={onSelect}
            className={cn(
                "group flex items-center gap-3 rounded-lg px-2 py-2.5",
                "transition-colors duration-150",
                "hover:bg-accent focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
        >
            {/* Thumbnail */}
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted">
                {primaryImage ? (
                    <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt || product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <ImageOff className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                )}
                {discount > 0 && (
                    <Badge className="absolute -right-1 -top-1 border-0 bg-red-600 px-1 py-0 text-[9px] font-bold text-white shadow-sm hover:bg-red-600">
                        −{discount}%
                    </Badge>
                )}
            </div>

            {/* Info */}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                {product.brand && (
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {product.brand.name}
                    </p>
                )}
                <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                </p>
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold tabular-nums text-foreground">
                        {formatPrice(currentPrice)}
                    </span>
                    {product.sale_price && (
                        <span className="text-xs tabular-nums text-muted-foreground line-through">
                            {formatPrice(product.base_price)}
                        </span>
                    )}
                </div>
            </div>

            {/* Arrow */}
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>
    );
}
