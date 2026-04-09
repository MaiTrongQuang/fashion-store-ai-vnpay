"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";
import { DotPattern } from "@/components/ui/backgrounds";
import { motion } from "framer-motion";

interface FeaturedProductsProps {
    products: Product[];
}

function ProductSkeleton() {
    return (
        <div className="rounded-xl border border-border/50 overflow-hidden bg-card animate-pulse">
            <div className="aspect-3/4 bg-muted" />
            <div className="p-4 space-y-3">
                <div className="h-3 bg-muted rounded-full w-1/3" />
                <div className="h-4 bg-muted rounded-full w-3/4" />
                <div className="flex gap-2">
                    <div className="h-5 bg-muted rounded-full w-1/3" />
                    <div className="h-5 bg-muted rounded-full w-1/4" />
                </div>
            </div>
        </div>
    );
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    const hasProducts = products.length > 0;

    return (
        <section className="relative py-24 overflow-hidden bg-brand-mesh">
            <div
                className="absolute top-1/2 left-0 h-96 w-96 -translate-y-1/2 rounded-full blur-3xl bg-[color-mix(in_oklch,var(--brand-soft-2)_55%,transparent)] dark:bg-[color-mix(in_oklch,var(--brand-cta-2)_16%,transparent)]"
                aria-hidden
            />
            <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1.5}
                className="absolute inset-0 opacity-40 mask-[radial-gradient(400px_circle_at_center,white,transparent)] fill-brand-2/18 dark:fill-brand-2/12"
            />

            <div className="container relative mx-auto px-4 z-10">
                <div className="flex flex-col md:flex-row items-start justify-between mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center space-x-2 text-sm font-bold text-brand-1 uppercase tracking-widest mb-3 border border-brand-2/45 rounded-full px-4 py-1.5 bg-[color-mix(in_oklch,var(--brand-soft-1)_88%,white)] shadow-sm dark:border-brand-2/35 dark:bg-brand-soft-1/50 dark:text-brand-2">
                            <Sparkles className="w-4 h-4 text-brand-3" />
                            <span>Được Yêu Thích Bằng AI</span>
                        </div>
                        <h2 className="heading-section-vi text-4xl md:text-5xl font-extrabold tracking-normal md:tracking-tight leading-[1.55] md:leading-[1.5]">
                            <span className="heading-gradient-vi text-gradient-brand">
                                Sản Phẩm Nổi Bật
                            </span>
                        </h2>
                        <p className="mt-3 text-muted-foreground text-lg max-w-xl">
                            Các xu hướng thời trang được hệ thống AI gợi ý và
                            chọn lọc dựa trên phong cách cá nhân hoá.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="self-end md:self-auto mt-4 md:mt-0"
                    >
                        <Link
                            href="/products?featured=true"
                            className="inline-flex items-center gap-2 group px-6 py-3 rounded-full cursor-pointer transition-colors bg-white/70 hover:bg-[color-mix(in_oklch,var(--brand-soft-1)_75%,white)] outline outline-brand-2/35 hover:outline-brand-2/55 dark:bg-background/50 dark:hover:bg-brand-soft-1/35 dark:outline-brand-2/25"
                        >
                            <span className="font-semibold">
                                Xem Gợi Ý Khác
                            </span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                    {hasProducts
                        ? products.map((product, index) => (
                              <motion.div
                                  key={product.id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true, margin: "-100px" }}
                                  transition={{
                                      duration: 0.5,
                                      delay: index * 0.1,
                                  }}
                              >
                                  <ProductCard product={product} />
                              </motion.div>
                          ))
                        : Array.from({ length: 4 }).map((_, i) => (
                              <motion.div
                                  key={`skeleton-${i}`}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.5, delay: i * 0.1 }}
                              >
                                  <ProductSkeleton />
                              </motion.div>
                          ))}
                </div>
            </div>
        </section>
    );
}
