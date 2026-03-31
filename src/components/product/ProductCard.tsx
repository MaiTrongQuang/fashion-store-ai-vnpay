"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const primaryImage =
        product.images?.find((img) => img.is_primary) || product.images?.[0];
    const discount = product.sale_price
        ? getDiscountPercent(product.base_price, product.sale_price)
        : 0;

    return (
        <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-card">
            <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    {primaryImage ? (
                        <Image
                            src={primaryImage.url}
                            alt={primaryImage.alt || product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No image
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {discount > 0 && (
                            <Badge className="bg-red-500 hover:bg-red-500 text-white text-xs font-bold px-2">
                                -{discount}%
                            </Badge>
                        )}
                        {product.is_new && (
                            <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white text-xs">
                                Mới
                            </Badge>
                        )}
                        {product.is_featured && (
                            <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-xs">
                                HOT
                            </Badge>
                        )}
                    </div>

                    {/* Quick actions overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full shadow-lg"
                            onClick={(e) => {
                                e.preventDefault();
                                // TODO: Add to wishlist
                            }}
                        >
                            <Heart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Link>

            <CardContent className="p-3 md:p-4">
                <Link href={`/products/${product.slug}`}>
                    <div className="space-y-1.5">
                        {product.brand && (
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                {product.brand.name}
                            </p>
                        )}
                        <h3 className="font-medium text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-base md:text-lg">
                                {formatPrice(
                                    product.sale_price || product.base_price,
                                )}
                            </span>
                            {product.sale_price && (
                                <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(product.base_price)}
                                </span>
                            )}
                        </div>
                    </div>
                </Link>
            </CardContent>
        </Card>
    );
}
