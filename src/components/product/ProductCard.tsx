"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice, getDiscountPercent } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const images = product.images ?? [];
    const primaryImage =
        images.find((img) => img.is_primary) || images[0];
    const secondaryImage = primaryImage
        ? images.find((img) => img.id !== primaryImage.id && img.url)
        : undefined;

    const discount = product.sale_price
        ? getDiscountPercent(product.base_price, product.sale_price)
        : 0;

    const salePrice = product.sale_price ?? null;
    const currentPrice = salePrice ?? product.base_price;

    return (
        <article
            className={cn(
                "group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card",
                "shadow-sm transition-[box-shadow,transform] duration-300 ease-out",
                "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20",
                "motion-reduce:transition-none motion-reduce:hover:transform-none",
            )}
        >
            <div className="relative">
                <Link
                    href={`/products/${product.slug}`}
                    className={cn(
                        "relative block aspect-3/4 overflow-hidden bg-muted",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    )}
                >
                    {primaryImage ? (
                        <>
                            {secondaryImage && (
                                <Image
                                    src={secondaryImage.url}
                                    alt=""
                                    aria-hidden
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className={cn(
                                        "z-0 object-cover",
                                        "motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out",
                                        "motion-safe:group-hover/card:scale-[1.03] motion-reduce:group-hover/card:scale-100",
                                    )}
                                />
                            )}
                            <Image
                                src={primaryImage.url}
                                alt={primaryImage.alt || product.name}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className={cn(
                                    "z-1 object-cover transition-opacity duration-500 ease-out",
                                    secondaryImage &&
                                        "group-hover/card:opacity-0 motion-reduce:group-hover/card:opacity-100",
                                    "motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out",
                                    "motion-safe:group-hover/card:scale-[1.03] motion-reduce:group-hover/card:scale-100",
                                )}
                                priority={false}
                            />
                        </>
                    ) : (
                        <div
                            className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-muted-foreground"
                            aria-hidden
                        >
                            <ImageOff className="h-10 w-10 opacity-50" />
                            <span className="text-xs font-medium">
                                Chưa có ảnh
                            </span>
                        </div>
                    )}

                    {/* Gradient nhẹ phía dưới ảnh — giúp badge/CTA dễ đọc trên ảnh sáng */}
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 motion-reduce:opacity-0"
                        aria-hidden
                    />

                    {/* Badges */}
                    <div className="absolute left-2.5 top-2.5 z-1 flex max-w-[calc(100%-4rem)] flex-col gap-1.5 sm:left-3 sm:top-3">
                        {discount > 0 && (
                            <Badge className="border-0 bg-red-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm hover:bg-red-600">
                                −{discount}%
                            </Badge>
                        )}
                        <div className="flex flex-wrap gap-1">
                            {product.is_new && (
                                <Badge className="border-0 bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-600">
                                    Mới
                                </Badge>
                            )}
                            {product.is_featured && (
                                <Badge className="border-0 bg-amber-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm hover:bg-amber-500">
                                    Nổi bật
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Gợi ý CTA — chỉ opacity, không đẩy layout */}
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 motion-reduce:opacity-0"
                        aria-hidden
                    >
                        <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground shadow-md backdrop-blur-sm">
                            Xem chi tiết
                        </span>
                    </div>
                </Link>

                {/* Ngoài <Link> — tránh nút lồng trong link */}
                <button
                    type="button"
                    className={cn(
                        "absolute right-2 top-2 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full",
                        "border border-border/80 bg-background/90 text-foreground shadow-md backdrop-blur-sm",
                        "transition-colors duration-200 hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "opacity-100 sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover/card:opacity-100",
                        "sm:translate-y-0 sm:group-hover/card:translate-y-0",
                    )}
                    aria-label={`Thêm "${product.name}" vào yêu thích`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: wishlist
                    }}
                >
                    <Heart
                        className="h-[18px] w-[18px] sm:h-5 sm:w-5"
                        strokeWidth={1.75}
                    />
                </button>
            </div>

            <div className="flex flex-1 flex-col border-t border-border/50 p-3 sm:p-4">
                <Link
                    href={`/products/${product.slug}`}
                    className="group/info flex min-h-0 flex-1 flex-col gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-b-xl -m-px p-px"
                >
                    {product.brand && (
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
                            {product.brand.name}
                        </p>
                    )}
                    <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-foreground transition-colors duration-200 group-hover/info:text-primary sm:min-h-11 sm:text-base">
                        {product.name}
                    </h3>

                    <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-1">
                        <span className="text-base font-bold tabular-nums tracking-tight text-foreground sm:text-lg">
                            {formatPrice(currentPrice)}
                        </span>
                        {salePrice && (
                            <>
                                <span className="text-sm tabular-nums text-muted-foreground line-through decoration-muted-foreground/80">
                                    {formatPrice(product.base_price)}
                                </span>
                                {discount > 0 && (
                                    <span className="text-xs font-medium text-red-600 dark:text-red-400">
                                        Tiết kiệm {discount}%
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    {product.category?.name && (
                        <p className="text-[11px] text-muted-foreground/90 sm:text-xs">
                            {product.category.name}
                        </p>
                    )}
                </Link>
            </div>
        </article>
    );
}
