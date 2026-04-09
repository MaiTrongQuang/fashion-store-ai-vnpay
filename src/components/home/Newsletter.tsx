"use client";

import { useState } from "react";
import { Mail, Send, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/backgrounds";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1000));
        toast.success("Đăng ký thành công! Cảm ơn bạn đã quan tâm.");
        setEmail("");
        setIsSubmitting(false);
    };

    return (
        <section className="relative py-24 overflow-hidden bg-linear-to-br from-fuchsia-50/70 via-violet-50/50 to-rose-50/60 dark:from-fuchsia-950/25 dark:via-violet-950/20 dark:to-rose-950/20">
            {/* Background pattern */}
            <GridPattern
                width={30}
                height={30}
                x={-1}
                y={-1}
                className="absolute inset-0 opacity-30 stroke-violet-300/30 dark:stroke-violet-500/15 mask-[radial-gradient(600px_circle_at_center,white,transparent)]"
            />

            {/* Glow effects */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-fuchsia-300/25 rounded-full blur-3xl dark:bg-fuchsia-600/12" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-rose-300/25 rounded-full blur-3xl dark:bg-rose-600/12" />

            <div className="container relative mx-auto px-4 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="inline-flex items-center space-x-2 rounded-full border border-violet-300/55 bg-white/90 px-4 py-1.5 text-sm font-medium text-violet-800 uppercase tracking-widest mb-6 shadow-sm dark:border-violet-500/35 dark:bg-violet-950/45 dark:text-violet-200">
                        <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        <span>Ưu đãi độc quyền</span>
                    </div>

                    <h2 className="heading-section-vi text-3xl md:text-5xl font-extrabold tracking-normal md:tracking-tight leading-[1.55] md:leading-[1.5] mb-4 text-foreground">
                        Đừng Bỏ Lỡ{" "}
                        <span className="heading-gradient-vi bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-300 dark:to-fuchsia-300">
                            Ưu Đãi Hấp Dẫn
                        </span>
                    </h2>

                    <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
                        Đăng ký nhận thông tin để cập nhật xu hướng mới nhất và
                        nhận mã giảm giá đặc biệt.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                    >
                        <div className="relative flex-1">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="Nhập email của bạn..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10 h-12 rounded-full bg-background border-border/50 focus-visible:ring-primary/50"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-12 px-8 rounded-full font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Đang gửi...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Send className="h-4 w-4" />
                                    Đăng Ký
                                </span>
                            )}
                        </Button>
                    </form>

                    <p className="text-xs text-muted-foreground mt-4">
                        Chúng tôi tôn trọng quyền riêng tư của bạn. Huỷ đăng ký
                        bất cứ lúc nào.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
