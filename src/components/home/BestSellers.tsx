"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

interface BestSellersProps {
    products: Product[];
}

function ProductSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-3/4 rounded-md bg-muted" />
            <div className="space-y-2 pt-3">
                <div className="h-3 w-1/3 rounded bg-muted" />
                <div className="h-4 w-4/5 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
            </div>
        </div>
    );
}

export default function BestSellers({ products }: BestSellersProps) {
    const hasProducts = products.length > 0;

    return (
        <section className="border-b border-border bg-muted/25 py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Bán chạy
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                            Được khách hàng yêu thích
                        </h2>
                    </div>
                    <Link
                        href="/products?sort=newest"
                        className="inline-flex w-fit items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
                    >
                        Xem thêm
                        <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
                    {hasProducts
                        ? products.map((product, index) => (
                              <div key={product.id} className="relative">
                                  {index < 3 && (
                                      <span className="absolute left-2 top-2 z-20 flex h-8 min-w-8 items-center justify-center rounded-sm bg-white px-2 text-xs font-bold text-neutral-950 shadow-sm">
                                          #{index + 1}
                                      </span>
                                  )}
                                  <ProductCard product={product} />
                              </div>
                          ))
                        : Array.from({ length: 4 }).map((_, i) => (
                              <ProductSkeleton key={`best-skeleton-${i}`} />
                          ))}
                </div>
            </div>
        </section>
    );
}
