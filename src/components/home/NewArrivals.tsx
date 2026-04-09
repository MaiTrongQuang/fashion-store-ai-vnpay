"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";
import { GridPattern } from "@/components/ui/backgrounds";
import { motion } from "framer-motion";

interface NewArrivalsProps {
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

export default function NewArrivals({ products }: NewArrivalsProps) {
    const hasProducts = products.length > 0;

    return (
        <section className="relative py-24 overflow-hidden bg-linear-to-b from-teal-50/45 via-background to-cyan-50/30 dark:from-teal-950/18 dark:via-background dark:to-cyan-950/12">
            <div className="absolute inset-0 bg-background/5" />
            <div
                className="absolute left-1/4 bottom-0 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-500/10"
                aria-hidden
            />
            <GridPattern
                width={40}
                height={40}
                x={-1}
                y={-1}
                className="absolute inset-0 opacity-20 stroke-teal-400/30 dark:stroke-teal-500/15 mask-[linear-gradient(to_bottom,white,transparent)]"
            />

            <div className="container relative mx-auto px-4 z-10">
                <div className="flex flex-col md:flex-row items-start justify-between mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center space-x-2 text-sm font-bold text-teal-800 uppercase tracking-widest mb-4 border border-teal-300/55 rounded-full px-4 py-1.5 bg-teal-50/95 shadow-sm dark:border-teal-500/35 dark:bg-teal-950/45 dark:text-teal-200">
                            <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                            <span>Vừa cập nhật AI</span>
                        </div>
                        <h2 className="heading-section-vi font-sans text-4xl font-semibold tracking-normal md:tracking-tight md:text-5xl md:font-medium leading-[1.55] md:leading-[1.5]">
                            <span className="heading-gradient-vi bg-linear-to-r from-teal-800 via-cyan-700 to-teal-900 bg-clip-text text-transparent dark:from-teal-200 dark:via-cyan-200 dark:to-teal-100">
                                Hàng Mới Về
                            </span>
                        </h2>
                        <p className="mt-3 text-muted-foreground text-lg max-w-xl">
                            Khám phá các bộ sưu tập mới nhất vừa được hệ thống
                            AI xử lý và đưa lên kệ.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="self-end md:self-auto mt-4 md:mt-0"
                    >
                        <Link
                            href="/products?new=true"
                            className="inline-flex items-center gap-2 group px-6 py-3 rounded-full cursor-pointer transition-colors bg-white/70 hover:bg-teal-50/90 outline outline-teal-200/80 hover:outline-teal-400/55 dark:bg-background/50 dark:hover:bg-teal-950/30 dark:outline-teal-500/25"
                        >
                            <span className="font-semibold">Xem Tất Cả</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                    {hasProducts
                        ? products.map((product, index) => (
                              <motion.div
                                  key={product.id}
                                  initial={{ opacity: 0, y: 30 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true, margin: "-50px" }}
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
                                  initial={{ opacity: 0, y: 30 }}
                                  whileInView={{ opacity: 1, y: 0 }}
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
