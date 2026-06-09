"use client";

/* eslint-disable @next/next/no-img-element */
import { Sparkles } from "lucide-react";

type Brand = {
    name: string;
    logo: string;
    tag: string;
    logoPanelBackground?: string;
};

const BRANDS: Brand[] = [
    {
        name: "Zara",
        logo: "/brand-logos/zara.svg",
        tag: "Sàn diễn",
    },
    {
        name: "H&M",
        logo: "/brand-logos/hm.png",
        tag: "Đời thường",
    },
    {
        name: "Uniqlo",
        logo: "/brand-logos/uniqlo.svg",
        tag: "Basic tinh gọn",
    },
    {
        name: "Nike",
        logo: "/brand-logos/nike.svg",
        tag: "Năng động",
    },
    {
        name: "Adidas",
        logo: "/brand-logos/adidas.svg",
        tag: "Streetwear",
    },
    {
        name: "CANIFA",
        logo: "/brand-logos/canifa.png",
        tag: "Gia đình",
    },
    {
        name: "YODY",
        logo: "/brand-logos/yody.png",
        tag: "Rực rỡ",
    },
    {
        name: "Routine",
        logo: "/brand-logos/routine.png",
        tag: "Nam tính",
    },
    {
        name: "OWEN",
        logo: "/brand-logos/owen.svg",
        tag: "Công sở",
        logoPanelBackground: "#111827",
    },
    {
        name: "IVY moda",
        logo: "/brand-logos/ivymoda.avif",
        tag: "Nữ tính",
    },
    {
        name: "Elise",
        logo: "/brand-logos/elise.png",
        tag: "Thanh lịch",
    },
    {
        name: "Ninomaxx",
        logo: "/brand-logos/ninomaxx.jpg",
        tag: "Phố thị",
    },
];

export default function BrandShowcase() {
    return (
        <section
            id="brand-showcase"
            className="scroll-mt-28 border-b border-border bg-neutral-50/60 py-12"
        >
            <div className="container mx-auto px-4">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shadow-sm">
                            <Sparkles className="h-3.5 w-3.5" />
                            Bộ sưu tập
                        </div>
                        <h2 className="text-lg font-bold uppercase tracking-[0.18em] text-foreground sm:text-xl">
                            Thương hiệu nổi bật
                        </h2>
                    </div>
                    <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-right">
                        Lựa chọn đa dạng từ basic hằng ngày đến streetwear,
                        phối màu theo từng cá tính.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {BRANDS.map((brand) => (
                        <article
                            key={brand.name}
                            className="group relative min-h-28 overflow-hidden rounded-md border border-border bg-white p-4 shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
                        >
                            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-neutral-900 via-brand-2 to-neutral-200 opacity-60" />
                            <div className="flex flex-col gap-3">
                                <div
                                    className="flex h-14 w-full items-center justify-center rounded-md border border-border bg-white p-2.5 shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
                                    style={{
                                        backgroundColor:
                                            brand.logoPanelBackground ??
                                            "#ffffff",
                                    }}
                                >
                                    <img
                                        src={brand.logo}
                                        alt={`${brand.name} logo`}
                                        className="max-h-full max-w-full object-contain"
                                        onError={(event) => {
                                            event.currentTarget.style.display =
                                                "none";
                                            const fallback =
                                                event.currentTarget
                                                    .nextElementSibling;
                                            if (fallback instanceof HTMLElement) {
                                                fallback.hidden = false;
                                            }
                                        }}
                                    />
                                    <span
                                        hidden
                                        className="text-center text-xs font-black uppercase tracking-tight text-foreground"
                                    >
                                        {brand.name}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base font-bold leading-tight text-foreground">
                                        {brand.name}
                                    </h3>
                                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                                        {brand.tag}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 flex items-center gap-1.5">
                                <span
                                    className="h-px flex-1 rounded-full bg-neutral-300"
                                    aria-hidden="true"
                                />
                                <span
                                    className="h-px w-5 rounded-full bg-brand-2/70"
                                    aria-hidden="true"
                                />
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
