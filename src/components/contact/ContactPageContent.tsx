"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
    ChevronRight,
    Clock,
    Headphones,
    Mail,
    MapPin,
    MessageSquare,
    Package,
    Phone,
    Ruler,
    ShieldCheck,
} from "lucide-react";
import { DotPattern } from "@/components/ui/backgrounds";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SITE_CONTACT, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* ── Inline brand icons (not available in lucide) ── */

function ZaloIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="currentColor"
            className={className}
            aria-hidden
        >
            <path d="M12.5 7C9.46 7 7 9.46 7 12.5v23C7 38.54 9.46 41 12.5 41h23c3.04 0 5.5-2.46 5.5-5.5v-23C41 9.46 38.54 7 35.5 7h-23zm2.87 8h17.26c.73 0 1.34.52 1.37 1.2.02.48-.25.92-.68 1.14l-.07.04-10.47 6.2h8.72c.88 0 1.6.72 1.6 1.6 0 .85-.66 1.54-1.5 1.6h-13.2c-.94 0-1.7-.67-1.74-1.52-.02-.5.22-.96.62-1.24L28.14 18h-8.77v-.03h-4c-.88 0-1.6-.72-1.6-1.6 0-.85.66-1.54 1.5-1.6h.1zm-1.37 16c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm8 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm8 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" />
        </svg>
    );
}

function FacebookIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden
        >
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
    );
}

/* ── Animation helpers ── */

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
};

const contactChannels = [
    {
        icon: Phone,
        customIcon: null,
        title: "Hotline",
        detail: SITE_CONTACT.hotline,
        href: `tel:${SITE_CONTACT.hotline.replace(/\s/g, "")}`,
        action: "Gọi ngay",
        external: false,
    },
    {
        icon: null,
        customIcon: ZaloIcon,
        title: "Zalo",
        detail: SITE_CONTACT.zalo,
        href: `https://zalo.me/${SITE_CONTACT.zalo}`,
        action: "Nhắn Zalo",
        external: true,
    },
    {
        icon: null,
        customIcon: FacebookIcon,
        title: "Fanpage Facebook",
        detail: "LUXE Fashion",
        href: SITE_CONTACT.facebook,
        action: "Xem Fanpage",
        external: true,
    },
    {
        icon: Mail,
        customIcon: null,
        title: "Email",
        detail: SITE_CONTACT.email,
        href: `mailto:${SITE_CONTACT.email}`,
        action: "Gửi email",
        external: true,
    },
    {
        icon: MapPin,
        customIcon: null,
        title: "Địa chỉ",
        detail: SITE_CONTACT.address,
        href: SITE_CONTACT.mapQueryUrl,
        action: "Mở bản đồ",
        external: true,
    },
    {
        icon: Clock,
        customIcon: null,
        title: "Giờ làm việc",
        detail: SITE_CONTACT.hours,
        href: null,
        action: null,
        external: false,
    },
] as const;

const quickHelp = [
    {
        icon: Package,
        title: "Đơn hàng & vận chuyển",
        desc: "Theo dõi đơn, đổi địa chỉ, thời gian giao.",
    },
    {
        icon: Ruler,
        title: "Tư vấn size & phối đồ",
        desc: "Gợi ý form dáng và bảng size theo từng mẫu.",
    },
    {
        icon: ShieldCheck,
        title: "Đổi trả & bảo hành",
        desc: "Quy trình trong 7 ngày, hàng nguyên tem nhãn.",
    },
];

