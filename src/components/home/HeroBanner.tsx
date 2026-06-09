"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";
import type { Banner } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HeroBannerProps {
    banners: Banner[];
}

type HeroSlide = {
    imageUrl: string;
    title: string;
    subtitle: string;
    href: string;
    eyebrow: string;
    alt: string;
};

const FALLBACK_SLIDES: HeroSlide[] = [
    {
        imageUrl: "/banners/nana-editorial-white.png",
        title: "Nana Store",
        subtitle:
            "Tuyển chọn thời trang hằng ngày với phom dáng dễ mặc, chất liệu thoải mái và thanh toán nhanh qua VNPay.",
        href: "/products",
        eyebrow: "New season edit",
        alt: "Nana Store editorial white fashion campaign",
    },
    {
        imageUrl: "/banners/nana-summer-street.png",
        title: "City Summer",
        subtitle:
            "Áo, quần, đầm và phụ kiện cho lịch trình thành phố: gọn gàng, hiện đại, dễ phối.",
        href: "/collections/sale",
        eyebrow: "Selected offers",
        alt: "Nana Store summer street fashion campaign",
    },
];

const HERO_INTERVAL_MS = 6200;

export default function HeroBanner({ banners }: HeroBannerProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const slides = useMemo<HeroSlide[]>(() => {
        const activeBanners = banners
            .filter((banner) => banner.image_url)
            .map((banner) => ({
                imageUrl: banner.image_url,
                title: banner.title || SITE_NAME,
                subtitle:
                    banner.subtitle ||
                    "Khám phá bộ sưu tập mới, ưu đãi đang chạy và sản phẩm được chọn lọc trong ngày.",
                href: banner.link_url || "/products",
                eyebrow: "Campaign",
                alt: banner.title ? `Banner ${banner.title}` : SITE_NAME,
            }));

        return activeBanners.length
            ? [...activeBanners, ...FALLBACK_SLIDES]
            : FALLBACK_SLIDES;
    }, [banners]);

    const activeSlide = slides[activeIndex % slides.length];

    useEffect(() => {
        if (slides.length <= 1) return;

        const intervalId = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % slides.length);
        }, HERO_INTERVAL_MS);

        return () => window.clearInterval(intervalId);
    }, [slides.length]);

    const goToSlide = (index: number) => setActiveIndex(index);
    const goPrev = () =>
        setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
    const goNext = () => setActiveIndex((current) => (current + 1) % slides.length);

    return (
        <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
            <div className="relative min-h-[540px] sm:min-h-[600px] lg:min-h-[650px]">
                {slides.map((slide, index) => {
                    const isActive = index === activeIndex % slides.length;

                    return (
                        <div
                            key={`${slide.imageUrl}-${index}`}
                            className={cn(
                                "absolute inset-0 transition-opacity duration-700 ease-out",
                                isActive ? "opacity-100" : "opacity-0",
                            )}
                            aria-hidden={!isActive}
                        >
                            <Image
                                src={slide.imageUrl}
                                alt={slide.alt}
                                fill
                                priority={index === 0}
                                sizes="100vw"
                                className={cn(
                                    "object-cover transition-transform duration-[6500ms] ease-out",
                                    isActive ? "scale-100" : "scale-[1.04]",
                                )}
                            />
                        </div>
                    );
                })}

                <div className="absolute inset-0 bg-linear-to-r from-black/74 via-black/34 to-black/14" />
                <div className="absolute inset-0 bg-linear-to-t from-black/56 via-transparent to-black/16" />

                <div className="container relative z-10 mx-auto flex min-h-[540px] flex-col justify-end px-4 pb-8 pt-24 sm:min-h-[600px] sm:px-6 sm:pb-10 lg:min-h-[650px] lg:px-8">
                    <div className="max-w-3xl pb-12 md:pb-16">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/72">
                            {activeSlide.eyebrow}
                        </p>
                        <h1
                            id="hero-heading"
                            className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-normal text-white sm:text-5xl md:text-6xl lg:text-7xl"
                        >
                            {activeSlide.title}
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-7 text-white/78 sm:text-lg">
                            {activeSlide.subtitle}
                        </p>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link
                                href={activeSlide.href}
                                className={cn(
                                    buttonVariants({ size: "lg" }),
                                    "h-12 rounded-md bg-white px-6 text-base font-semibold text-neutral-950 hover:bg-white/90",
                                )}
                            >
                                Mua ngay
                                <ArrowRight className="h-4 w-4" aria-hidden />
                            </Link>
                            <Link
                                href="/products"
                                className={cn(
                                    buttonVariants({
                                        size: "lg",
                                        variant: "outline",
                                    }),
                                    "h-12 rounded-md border-white/60 bg-white/10 px-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/18 hover:text-white",
                                )}
                            >
                                Xem bộ sưu tập
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-2 text-sm text-white/82">
                            <Link
                                href="/collections/nam"
                                className="rounded-md border border-white/28 bg-white/10 px-3 py-2 backdrop-blur-sm transition hover:bg-white/18"
                            >
                                Nam
                            </Link>
                            <Link
                                href="/collections/nu"
                                className="rounded-md border border-white/28 bg-white/10 px-3 py-2 backdrop-blur-sm transition hover:bg-white/18"
                            >
                                Nữ
                            </Link>
                            <Link
                                href="/collections/sale"
                                className="rounded-md border border-white/28 bg-white/10 px-3 py-2 backdrop-blur-sm transition hover:bg-white/18"
                            >
                                Sale
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-3 border-t border-white/16 pt-4 text-sm text-white/76 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" aria-hidden />
                            <span>Miễn phí vận chuyển từ 500K</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" aria-hidden />
                            <span>Thanh toán VNPay an toàn</span>
                        </div>
                        <div className="hidden items-center gap-2 lg:flex">
                            <ArrowRight className="h-4 w-4" aria-hidden />
                            <span>Đổi trả trong 7 ngày</span>
                        </div>
                    </div>
                </div>

                {slides.length > 1 && (
                    <>
                        <button
                            type="button"
                            aria-label="Slide trước"
                            onClick={goPrev}
                            className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-white/28 bg-black/22 text-white backdrop-blur-sm transition hover:bg-black/36 focus-visible:ring-2 focus-visible:ring-white/70 md:flex"
                        >
                            <ChevronLeft className="h-5 w-5" aria-hidden />
                        </button>
                        <button
                            type="button"
                            aria-label="Slide sau"
                            onClick={goNext}
                            className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-white/28 bg-black/22 text-white backdrop-blur-sm transition hover:bg-black/36 focus-visible:ring-2 focus-visible:ring-white/70 md:flex"
                        >
                            <ChevronRight className="h-5 w-5" aria-hidden />
                        </button>
                        <div
                            className="absolute bottom-7 right-4 z-20 flex items-center gap-2 sm:right-6 lg:right-8"
                            aria-label="Chọn slide trang chủ"
                        >
                            {slides.map((slide, index) => {
                                const isActive = index === activeIndex % slides.length;
                                return (
                                    <button
                                        key={`${slide.imageUrl}-dot-${index}`}
                                        type="button"
                                        aria-label={`Chuyển đến slide ${index + 1}`}
                                        aria-current={isActive ? "true" : undefined}
                                        onClick={() => goToSlide(index)}
                                        className={cn(
                                            "h-2 rounded-full bg-white/55 transition-all hover:bg-white",
                                            isActive ? "w-8" : "w-2",
                                        )}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
