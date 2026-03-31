"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/lib/types";

interface HeroBannerProps {
    banners: Banner[];
}

export default function HeroBanner({ banners }: HeroBannerProps) {
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
    }, [banners.length]);

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
    }, [banners.length]);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next, banners.length]);

    if (banners.length === 0) {
        return (
            <section className="relative h-[60vh] md:h-[80vh] bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                <div className="text-center space-y-4 px-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            LUXE Fashion
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Thời trang cao cấp - Phong cách đẳng cấp
                    </p>
                    <Link href="/products">
                        <Button size="lg" className="mt-4">
                            Khám Phá Ngay
                        </Button>
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="relative h-[60vh] md:h-[80vh] overflow-hidden group">
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        index === current
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-105"
                    }`}
                >
                    <Image
                        src={banner.image_url}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-end pb-20 md:pb-28">
                        <div className="container mx-auto px-4">
                            <div className="max-w-2xl space-y-4 animate-in slide-in-from-bottom-4 duration-700">
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                                    {banner.title}
                                </h2>
                                {banner.subtitle && (
                                    <p className="text-base md:text-xl text-white/80">
                                        {banner.subtitle}
                                    </p>
                                )}
                                {banner.link_url && (
                                    <Link href={banner.link_url}>
                                        <Button
                                            size="lg"
                                            className="mt-4 bg-white text-black hover:bg-white/90 font-semibold"
                                        >
                                            Xem Ngay →
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation arrows */}
            {banners.length > 1 && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/40 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/40 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>

                    {/* Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`h-2 rounded-full transition-all duration-500 ${
                                    index === current
                                        ? "w-8 bg-white"
                                        : "w-2 bg-white/50 hover:bg-white/70"
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
