"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        await new Promise((r) => setTimeout(r, 700));
        toast.success("Đăng ký thành công! Cảm ơn bạn đã quan tâm.");
        setEmail("");
        setIsSubmitting(false);
    };

    return (
        <section className="bg-neutral-950 py-12 text-white md:py-16">
            <div className="container mx-auto px-4">
                <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] md:items-center">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                            Nana Store
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                            Nhận thông tin ưu đãi và bộ sưu tập mới
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68 md:text-base">
                            Cập nhật sản phẩm mới, mã giảm giá và các đợt sale
                            nổi bật qua email.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <div className="relative min-w-0 flex-1">
                            <Mail
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                                aria-hidden
                            />
                            <Input
                                type="email"
                                placeholder="Email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 rounded-md border-white/20 bg-white pl-9 text-neutral-950 placeholder:text-neutral-500"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 rounded-md bg-white px-4 font-semibold text-neutral-950 hover:bg-white/90"
                        >
                            <Send className="h-4 w-4" aria-hidden />
                            <span className="hidden sm:inline">
                                {isSubmitting ? "Đang gửi" : "Đăng ký"}
                            </span>
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}
