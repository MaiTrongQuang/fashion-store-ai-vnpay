"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { ProductImage } from "@/lib/types";

interface ProductGalleryProps {
    images: ProductImage[];
    productName: string;
}

export default function ProductGallery({
    images,
    productName,
}: ProductGalleryProps) {
    const sortedImages = useMemo(
        () =>
            [...images].sort((a, b) => {
                if (a.is_primary) return -1;
                if (b.is_primary) return 1;
                return a.sort_order - b.sort_order;
            }),
        [images],
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedImage = sortedImages[selectedIndex];

    if (sortedImages.length === 0) {
        return (
            <div className="flex aspect-square min-h-[360px] items-center justify-center rounded-md border border-dashed border-border bg-muted/40">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <ImageOff className="h-10 w-10" />
                    <p className="text-sm font-medium">Chưa có ảnh</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-3 lg:sticky lg:top-24 lg:grid-cols-[5rem_minmax(0,1fr)]">
            {sortedImages.length > 1 && (
                <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0">
                    {sortedImages.map((img, index) => (
                        <button
                            type="button"
                            key={`${img.url}-${index}`}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-md border bg-muted/30 transition-all duration-200 ${
                                index === selectedIndex
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-border opacity-75 hover:opacity-100"
                            }`}
                            aria-label={`Xem ảnh ${index + 1} của ${productName}`}
                        >
                            <Image
                                src={img.url}
                                alt={img.alt || `${productName} - ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}

            <div className="order-1 overflow-hidden rounded-md border border-border/70 bg-muted/30 lg:order-2">
                <div className="relative aspect-3/4 w-full">
                    <div className="absolute inset-0">
                        <Image
                            src={selectedImage.url}
                            alt={selectedImage.alt || productName}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 52vw, 640px"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
