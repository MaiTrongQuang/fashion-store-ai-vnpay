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
import { motion } from "framer-motion";
import { DotPattern } from "@/components/ui/backgrounds";

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
    { icon: Shirt, size: 32, top: "20%", left: "12%", delay: 0 },
    { icon: ShoppingBag, size: 40, top: "15%", left: "75%", delay: 0.1 },
    { icon: Wand2, size: 36, top: "65%", left: "10%", delay: 0.2 },
    { icon: Scissors, size: 28, top: "70%", left: "82%", delay: 0.15 },
    { icon: Glasses, size: 44, top: "45%", left: "85%", delay: 0.25 },
    { icon: Watch, size: 30, top: "50%", left: "5%", delay: 0.05 },
];

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
                        className="absolute flex items-center justify-center bg-background/40 backdrop-blur-xl p-4 rounded-3xl border border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] text-primary"
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
            className="hero-rain-particle absolute text-primary"
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
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [rainParticles, setRainParticles] = useState<RainParticle[]>([]);

    const particleIdRef = useRef(0);
    const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
        null,
    );
    const lastSpawnPos = useRef({ x: -1000, y: -1000 });
    const lastSpawnTime = useRef(0);

    const spawnParticle = useCallback((x?: number, y?: number) => {
        const id = particleIdRef.current++;
        const iconIndex = Math.floor(Math.random() * RAIN_ICONS.length);

        const isMouse = x !== undefined && y !== undefined;
        // Bắt đầu rơi từ trên cùng (top: -40px) tại toạ độ X của chuột
        const leftValue = isMouse ? `${x}px` : `${Math.random() * 100}%`;
        const topValue = `-40px`;

        const size = 18 + Math.random() * 14; // 18-32px
        const duration = 2.5 + Math.random() * 3.5; // 2.5-6s fall time
        const driftX = (Math.random() - 0.5) * 60; // narrower spread when falling
        const rotate = (Math.random() - 0.5) * 180;
        const opacity = isMouse
            ? 0.3 + Math.random() * 0.4
            : 0.15 + Math.random() * 0.35;

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
                },
            ];
        });
    }, []);

    // ── Spawn rain particles at regular intervals ───────────────────────
    useEffect(() => {
        // Spawn initial batch staggered
        for (let i = 0; i < 6; i++) {
            setTimeout(() => spawnParticle(), i * 300);
        }

        // Then keep spawning background rain at a steady rate
        spawnIntervalRef.current = setInterval(() => spawnParticle(), 800);

        return () => {
            if (spawnIntervalRef.current)
                clearInterval(spawnIntervalRef.current);
        };
    }, [spawnParticle]);

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

            // Spawn a new particle from mouse if moved enough, or if some time has passed
            // This creates a nice continuous dropping trail
            if (dist > 40 || now - lastSpawnTime.current > 150) {
                lastSpawnPos.current = { x: rawX, y: rawY };
                lastSpawnTime.current = now;
                spawnParticle(rawX, rawY);
            }
        },
        [spawnParticle],
    );

    return (
        <section
            className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-background"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setMouseOffset({ x: 0, y: 0 });
            }}
        >
            {/* Background should be first to stay behind icons */}
            <DotPattern className="absolute inset-0 opacity-50" />
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background" />

            {/* Auto-rain icons falling from top */}
            <IconRainOverlay
                particles={rainParticles}
                onParticleDone={handleParticleDone}
            />

            {/* Floating icons with cursor parallax */}
            <FloatingIconsOverlay
                offsetX={mouseOffset.x}
                offsetY={mouseOffset.y}
                visible={isHovered}
            />

            {/* ── Centered Hero Content ─────────────────────────────────── */}
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
                    Khám phá phong cách của riêng bạn cùng công nghệ trợ lý thời
                    trang thông minh.
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
