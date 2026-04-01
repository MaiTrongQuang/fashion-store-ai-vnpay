"use client";

import { Crown } from "lucide-react";
import { DotPattern } from "@/components/ui/backgrounds";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Fashion brand data – 2 rows, each with its own scroll direction   */
/* ------------------------------------------------------------------ */

interface FashionBrand {
    name: string;
    /** Short SVG‑safe monogram or icon character(s) shown inside circle */
    monogram: string;
}

const ROW_1_BRANDS: FashionBrand[] = [
    { name: "CHANEL", monogram: "CC" },
    { name: "Louis Vuitton", monogram: "LV" },
    { name: "Gucci", monogram: "GG" },
    { name: "Prada", monogram: "PR" },
    { name: "Versace", monogram: "VS" },
    { name: "Dior", monogram: "CD" },
    { name: "Hermès", monogram: "H" },
    { name: "Burberry", monogram: "BB" },
    { name: "Zara", monogram: "ZR" },
    { name: "H&M", monogram: "HM" },
];

const ROW_2_BRANDS: FashionBrand[] = [
    { name: "Balenciaga", monogram: "BL" },
    { name: "Valentino", monogram: "VT" },
    { name: "Givenchy", monogram: "GV" },
    { name: "Saint Laurent", monogram: "YSL" },
    { name: "Fendi", monogram: "FF" },
    { name: "Nike", monogram: "NK" },
    { name: "Adidas", monogram: "AD" },
    { name: "Uniqlo", monogram: "UQ" },
    { name: "Calvin Klein", monogram: "CK" },
    { name: "Tommy Hilfiger", monogram: "TH" },
];

/* ------------------------------------------------------------------ */
/*  Brand card                                                         */
/* ------------------------------------------------------------------ */

function BrandCard({ brand }: { brand: FashionBrand }) {
    return (
        <div className="group shrink-0 flex flex-col items-center gap-3 px-6 py-5 mx-3 bg-background rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 select-none cursor-pointer min-w-35">
            <div className="relative w-16 h-16 rounded-full bg-linear-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden group-hover:scale-110 group-hover:border-primary/30 transition-all duration-500">
                <span className="text-lg font-extrabold tracking-tight text-primary/80 group-hover:text-primary transition-colors duration-300">
                    {brand.monogram}
                </span>
            </div>
            <span className="text-sm font-semibold text-foreground/70 group-hover:text-primary transition-colors duration-300 whitespace-nowrap">
                {brand.name}
            </span>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Marquee row – pure CSS infinite scroll                             */
/* ------------------------------------------------------------------ */

function MarqueeRow({
    brands,
    direction = "left",
    speed = 35,
}: {
    brands: FashionBrand[];
    direction?: "left" | "right";
    speed?: number;
}) {
    // Duplicate for seamless loop
    const duplicated = [...brands, ...brands];
    const animationName =
        direction === "left" ? "marquee-left" : "marquee-right";

    return (
        <div className="relative overflow-hidden py-2 group/marquee">
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-linear-to-r from-muted/30 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-linear-to-l from-muted/30 to-transparent" />

            <div
                className="flex w-max"
                style={{
                    animation: `${animationName} ${speed}s linear infinite`,
                }}
            >
                {duplicated.map((brand, i) => (
                    <BrandCard key={`${brand.name}-${i}`} brand={brand} />
                ))}
            </div>

            {/* Inline keyframes */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes marquee-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
            `,
                }}
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function BrandShowcase() {
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
                {/* ── Heading ── */}
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

                {/* ── Row 1 : Left → Right ── */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <MarqueeRow
                        brands={ROW_1_BRANDS}
                        direction="right"
                        speed={40}
                    />
                </motion.div>

                {/* ── Row 2 : Right → Left ── */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-4"
                >
                    <MarqueeRow
                        brands={ROW_2_BRANDS}
                        direction="left"
                        speed={35}
                    />
                </motion.div>
            </div>
        </section>
    );
}
