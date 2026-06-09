"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ImageOff, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice, getDiscountPercent } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { getProductDisplayImages } from "@/lib/legacy-product-images";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const images = getProductDisplayImages(product);
    const primaryImage = images.find((img) => img.is_primary) || images[0];
    const secondaryImage = primaryImage
        ? images.find(
              (img) =>
                  img.url &&
                  img.url !== primaryImage.url &&
                  img.sort_order !== primaryImage.sort_order,
          )
        : undefined;

    const discount = product.sale_price
        ? getDiscountPercent(product.base_price, product.sale_price)
        : 0;

    const currentPrice = product.sale_price ?? product.base_price;

    return (
        <article className="group/product flex h-full min-w-0 flex-col">
            <div className="relative overflow-hidden rounded-md bg-muted">
                <Link
                    href={`/products/${product.slug}`}
                    className="relative block aspect-3/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={`Xem ${product.name}`}
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
                                    className="object-cover transition-transform duration-700 ease-out group-hover/product:scale-[1.03]"
                                />
                            )}
                            <Image
                                src={primaryImage.url}
                                alt={primaryImage.alt || product.name}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className={cn(
                                    "object-cover transition-all duration-500 ease-out group-hover/product:scale-[1.03]",
                                    secondaryImage &&
                                        "group-hover/product:opacity-0",
                                )}
                                priority={false}
                            />
                        </>
                    ) : (
                        <div
                            className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-muted-foreground"
                            aria-hidden
                        >
                            <ImageOff className="h-9 w-9 opacity-50" />
                            <span className="text-xs font-medium">
                                Chưa có ảnh
                            </span>
                        </div>
                    )}

                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 justify-center bg-linear-to-t from-black/28 via-black/8 to-transparent pb-3 pt-10 opacity-0 transition-all duration-300 group-hover/product:translate-y-0 group-hover/product:opacity-100 sm:flex"
                        aria-hidden
                    >
                        <span className="inline-flex items-center gap-2 rounded-md bg-background/95 px-3 py-2 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Xem chi tiết
                        </span>
                    </div>
                </Link>

                <div className="absolute left-2 top-2 z-10 flex max-w-[calc(100%-3.5rem)] flex-wrap gap-1.5">
                    {discount > 0 && (
                        <Badge className="rounded-sm border-0 bg-red-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-normal text-white hover:bg-red-600">
                            -{discount}%
                        </Badge>
                    )}
                    {product.is_new && (
                        <Badge className="rounded-sm border-0 bg-neutral-950 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-normal text-white hover:bg-neutral-950 dark:bg-white dark:text-neutral-950">
                            Mới
                        </Badge>
                    )}
                    {product.is_featured && (
                        <Badge className="rounded-sm border-0 bg-amber-500 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-normal text-white hover:bg-amber-500">
                            Hot
                        </Badge>
                    )}
                </div>

                <button
                    type="button"
                    className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-md border border-white/70 bg-white/90 text-neutral-950 shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:opacity-0 sm:group-hover/product:opacity-100"
                    aria-label={`Thêm "${product.name}" vào yêu thích`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <Heart className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </button>
            </div>

            <div className="flex flex-1 flex-col gap-1.5 pt-3">
                {product.brand && (
                    <p className="truncate text-[11px] font-semibold uppercase tracking-normal text-muted-foreground">
                        {product.brand.name}
                    </p>
                )}
                <Link
                    href={`/products/${product.slug}`}
                    className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-snug text-foreground transition-colors group-hover/product:text-primary sm:text-base">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-1">
                    <span className="text-sm font-semibold tabular-nums text-foreground sm:text-base">
                        {formatPrice(currentPrice)}
                    </span>
                    {product.sale_price && (
                        <span className="text-xs tabular-nums text-muted-foreground line-through">
                            {formatPrice(product.base_price)}
                        </span>
                    )}
                </div>

                {product.category?.name && (
                    <p className="truncate text-xs text-muted-foreground">
                        {product.category.name}
                    </p>
                )}
            </div>
        </article>
    );
}
