"use client";

import { Crown } from "lucide-react";
import { DotPattern } from "@/components/ui/backgrounds";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Brand data with inline SVG logos                                   */
/* ------------------------------------------------------------------ */

interface FashionBrand {
    name: string;
    logo: React.ReactNode;
}

/**
 * Helper – renders a text-based logo inside a consistent SVG viewport.
 * Uses elegant serif / sans-serif styling per brand.
 */
function TextLogo({
    text,
    fontSize = 14,
    fontFamily = "'Georgia', serif",
    letterSpacing = 2,
    fontWeight = 700,
}: {
    text: string;
    fontSize?: number;
    fontFamily?: string;
    letterSpacing?: number;
    fontWeight?: number;
}) {
    return (
        <svg
            viewBox="0 0 120 40"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
        >
            <text
                x="50%"
                y="54%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize={fontSize}
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
            >
                {text}
            </text>
        </svg>
    );
}

/* ── Inline SVG logos for each brand ── */

const ChanelLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <path
            d="M60 8c-12 0-22 10-22 22s10 22 22 22c5 0 10-2 14-5-4-3-7-7-8-12h-6c-.5 0-1-.5-1-1s.5-1 1-1h6c0-1 0-2 0-3s0-2 0-3h-6c-.5 0-1-.5-1-1s.5-1 1-1h6c1-5 4-9 8-12-4-3-9-5-14-5z"
            opacity=".85"
        />
        <path
            d="M60 8c12 0 22 10 22 22s-10 22-22 22c-5 0-10-2-14-5 4-3 7-7 8-12h6c.5 0 1-.5 1-1s-.5-1-1-1h-6c0-1 0-2 0-3s0-2 0-3h6c.5 0 1-.5 1-1s-.5-1-1-1h-6c-1-5-4-9-8-12 4-3 9-5 14-5z"
            opacity=".85"
        />
    </svg>
);

const LVLogo = () => (
    <TextLogo
        text="LOUIS VUITTON"
        fontSize={9}
        letterSpacing={1.5}
        fontFamily="'Georgia', serif"
    />
);

const GucciLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="16"
            fontFamily="'Georgia', serif"
            fontWeight="700"
            letterSpacing="3"
        >
            GUCCI
        </text>
    </svg>
);

const PradaLogo = () => (
    <svg viewBox="0 0 120 50" fill="currentColor" className="w-full h-full">
        <path d="M10 10h100v2H10z" opacity=".7" />
        <text
            x="50%"
            y="56%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="15"
            fontFamily="'Georgia', serif"
            fontWeight="600"
            letterSpacing="4"
        >
            PRADA
        </text>
        <path d="M10 38h100v2H10z" opacity=".7" />
    </svg>
);

const VersaceLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <circle
            cx="60"
            cy="30"
            r="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity=".4"
        />
        <text
            x="50%"
            y="36%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="8"
            fontFamily="'Georgia', serif"
            fontWeight="700"
            letterSpacing="2"
        >
            VERSACE
        </text>
        <text
            x="50%"
            y="60%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="18"
            fontFamily="'Georgia', serif"
            fontWeight="700"
        >
            ♔
        </text>
    </svg>
);

const DiorLogo = () => (
    <TextLogo
        text="DIOR"
        fontSize={22}
        letterSpacing={6}
        fontFamily="'Georgia', serif"
    />
);

const HermesLogo = () => (
    <TextLogo
        text="HERMÈS"
        fontSize={14}
        letterSpacing={3}
        fontFamily="'Georgia', serif"
        fontWeight={600}
    />
);

const BurberryLogo = () => (
    <TextLogo
        text="BURBERRY"
        fontSize={12}
        letterSpacing={3}
        fontFamily="'Helvetica', sans-serif"
        fontWeight={600}
    />
);

const ZaraLogo = () => (
    <TextLogo
        text="ZARA"
        fontSize={22}
        letterSpacing={5}
        fontFamily="'Georgia', serif"
        fontWeight={400}
    />
);

const HMLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="28"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="900"
            letterSpacing="0"
        >
            H&amp;M
        </text>
    </svg>
);

const NikeLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <path
            d="M25 40 C30 38, 80 15, 100 12 C95 15, 50 32, 30 42 Z"
            opacity=".85"
        />
        <text
            x="50%"
            y="78%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="7"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="700"
            letterSpacing="1"
            opacity=".6"
        >
            NIKE
        </text>
    </svg>
);

const AdidasLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <rect x="30" y="18" width="8" height="18" rx="1" opacity=".7" />
        <rect x="43" y="12" width="8" height="24" rx="1" opacity=".8" />
        <rect x="56" y="6" width="8" height="30" rx="1" opacity=".9" />
        <text
            x="50%"
            y="78%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="9"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="800"
            letterSpacing="2"
        >
            ADIDAS
        </text>
    </svg>
);

const UniqloLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <rect
            x="35"
            y="6"
            width="50"
            height="28"
            rx="2"
            fill="currentColor"
            opacity=".12"
        />
        <text
            x="50%"
            y="34%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="11"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="900"
            letterSpacing="0"
        >
            UNIQLO
        </text>
        <text
            x="50%"
            y="74%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="6"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="400"
            letterSpacing="1"
            opacity=".6"
        >
            ユニクロ
        </text>
    </svg>
);

const CKLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <text
            x="50%"
            y="38%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="18"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="300"
            letterSpacing="1"
        >
            Calvin Klein
        </text>
        <path d="M25 38h70v.5H25z" opacity=".3" />
        <text
            x="50%"
            y="68%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="7"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="400"
            letterSpacing="3"
            opacity=".5"
        >
            EST. 1968
        </text>
    </svg>
);

const TommyLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <rect x="20" y="14" width="80" height="6" rx="1" opacity=".15" />
        <rect x="20" y="22" width="80" height="8" rx="1" opacity=".08" />
        <rect x="20" y="32" width="80" height="6" rx="1" opacity=".15" />
        <text
            x="50%"
            y="72%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="7"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="800"
            letterSpacing="0.5"
        >
            TOMMY HILFIGER
        </text>
    </svg>
);

/* ── Vietnamese Brands ── */

const ThienLongLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <text
            x="50%"
            y="38%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="11"
            fontFamily="'Georgia', serif"
            fontWeight="700"
            letterSpacing="1"
        >
            NINOMAXX
        </text>
        <path d="M30 40h60v.5H30z" opacity=".3" />
        <text
            x="50%"
            y="68%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="6"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="400"
            letterSpacing="2"
            opacity=".5"
        >
            VIETNAM
        </text>
    </svg>
);

const EliseLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <text
            x="50%"
            y="40%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="18"
            fontFamily="'Georgia', serif"
            fontWeight="400"
            letterSpacing="4"
            fontStyle="italic"
        >
            Elise
        </text>
        <text
            x="50%"
            y="70%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="5.5"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="400"
            letterSpacing="2"
            opacity=".5"
        >
            FASHION
        </text>
    </svg>
);

const CanifaLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <text
            x="50%"
            y="44%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="16"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="900"
            letterSpacing="3"
        >
            CANIFA
        </text>
        <text
            x="50%"
            y="72%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="5"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="500"
            letterSpacing="2"
            opacity=".45"
        >
            FASHION FOR ALL
        </text>
    </svg>
);

const IvyModaLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <text
            x="50%"
            y="38%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="14"
            fontFamily="'Georgia', serif"
            fontWeight="700"
            letterSpacing="2"
        >
            IVY
        </text>
        <text
            x="50%"
            y="62%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="10"
            fontFamily="'Georgia', serif"
            fontWeight="400"
            letterSpacing="3"
        >
            moda
        </text>
    </svg>
);

const MaisonLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <text
            x="50%"
            y="34%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="12"
            fontFamily="'Georgia', serif"
            fontWeight="600"
            letterSpacing="1"
        >
            ROUTINE
        </text>
        <path d="M30 40h60v.5H30z" opacity=".25" />
        <text
            x="50%"
            y="68%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="5.5"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="400"
            letterSpacing="2"
            opacity=".5"
        >
            MENSWEAR
        </text>
    </svg>
);

const OwenLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <text
            x="50%"
            y="44%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="20"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="800"
            letterSpacing="4"
        >
            OWEN
        </text>
        <text
            x="50%"
            y="72%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="5"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="500"
            letterSpacing="3"
            opacity=".4"
        >
            MENSWEAR
        </text>
    </svg>
);

const AnPhuocLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <text
            x="50%"
            y="34%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="12"
            fontFamily="'Georgia', serif"
            fontWeight="700"
            letterSpacing="1"
        >
            AN PHƯỚC
        </text>
        <path d="M28 40h64v.5H28z" opacity=".25" />
        <text
            x="50%"
            y="66%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="5.5"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="400"
            letterSpacing="2"
            opacity=".45"
        >
            SINCE 1952
        </text>
    </svg>
);

const HoangPhucLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <text
            x="50%"
            y="34%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="10"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="800"
            letterSpacing="1"
        >
            HOÀNG PHÚC
        </text>
        <text
            x="50%"
            y="58%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="7"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="400"
            letterSpacing="2"
            opacity=".6"
        >
            International
        </text>
    </svg>
);

const VietTienLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <text
            x="50%"
            y="34%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="11"
            fontFamily="'Georgia', serif"
            fontWeight="700"
            letterSpacing="1"
        >
            VIỆT TIẾN
        </text>
        <path d="M30 40h60v.5H30z" opacity=".3" />
        <text
            x="50%"
            y="66%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="5.5"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="400"
            letterSpacing="2"
            opacity=".45"
        >
            VIETTIEN
        </text>
    </svg>
);

