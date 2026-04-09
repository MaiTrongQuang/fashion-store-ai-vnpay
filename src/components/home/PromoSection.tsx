"use client";

import { Truck, Shield, RotateCcw, Cpu } from "lucide-react";
import { GridPattern } from "@/components/ui/backgrounds";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const featureRing =
    "border-brand-2/40 hover:border-brand-2/60 hover:shadow-[0_12px_40px_-16px_color-mix(in_oklch,var(--brand-cta-2)_32%,transparent)]";

const features = [
    {
        icon: Cpu,
        title: "AI Trợ Lý Cá Nhân",
        description: "Gợi ý phối đồ chuẩn xác",
    },
    {
        icon: Truck,
        title: "Giao Hàng Nhanh",
        description: "Thông tin đơn AI theo dõi",
    },
    {
        icon: Shield,
        title: "Hàng Hiệu Cao Cấp",
        description: "Công nghệ quét Auth 100%",
    },
    {
        icon: RotateCcw,
        title: "Chính Sách Linh Hoạt",
        description: "Đổi trả tức thì 7 ngày",
    },
];

export default function PromoSection() {
    return (
        <section className="relative py-24 overflow-hidden bg-brand-mesh-diagonal">
            {/* AI Pattern Layer */}
            <GridPattern
                width={20}
                height={20}
                x={-1}
                y={-1}
                className="absolute inset-0 h-full opacity-35 mask-[linear-gradient(to_bottom,white,transparent)] stroke-brand-2/30 dark:stroke-brand-2/18"
            />

            <div className="container relative mx-auto px-4 z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.15,
                                }}
                                key={index}
                                className={cn(
                                    "relative flex flex-col items-center p-8 bg-white/75 hover:bg-white/95 dark:bg-card/60 dark:hover:bg-card/85 backdrop-blur-xl border rounded-3xl transition-[transform,box-shadow,border-color] duration-300 shadow-lg group hover:-translate-y-1 cursor-pointer",
                                    featureRing,
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-gradient-brand-cta shadow-brand-cta text-white group-hover:brightness-110 transition-[filter,transform] duration-300 motion-safe:group-hover:scale-105",
                                    )}
                                >
                                    <Icon className="h-8 w-8" aria-hidden />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-foreground/70 text-center font-medium">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
