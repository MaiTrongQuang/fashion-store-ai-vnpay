"use client";

import { Truck, Shield, RotateCcw, Cpu } from "lucide-react";
import { GridPattern } from "@/components/ui/backgrounds";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
    {
        icon: Cpu,
        title: "AI Trợ Lý Cá Nhân",
        description: "Gợi ý phối đồ chuẩn xác",
        ring: "border-violet-300/50 hover:border-violet-400/70 hover:shadow-violet-500/15",
        iconBg:
            "bg-linear-to-tr from-violet-600 to-fuchsia-600 shadow-violet-500/35",
        iconFg: "text-white",
    },
    {
        icon: Truck,
        title: "Giao Hàng Nhanh",
        description: "Thông tin đơn AI theo dõi",
        ring: "border-sky-300/50 hover:border-sky-400/70 hover:shadow-sky-500/15",
        iconBg: "bg-linear-to-tr from-sky-500 to-cyan-500 shadow-sky-500/30",
        iconFg: "text-white",
    },
    {
        icon: Shield,
        title: "Hàng Hiệu Cao Cấp",
        description: "Công nghệ quét Auth 100%",
        ring: "border-emerald-300/50 hover:border-emerald-400/70 hover:shadow-emerald-500/15",
        iconBg:
            "bg-linear-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/30",
        iconFg: "text-white",
    },
    {
        icon: RotateCcw,
        title: "Chính Sách Linh Hoạt",
        description: "Đổi trả tức thì 7 ngày",
        ring: "border-amber-300/55 hover:border-amber-400/75 hover:shadow-amber-500/15",
        iconBg:
            "bg-linear-to-tr from-amber-500 to-orange-500 shadow-amber-500/30",
        iconFg: "text-white",
    },
];

export default function PromoSection() {
    return (
        <section className="relative py-24 overflow-hidden bg-linear-to-br from-violet-100/50 via-background to-amber-50/40 dark:from-violet-950/30 dark:via-background dark:to-amber-950/15">
            {/* AI Pattern Layer */}
            <GridPattern
                width={20}
                height={20}
                x={-1}
                y={-1}
                className="absolute inset-0 h-full opacity-35 mask-[linear-gradient(to_bottom,white,transparent)] stroke-violet-300/35 dark:stroke-violet-500/20"
            />

            <div className="container relative mx-auto px-4 z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            key={index}
                            className={cn(
                                "relative flex flex-col items-center p-8 bg-white/75 hover:bg-white/95 dark:bg-card/60 dark:hover:bg-card/85 backdrop-blur-xl border rounded-3xl transition-[transform,box-shadow,border-color] duration-300 shadow-lg group hover:-translate-y-1 cursor-pointer",
                                feature.ring,
                            )}
                        >
                            <div
                                className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:brightness-110 transition-[filter,transform] duration-300 motion-safe:group-hover:scale-105",
                                    feature.iconBg,
                                )}
                            >
                                <feature.icon
                                    className={cn("h-8 w-8", feature.iconFg)}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-foreground/70 text-center font-medium">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
