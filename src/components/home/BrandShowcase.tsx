"use client";

import Image from "next/image";
import Link from "next/link";
import { Crown } from "lucide-react";
import type { Brand } from "@/lib/types";
import { DotPattern } from "@/components/ui/backgrounds";
import { motion, type Variants } from "framer-motion";

interface BrandShowcaseProps {
    brands: Brand[];
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 },
    },
};

const PLACEHOLDER_BRANDS = ["Nike", "Adidas", "Gucci", "Zara", "H&M", "Uniqlo"];

export default function BrandShowcase({ brands }: BrandShowcaseProps) {
    const hasBrands = brands.length > 0;

    return (
        <section className="relative py-24 overflow-hidden bg-muted/30">
            <DotPattern
                width={24}
                height={24}
                cx={1}
                cy={1}
                cr={1}
                className="absolute inset-0 opacity-20 mask-[linear-gradient(to_bottom,transparent,white,transparent)]"
            />

            <div className="container relative mx-auto px-4 z-10">
                <div className="text-center mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary uppercase tracking-widest mb-3"
                    >
                        <Crown className="w-4 h-4" />
                        <span>Đối Tác Uy Tín</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight"
                    >
                        Thương Hiệu Nổi Bật
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto"
                    >
                        Hợp tác cùng các thương hiệu thời trang hàng đầu, cam
                        kết chính hãng 100%.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
                >
                    {hasBrands
                        ? brands.map((brand) => (
                              <motion.div
                                  key={brand.id}
                                  variants={itemVariants}
                              >
                                  <Link
                                      href={`/products?brand=${brand.slug}`}
                                      className="group flex flex-col items-center gap-4 p-6 bg-background rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1"
                                  >
                                      <div className="relative w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500">
                                          {brand.logo_url ? (
                                              <Image
                                                  src={brand.logo_url}
                                                  alt={brand.name}
                                                  fill
                                                  className="object-contain p-2"
                                                  sizes="64px"
                                              />
                                          ) : (
                                              <span className="text-2xl font-extrabold text-primary/70">
                                                  {brand.name.charAt(0)}
                                              </span>
                                          )}
                                      </div>
                                      <span className="text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors text-center">
                                          {brand.name}
                                      </span>
                                  </Link>
                              </motion.div>
                          ))
                        : PLACEHOLDER_BRANDS.map((name) => (
                              <motion.div key={name} variants={itemVariants}>
                                  <div className="group flex flex-col items-center gap-4 p-6 bg-background rounded-2xl border border-border/50 transition-all duration-500">
                                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                          <span className="text-2xl font-extrabold text-primary/70">
                                              {name.charAt(0)}
                                          </span>
                                      </div>
                                      <span className="text-sm font-semibold text-foreground/80 text-center">
                                          {name}
                                      </span>
                                  </div>
                              </motion.div>
                          ))}
                </motion.div>
            </div>
        </section>
    );
}
