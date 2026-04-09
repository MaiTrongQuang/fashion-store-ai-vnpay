"use client";

import { useState, useCallback, useRef, useEffect, memo } from "react";
import Link from "next/link";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Banner } from "@/lib/types";
import { motion, useReducedMotion } from "framer-motion";
import { DotPattern } from "@/components/ui/backgrounds";
import { cn } from "@/lib/utils";

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
        ring: "border-rose-400/35 text-rose-600 dark:text-rose-300",
    },
    {
        icon: ShoppingBag,
        size: 40,
        top: "15%",
        left: "75%",
        delay: 0.1,
        ring: "border-violet-400/35 text-violet-600 dark:text-violet-300",
    },
    {
        icon: Wand2,
        size: 36,
        top: "65%",
        left: "10%",
        delay: 0.2,
        ring: "border-amber-400/40 text-amber-700 dark:text-amber-300",
    },
    {
        icon: Scissors,
        size: 28,
        top: "70%",
        left: "82%",
        delay: 0.15,
        ring: "border-sky-400/35 text-sky-600 dark:text-sky-300",
    },
    {
        icon: Glasses,
        size: 44,
        top: "45%",
        left: "85%",
        delay: 0.25,
        ring: "border-fuchsia-400/30 text-fuchsia-600 dark:text-fuchsia-300",
    },
    {
        icon: Watch,
        size: 30,
        top: "50%",
        left: "5%",
        delay: 0.05,
        ring: "border-teal-400/35 text-teal-600 dark:text-teal-300",
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
                "hero-rain-particle absolute text-violet-600 dark:text-violet-300",
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function HeroBanner({ banners: _banners }: HeroBannerProps) {
    const reduceMotion = useReducedMotion();
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [rainParticles, setRainParticles] = useState<RainParticle[]>([]);

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
            className="relative h-[80vh] min-h-[32rem] flex items-center justify-center overflow-hidden bg-background"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setMouseOffset({ x: 0, y: 0 });
                setRainParticles([]);
            }}
        >
            {/* Chromatic mesh + depth */}
            <div
                className="absolute inset-0 bg-linear-to-br from-rose-50/90 via-background to-violet-100/50 dark:from-rose-950/25 dark:via-background dark:to-violet-950/30"
                aria-hidden
            />
            <div
                className="absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-linear-to-br from-amber-200/50 to-rose-300/35 blur-3xl motion-safe:animate-pulse dark:from-amber-500/15 dark:to-rose-600/10"
                style={{ animationDuration: "6s" }}
                aria-hidden
            />
            <div
                className="absolute -bottom-40 -left-20 h-[26rem] w-[26rem] rounded-full bg-linear-to-tr from-violet-200/45 to-sky-200/35 blur-3xl motion-safe:animate-pulse dark:from-violet-600/12 dark:to-sky-500/10"
                style={{ animationDuration: "8s" }}
                aria-hidden
            />
            <div
                className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-200/20 blur-[4rem] dark:bg-fuchsia-500/10"
                aria-hidden
            />
            {/* Background should be first to stay behind icons */}
            <DotPattern className="absolute inset-0 opacity-40 md:opacity-50 fill-violet-400/25 dark:fill-violet-400/15" />
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background/80" />

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
                className="relative z-10 text-center space-y-6 px-4"
            >
                <div className="inline-flex items-center rounded-full border border-violet-300/40 bg-white/70 px-3 py-1 text-sm font-medium text-violet-800 shadow-sm backdrop-blur-md transition-colors hover:bg-white/90 dark:border-violet-500/30 dark:bg-violet-950/40 dark:text-violet-100 dark:hover:bg-violet-950/60">
                    <Sparkles className="mr-2 h-4 w-4 text-amber-500 dark:text-amber-400" />
                    Trải nghiệm Fashion Store AI VNPay
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance">
                    <span className="bg-linear-to-r from-violet-600 via-fuchsia-600 to-rose-600 bg-clip-text text-transparent dark:from-violet-300 dark:via-fuchsia-300 dark:to-rose-300">
                        Thời trang AI
                    </span>
                    <br className="hidden md:block" />
                    <span className="text-foreground">Đẳng cấp mới</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Khám phá phong cách của riêng bạn cùng công nghệ trợ lý thời
                    trang thông minh.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4">
                    <Link href="/products" className="cursor-pointer w-full sm:w-auto">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto rounded-full px-8 h-12 text-md transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 shadow-lg shadow-violet-500/20 bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0"
                        >
                            Khám Phá Ngay
                        </Button>
                    </Link>
                    <Link href="/search" className="cursor-pointer w-full sm:w-auto">
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto rounded-full px-8 h-12 text-md border-violet-300/60 bg-white/60 backdrop-blur-sm hover:bg-white/90 dark:border-violet-500/40 dark:bg-background/40 dark:hover:bg-background/70"
                        >
                            Tìm Kiếm Thông Minh
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
