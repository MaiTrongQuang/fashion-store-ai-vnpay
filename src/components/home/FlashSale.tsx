"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Timer } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";
import { DotPattern } from "@/components/ui/backgrounds";
import { motion } from "framer-motion";

interface FlashSaleProps {
    products: Product[];
}

function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 8,
        minutes: 45,
        seconds: 30,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;
                seconds -= 1;
                if (seconds < 0) {
                    seconds = 59;
                    minutes -= 1;
                }
                if (minutes < 0) {
                    minutes = 59;
                    hours -= 1;
                }
                if (hours < 0) {
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }
                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
        <div className="flex items-center gap-1.5">
            {[
                { value: pad(timeLeft.hours), label: "Giờ" },
                { value: pad(timeLeft.minutes), label: "Phút" },
                { value: pad(timeLeft.seconds), label: "Giây" },
            ].map((unit, i) => (
                <div key={unit.label} className="flex items-center gap-1.5">
                    <div className="flex flex-col items-center">
                        <span className="bg-foreground text-background font-mono font-extrabold text-lg md:text-2xl rounded-lg px-2.5 py-1 min-w-10 text-center shadow-lg">
                            {unit.value}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium">
                            {unit.label}
                        </span>
                    </div>
                    {i < 2 && (
                        <span className="text-2xl font-bold text-primary mb-4 animate-pulse">
                            :
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
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

export default function FlashSale({ products }: FlashSaleProps) {
    const hasProducts = products.length > 0;

    return (
        <section className="relative py-24 overflow-hidden bg-linear-to-b from-orange-50/70 via-background to-rose-50/40 dark:from-orange-950/20 dark:via-background dark:to-rose-950/15">
            {/* Ambient dots */}
            <DotPattern
                width={16}
                height={16}
                cx={1}
                cy={1}
                cr={1}
                className="absolute inset-0 opacity-30 mask-[radial-gradient(500px_circle_at_center,white,transparent)] fill-orange-400/15 dark:fill-orange-400/10"
            />

            {/* Decorative gradient blobs */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-400/15 rounded-full blur-3xl dark:bg-red-500/12" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-400/15 rounded-full blur-3xl dark:bg-orange-500/12" />

            <div className="container relative mx-auto px-4 z-10">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-widest mb-3 border border-red-500/30 rounded-full px-4 py-1.5 bg-red-500/10 text-red-600 dark:text-red-400 shadow-sm">
                            <Flame className="w-4 h-4" />
                            <span>Flash Sale</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Đang Giảm Giá{" "}
                            <span className="bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                Sốc
                            </span>
                        </h2>
                        <p className="mt-3 text-muted-foreground text-lg max-w-xl">
                            Nhanh tay chọn ngay — ưu đãi có hạn, giá cực tốt chỉ
                            trong hôm nay!
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-end gap-3"
                    >
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Timer className="w-4 h-4" />
                            <span className="font-semibold">Kết thúc sau</span>
                        </div>
                        <CountdownTimer />
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                    {hasProducts
                        ? products.map((product, index) => (
                              <motion.div
                                  key={product.id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true, margin: "-80px" }}
                                  transition={{
                                      duration: 0.5,
                                      delay: index * 0.08,
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
                                  transition={{
                                      duration: 0.5,
                                      delay: i * 0.08,
                                  }}
                              >
                                  <ProductSkeleton />
                              </motion.div>
                          ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-center mt-12"
                >
                    <Link
                        href="/products?sale=true"
                        className="inline-flex items-center gap-2 group px-8 py-3.5 rounded-full cursor-pointer bg-linear-to-r from-red-600 to-orange-500 text-white font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-orange-500/25 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5"
                    >
                        <span>Xem Toàn Bộ Sale</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