const TMLogo = () => (
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-full h-full">
        <text
            x="50%"
            y="38%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="14"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="900"
            letterSpacing="2"
        >
            YODY
        </text>
        <text
            x="50%"
            y="66%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="5.5"
            fontFamily="'Helvetica', sans-serif"
            fontWeight="500"
            letterSpacing="2"
            opacity=".45"
        >
            LOVE YOUR BODY
        </text>
    </svg>
);

/* ── Brand arrays ── */

const ROW_1_BRANDS: FashionBrand[] = [
    { name: "CHANEL", logo: <ChanelLogo /> },
    { name: "Louis Vuitton", logo: <LVLogo /> },
    { name: "Gucci", logo: <GucciLogo /> },
    { name: "Prada", logo: <PradaLogo /> },
    { name: "Versace", logo: <VersaceLogo /> },
    { name: "Dior", logo: <DiorLogo /> },
    { name: "Hermès", logo: <HermesLogo /> },
    { name: "Burberry", logo: <BurberryLogo /> },
    { name: "Zara", logo: <ZaraLogo /> },
    { name: "H&M", logo: <HMLogo /> },
    { name: "Ninomaxx", logo: <ThienLongLogo /> },
    { name: "Elise", logo: <EliseLogo /> },
];

const ROW_2_BRANDS: FashionBrand[] = [
    { name: "Nike", logo: <NikeLogo /> },
    { name: "Adidas", logo: <AdidasLogo /> },
    { name: "Uniqlo", logo: <UniqloLogo /> },
    { name: "Calvin Klein", logo: <CKLogo /> },
    { name: "Tommy Hilfiger", logo: <TommyLogo /> },
    { name: "CANIFA", logo: <CanifaLogo /> },
    { name: "IVY moda", logo: <IvyModaLogo /> },
    { name: "Routine", logo: <MaisonLogo /> },
    { name: "OWEN", logo: <OwenLogo /> },
    { name: "An Phước", logo: <AnPhuocLogo /> },
    { name: "Hoàng Phúc", logo: <HoangPhucLogo /> },
    { name: "Việt Tiến", logo: <VietTienLogo /> },
    { name: "YODY", logo: <TMLogo /> },
];

/* ------------------------------------------------------------------ */
/*  Brand card – improved UI with glassmorphism                        */
/* ------------------------------------------------------------------ */

function BrandCard({ brand }: { brand: FashionBrand }) {
    return (
        <div className="group shrink-0 flex items-center gap-4 px-5 py-4 mx-2 bg-background/80 backdrop-blur-sm rounded-xl border border-border/40 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-0.5 select-none cursor-pointer min-w-44">
            {/* Logo container */}
            <div className="shrink-0 w-12 h-12 rounded-lg bg-foreground/[0.04] border border-border/30 flex items-center justify-center overflow-hidden group-hover:scale-105 group-hover:bg-foreground/[0.07] group-hover:border-primary/20 transition-all duration-500 text-foreground/75 group-hover:text-primary">
                {brand.logo}
            </div>
            {/* Brand name */}
            <span className="text-[13px] font-semibold text-foreground/65 group-hover:text-foreground transition-colors duration-300 whitespace-nowrap tracking-wide">
                {brand.name}
            </span>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Marquee row – pure CSS infinite scroll, hover-pause                */
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
    const duplicated = [...brands, ...brands];
    const animClass =
        direction === "left" ? "marquee-scroll-left" : "marquee-scroll-right";

    return (
        <div className="relative overflow-hidden py-2 group/row">
            {/* Gradient fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-28 z-10 bg-linear-to-r from-muted/50 via-muted/20 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-28 z-10 bg-linear-to-l from-muted/50 via-muted/20 to-transparent" />

            <div
                className={`flex w-max ${animClass}`}
                style={{ animationDuration: `${speed}s` }}
            >
                {duplicated.map((brand, i) => (
                    <BrandCard key={`${brand.name}-${i}`} brand={brand} />
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function BrandShowcase() {
    return (
        <section className="relative py-20 overflow-hidden bg-muted/30">
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
                <div className="text-center mb-12">
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
                        className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Hợp tác cùng các thương hiệu thời trang quốc tế &amp;
                        Việt Nam hàng đầu, cam kết chính hãng 100%.
                    </motion.p>
                </div>

                {/* ── Row 1 : Left → Right (International + VN) ── */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <MarqueeRow
                        brands={ROW_1_BRANDS}
                        direction="right"
                        speed={45}
                    />
                </motion.div>

                {/* ── Row 2 : Right → Left (Sports + VN) ── */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-3"
                >
                    <MarqueeRow
                        brands={ROW_2_BRANDS}
                        direction="left"
                        speed={40}
                    />
                </motion.div>
            </div>

            {/* ── Global keyframes ── */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    .marquee-scroll-left {
                        animation: marquee-left linear infinite;
                    }
                    .marquee-scroll-right {
                        animation: marquee-right linear infinite;
                    }
                    .group\\/row:hover .marquee-scroll-left,
                    .group\\/row:hover .marquee-scroll-right {
                        animation-play-state: paused;
                    }
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
        </section>
    );
}
