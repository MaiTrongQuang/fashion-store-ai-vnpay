"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronLeft,
    ChevronRight,
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

const TRAIL_ICONS = [
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

type Particle = {
    id: number;
    x: number;
    y: number;
    driftX: number;
    fallY: number;
    rotate: number;
    Icon: React.ElementType;
};

import { Button } from "@/components/ui/button";
import type { Banner } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { DotPattern } from "@/components/ui/backgrounds";

interface HeroBannerProps {
    banners: Banner[];
}

const FLOATING_ICONS = [
    {
        icon: Shirt,
        size: 32,
        top: "20%",
        left: "12%",
        stiffness: 45,
        damping: 15,
    },
    {
        icon: ShoppingBag,
        size: 40,
        top: "15%",
        left: "75%",
        stiffness: 35,
        damping: 12,
    },
    {
        icon: Wand2,
        size: 36,
        top: "65%",
        left: "10%",
        stiffness: 55,
        damping: 20,
    },
    {
        icon: Scissors,
        size: 28,
        top: "70%",
        left: "82%",
        stiffness: 40,
        damping: 18,
    },
    {
        icon: Glasses,
        size: 44,
        top: "45%",
        left: "85%",
        stiffness: 60,
        damping: 22,
    },
    {
        icon: Watch,
        size: 30,
        top: "50%",
        left: "5%",
        stiffness: 30,
        damping: 10,
    },
];

function FloatingIconsOverlay({
    mousePos,
    isHovered,
}: {
    mousePos: { x: number; y: number };
    isHovered: boolean;
}) {
    return (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            <AnimatePresence>
                {isHovered &&
                    FLOATING_ICONS.map((item, idx) => {
                        const Icon = item.icon;
                        // Scale parallax shift dynamically
                        const shiftX = mousePos.x * (0.05 + idx * 0.015);
                        const shiftY = mousePos.y * (0.05 + idx * 0.015);

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.2, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: shiftY,
                                    x: shiftX,
                                    rotate: shiftX * 0.1,
                                }}
                                exit={{ opacity: 0, scale: 0.5, y: -20 }}
                                transition={{
                                    opacity: { duration: 0.3 },
                                    scale: {
                                        duration: 0.5,
                                        type: "spring",
                                        bounce: 0.4,
                                    },
                                    x: {
                                        type: "spring",
                                        stiffness: item.stiffness,
                                        damping: item.damping,
                                    },
                                    y: {
                                        type: "spring",
                                        stiffness: item.stiffness,
                                        damping: item.damping,
                                    },
                                    rotate: {
                                        type: "spring",
                                        stiffness: item.stiffness,
                                        damping: item.damping,
                                    },
                                }}
                                className="absolute flex items-center justify-center bg-background/40 backdrop-blur-xl p-4 rounded-3xl border border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] text-primary"
                                style={{ top: item.top, left: item.left }}
                            >
                                <Icon size={item.size} strokeWidth={1.5} />
                            </motion.div>
                        );
                    })}
            </AnimatePresence>
        </div>
    );
}

