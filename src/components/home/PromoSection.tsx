"use client";

import { Truck, Shield, RotateCcw, Cpu } from "lucide-react";
import { GridPattern } from "@/components/ui/backgrounds";
import { motion } from "framer-motion";

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
        <section className="relative py-24 bg-primary/10 overflow-hidden">
            {/* AI Pattern Layer */}
            <GridPattern
                width={20}
                height={20}
                x={-1}
                y={-1}
                className="absolute inset-0 h-full opacity-40 mask-[linear-gradient(to_bottom,white,transparent)] stroke-primary/30"
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
                            className="relative flex flex-col items-center p-8 bg-background/50 hover:bg-background/80 backdrop-blur-xl border border-primary/20 rounded-3xl transition-all duration-500 shadow-xl group hover:-translate-y-2 hover:shadow-primary/20"
                        >
                            <div className="w-16 h-16 rounded-full bg-linear-to-tr from-primary to-primary/40 flex items-center justify-center mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                                <feature.icon className="h-8 w-8 text-primary-foreground" />
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
