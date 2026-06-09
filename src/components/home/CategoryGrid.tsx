"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";

interface CategoryGridProps {
    categories: Category[];
}

const CATEGORY_IMAGES: Record<string, string> = {
    ao: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900",
    quan: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900",
    "dam-vay":
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900",
    "phu-kien":
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900",
};

const PLACEHOLDER_CATEGORIES = [
    {
        name: "Áo",
        slug: "ao",
        image: CATEGORY_IMAGES.ao,
    },
    {
        name: "Quần",
        slug: "quan",
        image: CATEGORY_IMAGES.quan,
    },
    {
        name: "Đầm & Váy",
        slug: "dam-vay",
        image: CATEGORY_IMAGES["dam-vay"],
    },
    {
        name: "Phụ Kiện",
        slug: "phu-kien",
        image: CATEGORY_IMAGES["phu-kien"],
    },
];

export default function CategoryGrid({ categories }: CategoryGridProps) {
    const hasCategories = categories.length > 0;
    const displayCategories = hasCategories
        ? categories.slice(0, 4)
        : PLACEHOLDER_CATEGORIES;

    return (
        <section className="border-b border-border bg-background py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Mua theo danh mục
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                            Tìm nhanh phong cách bạn cần
                        </h2>
                    </div>
                    <Link
                        href="/products"
                        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
                    >
                        Xem tất cả
                        <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                    {displayCategories.map((category) => {
                        const imageUrl =
                            "image_url" in category
                                ? category.image_url ||
                                  CATEGORY_IMAGES[category.slug] ||
                                  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900"
                                : category.image;

                        return (
                            <Link
                                key={"id" in category ? category.id : category.slug}
                                href={`/collections/${category.slug}`}
                                className="group relative block overflow-hidden rounded-md bg-muted"
                            >
                                <div className="relative aspect-[4/5]">
                                    <Image
                                        src={imageUrl}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/12 to-transparent" />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-5">
                                    <h3 className="text-lg font-semibold md:text-xl">
                                        {category.name}
                                    </h3>
                                    <p className="mt-1 flex items-center gap-1 text-sm text-white/82">
                                        Khám phá
                                        <ArrowRight
                                            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                            aria-hidden
                                        />
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
