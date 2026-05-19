"use client";

import { useState } from "react";
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
    const sortedImages = [...images].sort((a, b) => {
        if (a.is_primary) return -1;
        if (b.is_primary) return 1;
        return a.sort_order - b.sort_order;
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedImage = sortedImages[selectedIndex];

    if (sortedImages.length === 0) {
        return (
            <div className="flex aspect-square min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <ImageOff className="h-10 w-10" />
                    <p className="text-sm font-medium">Chưa có ảnh</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 lg:sticky lg:top-28">
            {/* Main Image */}
            <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-[#f7f7f5] shadow-sm">
                <div className="relative aspect-square w-full sm:aspect-[5/6]">
                    <div className="absolute inset-3 sm:inset-5">
                        <Image
                            src={selectedImage.url}
                            alt={selectedImage.alt || productName}
                            fill
                            className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 52vw, 640px"
                        />
                    </div>
                </div>
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {sortedImages.map((img, index) => (
                        <button
                            type="button"
                            key={img.id}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-muted/30 transition-all duration-200 ${
                                index === selectedIndex
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-border opacity-70 hover:opacity-100"
                            }`}
                        >
                            <Image
                                src={img.url}
                                alt={img.alt || `${productName} - ${index + 1}`}
                                fill
                                className="object-contain p-1"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
