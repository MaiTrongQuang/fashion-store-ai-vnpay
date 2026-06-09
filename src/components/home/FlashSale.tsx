"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Timer } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

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
        const timer = window.setInterval(() => {
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

        return () => window.clearInterval(timer);
    }, []);

    const units = [
        { label: "Giờ", value: timeLeft.hours },
        { label: "Phút", value: timeLeft.minutes },
        { label: "Giây", value: timeLeft.seconds },
    ];

    return (
        <div className="flex items-center gap-2">
            {units.map((unit) => (
                <div key={unit.label} className="text-center">
                    <span className="block min-w-10 rounded-sm bg-neutral-950 px-2 py-1 font-mono text-base font-semibold text-white">
                        {unit.value.toString().padStart(2, "0")}
                    </span>
                    <span className="mt-1 block text-[10px] uppercase tracking-wide text-muted-foreground">
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    );
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

export default function FlashSale({ products }: FlashSaleProps) {
    const hasProducts = products.length > 0;

    return (
        <section className="border-b border-border bg-muted/25 py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-red-600">
                            Sale
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                            Ưu đãi đang chạy
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                            Các sản phẩm có giá tốt trong ngày, sắp xếp rõ ràng
                            để bạn chọn nhanh theo nhu cầu.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <Timer className="h-4 w-4" aria-hidden />
                            Kết thúc sau
                        </div>
                        <CountdownTimer />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
                    {hasProducts
                        ? products.map((product) => (
                              <ProductCard key={product.id} product={product} />
                          ))
                        : Array.from({ length: 4 }).map((_, i) => (
                              <ProductSkeleton key={`sale-skeleton-${i}`} />
                          ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <Link
                        href="/products?sale=true"
                        className="inline-flex min-h-11 items-center gap-2 rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                    >
                        Xem toàn bộ sale
                        <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    );
}
