"use client";

import Link from "next/link";
import { ArrowRight, Trophy, Medal } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";
import { GridPattern } from "@/components/ui/backgrounds";
import { motion } from "framer-motion";

interface BestSellersProps {
    products: Product[];
}

const RANK_STYLES = [
    {
        bg: "bg-gradient-brand-cta",
        text: "text-white",
        shadow: "shadow-brand-cta",
        icon: Trophy,
    },
    {
        bg: "bg-linear-to-br from-brand-1 to-brand-2",
        text: "text-white",
        shadow:
            "shadow-[0_10px_28px_-10px_color-mix(in_oklch,var(--brand-2)_38%,transparent)]",
        icon: Medal,
    },
    {
        bg: "bg-linear-to-br from-brand-2 to-brand-3",
        text: "text-white",
        shadow:
            "shadow-[0_10px_28px_-10px_color-mix(in_oklch,var(--brand-3)_38%,transparent)]",
        icon: Medal,
    },
];

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

export default function BestSellers({ products }: BestSellersProps) {
    const hasProducts = products.length > 0;

    return (
        <section className="relative py-24 overflow-hidden bg-brand-mesh">
            <div
                className="absolute right-10 top-20 h-80 w-80 rounded-full blur-3xl bg-[color-mix(in_oklch,var(--brand-soft-3)_48%,transparent)] dark:bg-[color-mix(in_oklch,var(--brand-cta-3)_14%,transparent)]"
                aria-hidden
            />
            <GridPattern
                width={24}
                height={24}
                x={-1}
                y={-1}
                className="absolute inset-0 opacity-20 stroke-brand-2/22 dark:stroke-brand-2/14 mask-[radial-gradient(500px_circle_at_center,white,transparent)]"
            />

            <div className="container relative mx-auto px-4 z-10">
                <div className="flex flex-col md:flex-row items-start justify-between mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center space-x-2 text-sm font-bold text-brand-1 uppercase tracking-widest mb-3 border border-brand-3/35 rounded-full px-4 py-1.5 bg-[color-mix(in_oklch,var(--brand-soft-3)_85%,white)] shadow-sm dark:border-brand-3/30 dark:bg-brand-soft-3/35 dark:text-brand-2">
                            <Trophy className="w-4 h-4 text-brand-3" />
                            <span>Được Chọn Nhiều Nhất</span>
                        </div>
                        <h2 className="heading-section-vi text-4xl md:text-5xl font-extrabold tracking-normal md:tracking-tight leading-[1.55] md:leading-[1.5]">
                            <span className="heading-gradient-vi text-gradient-brand">
                                Bán Chạy Nhất
                            </span>
                        </h2>
                        <p className="mt-3 text-muted-foreground text-lg max-w-xl">
                            Top sản phẩm được khách hàng tin tưởng và lựa chọn,
                            được AI xếp hạng theo mức độ phổ biến.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="self-end md:self-auto mt-4 md:mt-0"
                    >
                        <Link
                            href="/products?sort=best-selling"
                            className="inline-flex items-center gap-2 group px-6 py-3 rounded-full cursor-pointer transition-colors bg-white/70 hover:bg-[color-mix(in_oklch,var(--brand-soft-2)_78%,white)] outline outline-brand-2/35 hover:outline-brand-2/55 dark:bg-background/50 dark:hover:bg-brand-soft-2/30 dark:outline-brand-2/25"
                        >
                            <span className="font-semibold">Xem Thêm</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                    {hasProducts
                        ? products.map((product, index) => {
                              const rankStyle = RANK_STYLES[index];
                              return (
                                  <motion.div
                                      key={product.id}
                                      initial={{ opacity: 0, y: 30 }}
                                      whileInView={{ opacity: 1, y: 0 }}
                                      viewport={{
                                          once: true,
                                          margin: "-80px",
                                      }}
                                      transition={{
                                          duration: 0.5,
                                          delay: index * 0.1,
                                      }}
                                      className="relative"
                                  >
                                      {rankStyle && (
                                          <div
                                              className={`absolute -top-3 -left-2 z-20 w-9 h-9 rounded-full ${rankStyle.bg} ${rankStyle.shadow} shadow-lg flex items-center justify-center`}
                                          >
                                              <span
                                                  className={`text-sm font-extrabold ${rankStyle.text}`}
                                              >
                                                  {index + 1}
                                              </span>
                                          </div>
                                      )}
                                      <ProductCard product={product} />
                                  </motion.div>
                              );
                          })
                        : Array.from({ length: 4 }).map((_, i) => (
                              <motion.div
                                  key={`skeleton-${i}`}
                                  initial={{ opacity: 0, y: 30 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.5, delay: i * 0.1 }}
                                  className="relative"
                              >
                                  {RANK_STYLES[i] && (
                                      <div
                                          className={`absolute -top-3 -left-2 z-20 w-9 h-9 rounded-full ${RANK_STYLES[i].bg} ${RANK_STYLES[i].shadow} shadow-lg flex items-center justify-center`}
                                      >
                                          <span
                                              className={`text-sm font-extrabold ${RANK_STYLES[i].text}`}
                                          >
                                              {i + 1}
                                          </span>
                                      </div>
                                  )}
                                  <ProductSkeleton />
                              </motion.div>
                          ))}
                </div>
            </div>
        </section>
    );
}