export default function ContactPageContent() {
    const reduceMotion = useReducedMotion();
    const transition = reduceMotion
        ? { duration: 0.01 }
        : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-border/40 bg-muted/30">
                <DotPattern
                    width={20}
                    height={20}
                    cx={1}
                    cy={1}
                    cr={1.5}
                    className="absolute inset-0 opacity-40 mask-[radial-gradient(500px_circle_at_center,white,transparent)]"
                />
                <div className="container relative z-10 mx-auto px-4 py-10 md:py-14 lg:py-16">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-8 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
                    >
                        <Link
                            href="/"
                            className="cursor-pointer transition-colors hover:text-primary"
                        >
                            Trang chủ
                        </Link>
                        <ChevronRight
                            className="h-4 w-4 shrink-0 opacity-60"
                            aria-hidden
                        />
                        <span className="font-medium text-foreground">
                            Liên hệ
                        </span>
                    </nav>

                    <motion.div
                        initial={
                            reduceMotion
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 16 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={reduceMotion ? { duration: 0 } : { duration: 0.5 }}
                        className="mx-auto max-w-3xl text-center"
                    >
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary shadow-sm">
                            <Headphones className="h-4 w-4" aria-hidden />
                            <span>Chăm sóc khách hàng</span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                            Liên hệ{" "}
                            <span className="heading-gradient-vi text-gradient-brand">
                                {SITE_NAME}
                            </span>
                        </h1>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                            Đội ngũ của chúng tôi phản hồi trong giờ làm việc — ưu
                            tiên hỗ trợ đơn hàng, thanh toán VNPay và tư vấn sản
                            phẩm. Hãy để lại tin nhắn, chúng tôi sẽ liên hệ lại sớm
                            nhất.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Quick help */}
            <section className="border-b border-border/50 bg-background py-10 md:py-12">
                <div className="container mx-auto px-4">
                    <div className="grid gap-4 md:grid-cols-3 md:gap-6">
                        {quickHelp.map((item, i) => (
                            <motion.div
                                key={item.title}
                                {...fadeUp}
                                transition={{ ...transition, delay: reduceMotion ? 0 : i * 0.06 }}
                                className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none md:p-6"
                            >
                                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                                    <item.icon
                                        className="h-5 w-5 text-primary"
                                        aria-hidden
                                    />
                                </div>
                                <h2 className="text-base font-semibold tracking-tight text-foreground">
                                    {item.title}
                                </h2>
                                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact channels grid */}
            <section className="border-b border-border/50 py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        {...fadeUp}
                        transition={transition}
                        className="mb-8 text-center"
                    >
                        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                            Kênh liên hệ
                        </h2>
                        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                            Gọi hotline / nhắn Zalo để xử lý nhanh đơn hàng,
                            hoặc inbox Fanpage và email cho yêu cầu chi tiết
                            kèm hình ảnh.
                        </p>
                    </motion.div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {contactChannels.map((item, i) => {
                            const IconComponent = item.icon;
                            const CustomIconComponent = item.customIcon;

                            return (
                                <motion.div
                                    key={item.title}
                                    {...fadeUp}
                                    transition={{ ...transition, delay: reduceMotion ? 0 : i * 0.05 }}
                                >
                                    <Card className="h-full overflow-hidden rounded-2xl border-border/70 shadow-sm transition-[box-shadow,background-color] duration-200 hover:bg-muted/40 hover:shadow-md motion-reduce:transition-none">
                                        <CardContent className="flex gap-4 p-4 md:p-5">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                                {IconComponent ? (
                                                    <IconComponent
                                                        className="h-5 w-5 text-primary"
                                                        aria-hidden
                                                    />
                                                ) : CustomIconComponent ? (
                                                    <CustomIconComponent className="h-5 w-5 text-primary" />
                                                ) : null}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    {item.title}
                                                </p>
                                                <p className="mt-1 truncate text-sm font-medium text-foreground">
                                                    {item.detail}
                                                </p>
                                                {item.href && item.action ? (
                                                    <a
                                                        href={item.href}
                                                        {...(item.external
                                                            ? {
                                                                  target: "_blank",
                                                                  rel: "noopener noreferrer",
                                                              }
                                                            : {})}
                                                        className={cn(
                                                            "mt-2 inline-flex cursor-pointer items-center text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline",
                                                        )}
                                                    >
                                                        {item.action}
                                                    </a>
                                                ) : null}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact form */}
            <section className="py-12 md:py-16 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-12 lg:gap-12">
                        {/* Tip sidebar */}
                        <motion.div
                            {...fadeUp}
                            transition={transition}
                            className="flex flex-col gap-5 lg:col-span-4"
                        >
                            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 p-5">
                                <div className="flex gap-3">
                                    <MessageSquare
                                        className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                                        aria-hidden
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            Gợi ý trước khi gửi
                                        </p>
                                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                            Kèm mã đơn hàng (nếu có), ảnh chụp sản
                                            phẩm và mô tả ngắn để chúng tôi xử lý
                                            đúng một lần.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden rounded-2xl border border-border/60 bg-card/80 p-5 lg:block">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Thời gian phản hồi
                                </p>
                                <p className="mt-2 text-2xl font-bold text-foreground">
                                    &lt; 24 giờ
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    trong giờ làm việc
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            {...fadeUp}
                            transition={transition}
                            className="lg:col-span-8"
                        >
                            <Card className="rounded-2xl border-border/70 shadow-md">
                                <CardHeader className="space-y-1 pb-2">
                                    <CardTitle className="text-xl md:text-2xl">
                                        Gửi tin nhắn
                                    </CardTitle>
                                    <CardDescription className="text-base leading-relaxed">
                                        Điền thông tin bên dưới — chúng tôi thường
                                        phản hồi trong{" "}
                                        <span className="font-medium text-foreground">
                                            24 giờ
                                        </span>{" "}
                                        làm việc.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Separator className="mb-6" />
                                    <form
                                        className="space-y-5"
                                        noValidate
                                        onSubmit={(e) => e.preventDefault()}
                                    >
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="contact-name">
                                                    Họ và tên
                                                </Label>
                                                <Input
                                                    id="contact-name"
                                                    name="name"
                                                    type="text"
                                                    autoComplete="name"
                                                    placeholder="Nguyễn Văn A"
                                                    className="transition-shadow duration-200"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="contact-email">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="contact-email"
                                                    name="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    inputMode="email"
                                                    placeholder="ban@email.com"
                                                    className="transition-shadow duration-200"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact-subject">
                                                Chủ đề
                                            </Label>
                                            <Input
                                                id="contact-subject"
                                                name="subject"
                                                type="text"
                                                autoComplete="off"
                                                placeholder="Ví dụ: Hỗ trợ đơn hàng #123, tư vấn size..."
                                                className="transition-shadow duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact-message">
                                                Nội dung
                                            </Label>
                                            <Textarea
                                                id="contact-message"
                                                name="message"
                                                rows={6}
                                                placeholder="Mô tả chi tiết — mã đơn, sản phẩm, size mong muốn..."
                                                className="min-h-[140px] resize-y transition-shadow duration-200"
                                                aria-describedby="contact-message-hint"
                                            />
                                            <p
                                                id="contact-message-hint"
                                                className="text-xs text-muted-foreground"
                                            >
                                                Thông tin bạn gửi chỉ dùng để hỗ trợ,
                                                không chia sẻ cho bên thứ ba.
                                            </p>
                                        </div>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full cursor-pointer transition-opacity duration-200 hover:opacity-95 sm:w-auto sm:min-w-[200px]"
                                        >
                                            Gửi tin nhắn
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