function CursorTrailOverlay({ particles }: { particles: Particle[] }) {
    return (
        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
            <AnimatePresence>
                {particles.map((p) => {
                    const Icon = p.Icon;
                    return (
                        <motion.div
                            key={p.id}
                            initial={{
                                opacity: 0.8,
                                scale: 0.2,
                                x: p.x,
                                y: p.y,
                                rotate: 0,
                            }}
                            animate={{
                                opacity: 0,
                                scale: 1.5,
                                x: p.x + p.driftX,
                                y: p.y + p.fallY,
                                rotate: p.rotate,
                            }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="absolute text-primary filter drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]"
                            style={{ left: -12, top: -12 }}
                        >
                            <Icon size={24} strokeWidth={1.5} />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}

export default function HeroBanner({ banners }: HeroBannerProps) {
    const [current, setCurrent] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const particleIdCounter = useRef(0);
    const lastParticleTime = useRef(0);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMousePos({
            x: x - rect.width / 2,
            y: y - rect.height / 2,
        });

        const now = Date.now();
        if (now - lastParticleTime.current > 50) {
            lastParticleTime.current = now;
            const id = particleIdCounter.current++;
            const Icon =
                TRAIL_ICONS[Math.floor(Math.random() * TRAIL_ICONS.length)];
            const driftX = (Math.random() - 0.5) * 150;
            const fallY = 100 + Math.random() * 200;
            const rotate = (Math.random() - 0.5) * 360;

            setParticles((prev) => [
                ...prev.slice(-25),
                { id, x, y, driftX, fallY, rotate, Icon },
            ]);

            setTimeout(() => {
                setParticles((prev) => prev.filter((p) => p.id !== id));
            }, 1200);
        }
    }, []);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
    }, [banners.length]);

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
    }, [banners.length]);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(next, 7000);
        return () => clearInterval(timer);
    }, [next, banners.length]);

    // Fallback if no banners
    if (banners.length === 0) {
        return (
            <section
                className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-background"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setMousePos({ x: 0, y: 0 });
                }}
            >
                <FloatingIconsOverlay
                    mousePos={mousePos}
                    isHovered={isHovered}
                />
                <CursorTrailOverlay particles={particles} />
                <DotPattern className="absolute inset-0 opacity-50" />
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center space-y-6 px-4"
                >
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-4 backdrop-blur-sm shadow-sm transition-colors hover:bg-primary/10">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Trải nghiệm Fashion Store AI VNPay
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Thời trang AI
                        </span>
                        <br className="hidden md:block" />
                        <span className="text-foreground">Đẳng cấp mới</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Khám phá phong cách của riêng bạn cùng công nghệ trợ lý
                        thời trang thông minh.
                    </p>
                    <Link href="/products">
                        <Button
                            size="lg"
                            className="mt-4 rounded-full px-8 h-12 text-md transition-all hover:scale-105 shadow-lg hover:shadow-primary/25"
                        >
                            Khám Phá Ngay
                        </Button>
                    </Link>
                </motion.div>
            </section>
        );
    }

    return (
        <section
            className="relative h-[70vh] md:h-[85vh] overflow-hidden group bg-background"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setMousePos({ x: 0, y: 0 });
            }}
        >
            <FloatingIconsOverlay mousePos={mousePos} isHovered={isHovered} />
            <CursorTrailOverlay particles={particles} />
            <AnimatePresence mode="sync">
                {banners.map(
                    (banner, index) =>
                        index === current && (
                            <motion.div
                                key={banner.id}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 1.2,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={banner.image_url}
                                    alt={banner.title}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    sizes="100vw"
                                />
                                {/* Modern gradient overlay for AI vibe */}
                                <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/40 to-transparent" />
                                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />

                                {/* Background Pattern Masked Over the Image */}
                                <DotPattern className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" />

                                <div className="absolute inset-0 flex items-center md:items-end pb-20 md:pb-32">
                                    <div className="container mx-auto px-6 md:px-12 relative z-10">
                                        <div className="max-w-2xl space-y-6">
                                            <motion.div
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.8,
                                                    delay: 0.3,
                                                }}
                                            >
                                                <div className="inline-flex items-center rounded-full border border-primary/30 bg-background/50 backdrop-blur-md px-3 py-1 text-sm text-primary mb-4 shadow-sm hover:bg-background/70 transition-colors">
                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                    Bộ sưu tập mới nhất
                                                </div>
                                                <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight drop-shadow-md">
                                                    {banner.title}
                                                </h2>
                                            </motion.div>

                                            {banner.subtitle && (
                                                <motion.p
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.8,
                                                        delay: 0.5,
                                                    }}
                                                    className="text-lg md:text-2xl text-muted-foreground drop-shadow-sm font-medium"
                                                >
                                                    {banner.subtitle}
                                                </motion.p>
                                            )}
                                            {banner.link_url && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.8,
                                                        delay: 0.7,
                                                    }}
                                                >
                                                    <Link
                                                        href={banner.link_url}
                                                    >
                                                        <Button
                                                            size="lg"
                                                            className="mt-2 rounded-full px-8 h-12 text-md shadow-xl transition-all hover:scale-105 hover:shadow-primary/25"
                                                        >
                                                            Xem Cửa Hàng →
                                                        </Button>
                                                    </Link>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ),
                )}
            </AnimatePresence>

            {/* Navigation arrows with glassmorphism */}
            {banners.length > 1 && (
                <>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={prev}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-background/30 hover:bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md border-primary/20 z-30"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={next}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-background/30 hover:bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md border-primary/20 z-30"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>

                    {/* Interactive Dots */}
                    <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${
                                    index === current
                                        ? "w-10 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                        : "w-2.5 bg-primary/30 hover:bg-primary/60"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
