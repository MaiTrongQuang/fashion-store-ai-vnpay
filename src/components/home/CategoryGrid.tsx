import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/types";

interface CategoryGridProps {
    categories: Category[];
}

const CATEGORY_IMAGES: Record<string, string> = {
    ao: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600",
    quan: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
    "dam-vay":
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
    "phu-kien":
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600",
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
    if (categories.length === 0) return null;

    return (
        <section className="py-16 md:py-20 bg-accent/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <p className="text-sm font-medium text-primary/70 uppercase tracking-widest mb-2">
                        Khám Phá
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Danh Mục Sản Phẩm
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {categories.slice(0, 4).map((category) => (
                        <Link
                            key={category.id}
                            href={`/collections/${category.slug}`}
                            className="group relative aspect-square rounded-2xl overflow-hidden"
                        >
                            <Image
                                src={
                                    category.image_url ||
                                    CATEGORY_IMAGES[category.slug] ||
                                    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600"
                                }
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                <h3 className="text-lg md:text-xl font-bold text-white">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-white/70 mt-1 group-hover:text-white transition-colors">
                                    Xem bộ sưu tập →
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
