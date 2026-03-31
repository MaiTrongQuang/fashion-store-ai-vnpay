"use client";

import { useState } from "react";
import Image from "next/image";
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
            <div className="aspect-[3/4] bg-muted rounded-2xl flex items-center justify-center">
                <p className="text-muted-foreground">Chưa có ảnh</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-muted rounded-2xl overflow-hidden group cursor-zoom-in">
                <Image
                    src={selectedImage.url}
                    alt={selectedImage.alt || productName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {sortedImages.map((img, index) => (
                        <button
                            key={img.id}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 transition-all duration-200 ${
                                index === selectedIndex
                                    ? "ring-2 ring-primary ring-offset-2"
                                    : "opacity-60 hover:opacity-100"
                            }`}
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
        </div>
    );
}
