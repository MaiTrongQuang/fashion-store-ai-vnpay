"use client";

import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/types";
import { GridPattern } from "@/components/ui/backgrounds";
import { motion, type Variants } from "framer-motion";

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

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 },
    },
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
    if (categories.length === 0) return null;

    return (
        <section className="relative py-20 overflow-hidden bg-background">
            {/* Background Grid for AI context */}
            <div className="absolute inset-0 bg-background/5" />
            <GridPattern
                width={32}
                height={32}
                x={-1}
                y={-1}
                className="absolute inset-0 h-[200%] rotate-12 scale-150 origin-top-left opacity-30 stroke-primary/10 mask-[linear-gradient(to_bottom,transparent,white,transparent)]"
            />

            <div className="container relative mx-auto px-4 z-10">
                <div className="text-center mb-12">
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary uppercase tracking-widest mb-3"
                    >
                        Bộ sưu tập AI
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
                    >
                        Khám Phá Danh Mục
                    </motion.h2>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
                >
                    {categories.slice(0, 4).map((category) => (
                        <motion.div key={category.id} variants={itemVariants}>
                            <Link
                                href={`/collections/${category.slug}`}
                                className="group relative block aspect-4/5 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-primary/10"
                            >
                                <Image
                                    src={
                                        category.image_url ||
                                        CATEGORY_IMAGES[category.slug] ||
                                        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600"
                                    }
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                                        <svg
                                            className="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-1">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-white/70">
                                        Định hình phong cách
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
