"use client";

import { useState, useCallback, useRef, useEffect, memo, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Sparkles,
    Shirt,
    ShoppingBag,
    Wand2,
    Scissors,
    Glasses,
    Watch,
    CreditCard,
    QrCode,
    Wallet,
    Gem,
    Banknote,
    SmartphoneNfc,
    ShieldCheck,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

/** CTA hero: không dùng buttonVariants default (bg-primary + [a]:hover) để tránh trùng/chìm với bg-gradient-brand-cta và color: inherit trên thẻ <a>. */
const heroPrimaryCtaClassName =
    "inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border-0 px-8 text-base font-medium whitespace-nowrap no-underline outline-none select-none transition-[box-shadow,filter] duration-200 sm:w-auto min-h-12 h-12 cursor-pointer bg-gradient-brand-cta !text-white shadow-brand-cta hover:shadow-lg hover:brightness-105 focus-visible:ring-2 focus-visible:ring-brand-2/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px";
import type { Banner } from "@/lib/types";
import { motion, useReducedMotion } from "framer-motion";
import { DotPattern } from "@/components/ui/backgrounds";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

// ── Icon pool ───────────────────────────────────────────────────────────
const RAIN_ICONS = [
    Shirt,
    ShoppingBag,
    Wand2,
    Scissors,
    Glasses,
    Watch,
    CreditCard,
    QrCode,
    Wallet,
    Gem,
    Sparkles,
    Banknote,
    SmartphoneNfc,
];

const FLOATING_ICONS_CONFIG = [
    {
        icon: Shirt,
        size: 32,
        top: "20%",
        left: "12%",
        delay: 0,
        ring: "border-brand-2/35 text-brand-1 dark:text-brand-2",
    },
    {
        icon: ShoppingBag,
        size: 40,
        top: "15%",
        left: "75%",
        delay: 0.1,
        ring: "border-brand-3/35 text-brand-1 dark:text-brand-3",
    },
    {
        icon: Wand2,
        size: 36,
        top: "65%",
        left: "10%",
        delay: 0.2,
        ring: "border-brand-2/40 text-brand-2",
    },
    {
        icon: Scissors,
        size: 28,
        top: "70%",
        left: "82%",
        delay: 0.15,
        ring: "border-brand-1/35 text-brand-1",
    },
    {
        icon: Glasses,
        size: 44,
        top: "45%",
        left: "85%",
        delay: 0.25,
        ring: "border-brand-2/30 text-brand-3 dark:text-brand-2",
    },
    {
        icon: Watch,
        size: 30,
        top: "50%",
        left: "5%",
        delay: 0.05,
        ring: "border-brand-3/35 text-brand-1 dark:text-brand-3",
    },
] as const;

// ── Rain particle type ──────────────────────────────────────────────────
type RainParticle = {
    id: number;
    leftValue: string; // "50%" or "150px"
    topValue: string; // "-40px" or "250px"
    size: number; // icon size
    duration: number; // fall duration in seconds
    delay: number; // animation delay
    driftX: number; // horizontal drift during fall
    rotate: number; // end rotation
    iconIndex: number; // index into RAIN_ICONS
    opacity: number; // starting opacity
    /** Trail theo chuột: spawn dưới con trỏ + animation chậm/mượt hơn */
    cursorTrail?: boolean;
};

interface HeroBannerProps {
    banners: Banner[];
}

// ── Floating Icons with cursor parallax ─────────────────────────────────
const FloatingIconsOverlay = memo(function FloatingIconsOverlay({
    offsetX,
    offsetY,
    visible,
}: {
    offsetX: number;
    offsetY: number;
    visible: boolean;
}) {
    return (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            {FLOATING_ICONS_CONFIG.map((item, idx) => {
                const Icon = item.icon;
                const shiftX = offsetX * (0.03 + idx * 0.01);
                const shiftY = offsetY * (0.03 + idx * 0.01);

                return (
                    <div
                        key={idx}
                        className={cn(
                            "absolute flex items-center justify-center bg-background/70 dark:bg-background/50 backdrop-blur-xl p-4 rounded-3xl border shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.06)]",
                            item.ring,
                        )}
                        style={{
                            top: item.top,
                            left: item.left,
                            opacity: visible ? 1 : 0,
                            transform: `translate3d(${shiftX}px, ${shiftY}px, 0) rotate(${shiftX * 0.08}deg) scale(${visible ? 1 : 0.5})`,
                            transition: `opacity 0.4s ease ${item.delay}s, transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                            willChange: "transform, opacity",
                        }}
                    >
                        <Icon size={item.size} strokeWidth={1.5} />
                    </div>
                );
            })}
        </div>
    );
});

// ── Single rain particle element (CSS animated) ─────────────────────────
const RainParticleElement = memo(function RainParticleElement({
    particle,
    onDone,
}: {
    particle: RainParticle;
    onDone: (id: number) => void;
}) {
    const Icon = RAIN_ICONS[particle.iconIndex];

    return (
        <div
            className={cn(
                "hero-rain-particle absolute text-brand-2",
                particle.cursorTrail && "hero-rain-particle--cursor",
            )}
            style={
                {
                    left: particle.leftValue,
                    top: particle.topValue,
                    "--rain-drift": `${particle.driftX}px`,
                    "--rain-rotate": `${particle.rotate}deg`,
                    "--rain-duration": `${particle.duration}s`,
                    "--rain-delay": `${particle.delay}s`,
                    "--rain-opacity": particle.opacity,
                } as React.CSSProperties
            }
            onAnimationEnd={() => onDone(particle.id)}
        >
            <Icon size={particle.size} strokeWidth={1.5} />
        </div>
    );
});

// ── Rain overlay container ──────────────────────────────────────────────
function IconRainOverlay({
    particles,
    onParticleDone,
}: {
    particles: RainParticle[];
    onParticleDone: (id: number) => void;
}) {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
                <RainParticleElement
                    key={p.id}
                    particle={p}
                    onDone={onParticleDone}
                />
            ))}
        </div>
    );
}

// ── Main Component ──────────────────────────────────────────────────────
const DEFAULT_SUBTITLE =
    "Khám phá phong cách của riêng bạn cùng trợ lý thời trang AI và thanh toán tiện lợi qua VNPay.";

export default function HeroBanner({ banners }: HeroBannerProps) {
    const reduceMotion = useReducedMotion();
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [rainParticles, setRainParticles] = useState<RainParticle[]>([]);

    const hero = useMemo(() => {
        const b = banners[0];
        if (!b) {
            return {
                imageUrl: null as string | null,
                title: null as string | null,
                subtitle: null as string | null,
                primaryHref: "/products" as string,
                imageAlt: "",
            };
        }
        const title = b.title?.trim() || null;
        const subtitle = b.subtitle?.trim() || null;
        const link = b.link_url?.trim() || "/products";
        const imageUrl = b.image_url?.trim() || null;
        return {
            imageUrl,
            title,
            subtitle,
            primaryHref: link || "/products",
            imageAlt: title ? `Banner: ${title}` : `Banner ${SITE_NAME}`,
        };
    }, [banners]);

    const particleIdRef = useRef(0);
    const lastSpawnPos = useRef({ x: -1000, y: -1000 });
    const lastSpawnTime = useRef(0);

    const spawnParticle = useCallback((x: number, y: number) => {
        const id = particleIdRef.current++;
        const iconIndex = Math.floor(Math.random() * RAIN_ICONS.length);

        // Jitter ngang/dọc nhẹ để các icon không chồng một cột khi di chuột chậm
        const jitterX = (Math.random() - 0.5) * 28;
        const jitterY = 6 + Math.random() * 18;
        const leftValue = `${x + jitterX}px`;
        const topValue = `${y + jitterY}px`;

        const size = 18 + Math.random() * 12;
        const duration = 7 + Math.random() * 5;
        const driftX = (Math.random() - 0.5) * 36;
        const rotate = (Math.random() - 0.5) * 85;
        const opacity = 0.42 + Math.random() * 0.2;

        setRainParticles((prev) => {
            const next = prev.length >= 40 ? prev.slice(-39) : prev;
            return [
                ...next,
                {
                    id,
                    leftValue,
                    topValue,
                    size,
                    duration,
                    delay: 0,
                    driftX,
                    rotate,
                    iconIndex,
                    opacity,
                    cursorTrail: true,
                },
            ];
        });
    }, []);

    // Tránh tồn đọng icon khi chuyển tab / ẩn trang lâu
    useEffect(() => {
        const onVisibility = () => {
            if (document.hidden) setRainParticles([]);
        };
        document.addEventListener("visibilitychange", onVisibility);
        return () =>
            document.removeEventListener("visibilitychange", onVisibility);
    }, []);

    const handleParticleDone = useCallback((id: number) => {
        setRainParticles((prev) => prev.filter((p) => p.id !== id));
    }, []);

    // ── Mouse parallax & mouse rain trail ───────────────────────────────
    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const rawX = e.clientX - rect.left;
            const rawY = e.clientY - rect.top;

            setMouseOffset({
                x: rawX - rect.width / 2,
                y: rawY - rect.height / 2,
            });

            // Calculate distance from last particle spawned by mouse
            const now = Date.now();
            const dist = Math.hypot(
                rawX - lastSpawnPos.current.x,
                rawY - lastSpawnPos.current.y,
            );

            // Spawn thưa: cần di chuyển đủ xa (~56px) hoặc đợi lâu hơn khi lướt chậm
            const movedFar = dist > 56;
            const slowPulse =
                now - lastSpawnTime.current > 240 && dist > 14;
            if (!reduceMotion && (movedFar || slowPulse)) {
                lastSpawnPos.current = { x: rawX, y: rawY };
                lastSpawnTime.current = now;
                spawnParticle(rawX, rawY);
            }
        },
        [spawnParticle, reduceMotion],
    );

    return (
        <section
            aria-labelledby="hero-heading"
            className="relative flex min-h-[max(80vh,32rem)] items-center justify-center overflow-x-hidden bg-background py-10 sm:py-12 md:py-14"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setMouseOffset({ x: 0, y: 0 });
                setRainParticles([]);
            }}
        >
            {hero.imageUrl ? (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={hero.imageUrl}
                        alt={hero.imageAlt}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                    <div
                        className="absolute inset-0 bg-linear-to-t from-background via-background/82 to-background/55 dark:from-background dark:via-background/88 dark:to-background/70"
                        aria-hidden
                    />
                    <div
                        className="absolute inset-0 bg-brand-mesh-diagonal opacity-[0.18] dark:opacity-[0.12] mix-blend-soft-light"
                        aria-hidden
                    />
                </div>
            ) : (
                <>
                    <div
                        className="absolute inset-0 bg-brand-mesh-diagonal"
                        aria-hidden
                    />
                    <div
                        className="absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl motion-safe:animate-pulse bg-gradient-brand-cta opacity-[0.12] dark:opacity-[0.14]"
                        style={{ animationDuration: "6s" }}
                        aria-hidden
                    />
                    <div
                        className="absolute -bottom-40 -left-20 h-[26rem] w-[26rem] rounded-full blur-3xl motion-safe:animate-pulse bg-[color-mix(in_oklch,var(--brand-soft-2)_65%,transparent)] dark:bg-[color-mix(in_oklch,var(--brand-cta-1)_22%,transparent)]"
                        style={{ animationDuration: "8s" }}
                        aria-hidden
                    />
                    <div
                        className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[4rem] bg-[color-mix(in_oklch,var(--brand-soft-3)_55%,transparent)] dark:bg-[color-mix(in_oklch,var(--brand-cta-3)_18%,transparent)]"
                        aria-hidden
                    />
                </>
            )}
            <DotPattern
                className={cn(
                    "absolute inset-0 z-[1] fill-brand-2/22 dark:fill-brand-2/14",
                    hero.imageUrl ? "opacity-25 md:opacity-35" : "opacity-40 md:opacity-50",
                )}
            />
            <div
                className="absolute inset-0 z-[1] bg-linear-to-t from-background via-transparent to-background/80"
                aria-hidden
            />

            {/* Icon trail theo con trỏ (không mưa nền tự động) */}
            {!reduceMotion && (
                <IconRainOverlay
                    particles={rainParticles}
                    onParticleDone={handleParticleDone}
                />
            )}

            {/* Floating icons with cursor parallax */}
            <FloatingIconsOverlay
                offsetX={reduceMotion ? 0 : mouseOffset.x}
                offsetY={reduceMotion ? 0 : mouseOffset.y}
                visible={reduceMotion ? true : isHovered}
            />

            {/* ── Centered Hero Content ─────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0.2 : 0.8 }}
                className="relative z-30 text-center space-y-6 px-4 max-w-3xl mx-auto"
            >
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-2/40 bg-white/80 px-4 py-1.5 text-sm font-medium text-brand-1 shadow-sm backdrop-blur-md transition-colors hover:bg-white/92 dark:border-brand-2/40 dark:bg-brand-soft-1/60 dark:text-brand-2 dark:hover:bg-brand-soft-1/78">
                    <Sparkles
                        className="h-4 w-4 shrink-0 text-brand-3"
                        aria-hidden
                    />
                    <span>
                        {SITE_NAME}
                        <span className="text-muted-foreground font-normal">
                            {" "}
                            · AI &amp; VNPay
                        </span>
                    </span>
                </div>
                <h1
                    id="hero-heading"
                    className="heading-section-vi text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-normal md:tracking-tight text-balance leading-[1.45] md:leading-[1.35] text-foreground drop-shadow-[0_1px_12px_color-mix(in_oklch,var(--background)_65%,transparent)]"
                >
                    {hero.title ? (
                        <span className="heading-gradient-vi text-gradient-brand">
                            {hero.title}
                        </span>
                    ) : (
                        <>
                            <span className="heading-gradient-vi text-gradient-brand">
                                Thời trang AI
                            </span>
                            <br className="hidden sm:block" />
                            <span className="text-foreground">Đẳng cấp mới</span>
                        </>
                    )}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-[1.65] md:leading-relaxed">
                    {hero.subtitle ?? DEFAULT_SUBTITLE}
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2">
                    <Link
                        href={hero.primaryHref}
                        className={heroPrimaryCtaClassName}
                    >
                        Khám phá ngay
                    </Link>
                    <Link
                        href="/search"
                        className={cn(
                            buttonVariants({ size: "lg", variant: "outline" }),
                            "w-full sm:w-auto rounded-full min-h-12 h-12 text-base border-brand-2/45 bg-white/70 backdrop-blur-sm hover:bg-white/92 dark:border-brand-2/40 dark:bg-background/45 dark:hover:bg-background/72 focus-visible:ring-2 focus-visible:ring-brand-2/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer no-underline",
                        )}
                    >
                        Tìm kiếm thông minh
                    </Link>
                </div>
                <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-slate-600 dark:text-slate-400 pt-1">
                    <ShieldCheck
                        className="h-4 w-4 shrink-0 text-brand-2"
                        aria-hidden
                    />
                    <span>Thanh toán an toàn qua VNPay</span>
                    <span className="hidden sm:inline text-muted-foreground">
                        ·
                    </span>
                    <span className="inline-flex gap-1 items-center">
                        <CreditCard className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="sr-only">Hỗ trợ </span>
                        QR &amp; ví điện tử
                    </span>
                </p>
            </motion.div>
        </section>
    );
}
