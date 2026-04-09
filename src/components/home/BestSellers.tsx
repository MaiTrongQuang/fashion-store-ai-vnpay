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
        bg: "bg-linear-to-br from-amber-400 to-yellow-500",
        text: "text-amber-950",
        shadow: "shadow-amber-400/40",
        icon: Trophy,
    },
    {
        bg: "bg-linear-to-br from-slate-300 to-slate-400",
        text: "text-slate-800",
        shadow: "shadow-slate-400/40",
        icon: Medal,
    },
    {
        bg: "bg-linear-to-br from-orange-400 to-amber-600",
        text: "text-orange-950",
        shadow: "shadow-orange-400/40",
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
        <section className="relative py-24 overflow-hidden bg-linear-to-b from-amber-50/50 via-background to-background dark:from-amber-950/15 dark:via-background">
            <div
                className="absolute right-10 top-20 h-80 w-80 rounded-full bg-amber-200/25 blur-3xl dark:bg-amber-500/10"
                aria-hidden
            />
            <GridPattern
                width={24}
                height={24}
                x={-1}
                y={-1}
                className="absolute inset-0 opacity-20 stroke-amber-400/25 dark:stroke-amber-500/15 mask-[radial-gradient(500px_circle_at_center,white,transparent)]"
            />

            <div className="container relative mx-auto px-4 z-10">
                <div className="flex flex-col md:flex-row items-start justify-between mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center space-x-2 text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-3 border border-amber-500/20 rounded-full px-4 py-1.5 bg-amber-500/10 shadow-sm">
                            <Trophy className="w-4 h-4" />
                            <span>Được Chọn Nhiều Nhất</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-amber-800 via-foreground to-amber-900 bg-clip-text text-transparent dark:from-amber-200 dark:via-foreground dark:to-amber-100">
                            Bán Chạy Nhất
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
                            className="inline-flex items-center gap-2 group px-6 py-3 rounded-full cursor-pointer transition-colors bg-white/70 hover:bg-amber-50/90 outline outline-amber-200/70 hover:outline-amber-400/50 dark:bg-background/50 dark:hover:bg-amber-950/25 dark:outline-amber-500/25"
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
