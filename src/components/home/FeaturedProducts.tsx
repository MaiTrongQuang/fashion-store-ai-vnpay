import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

interface FeaturedProductsProps {
    products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    if (products.length === 0) return null;

    return (
        <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="text-sm font-medium text-primary/70 uppercase tracking-widest mb-2">
                            Được Yêu Thích
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Sản Phẩm Nổi Bật
                        </h2>
                    </div>
                    <Link
                        href="/products?featured=true"
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1 group"
                    >
                        Xem tất cả
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
