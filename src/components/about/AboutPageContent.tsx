"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Award,
    Bot,
    ChevronRight,
    Cpu,
    Heart,
    Leaf,
    ShieldCheck,
    Sparkles,
    Target,
    Truck,
    Users,
    Wallet,
    Eye,
} from "lucide-react";
import { DotPattern } from "@/components/ui/backgrounds";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
};

const stats = [
    { label: "Năm hình thành", value: "2019" },
    { label: "Mẫu mã cập nhật", value: "500+" },
    { label: "Khách hàng tin dùng", value: "50K+" },
    { label: "Tỉnh thành phục vụ", value: "63+" },
];

const values = [
    {
        icon: Heart,
        title: "Tận tâm",
        desc: "Lắng nghe và đồng hành cùng bạn trong từng bước chọn đồ — từ tư vấn size đến hậu mãi.",
    },
    {
        icon: Award,
        title: "Chất lượng",
        desc: "Kiểm soát nguồn hàng, đối tác sản xuất uy tín và quy trình kiểm tra trước khi giao.",
    },
    {
        icon: Users,
        title: "Cộng đồng",
        desc: "Xây dựng không gian chia sẻ phong cách — lookbook, gợi ý phối đồ và xu hướng.",
    },
    {
        icon: Sparkles,
        title: "Đổi mới",
        desc: "Cập nhật bộ sưu tập theo mùa, tích hợp AI để gợi ý phù hợp sở thích cá nhân.",
    },
];

const milestones = [
    {
        year: "2019",
        title: "Khởi đầu",
        text: `${SITE_NAME} ra đời với cửa hàng trực tuyến đầu tiên, tập trung vào thời trang ứng dụng hằng ngày.`,
    },
    {
        year: "2021",
        title: "Mở rộng",
        text: "Hợp tác thêm thương hiệu trong nước và khu vực, hoàn thiện quy trình đóng gói và giao hàng toàn quốc.",
    },
    {
        year: "2024",
        title: "Trải nghiệm thông minh",
        text: "Ra mắt trợ lý gợi ý phối đồ, tối ưu thanh toán VNPay và chăm sóc khách hàng đa kênh — phát triển liên tục đến hiện tại.",
    },
];

const differentiators = [
    {
        icon: Cpu,
        title: "Gợi ý theo phong cách",
        desc: "Thuật toán và AI hỗ trợ gợi ý sản phẩm phù hợp túi tiền và tông màu bạn yêu thích.",
    },
    {
        icon: Wallet,
        title: "Thanh toán VNPay",
        desc: "Quét QR, thẻ nội địa và quốc tế — giao dịch được mã hóa, xác nhận tức thì.",
    },
    {
        icon: Truck,
        title: "Giao hàng & đổi trả",
        desc: "Đối tác vận chuyển tin cậy, theo dõi đơn minh bạch; hỗ trợ đổi size trong 7 ngày.",
    },
    {
        icon: ShieldCheck,
        title: "Hàng chính hãng",
        desc: "Làm việc trực tiếp với nhãn hoặc nhà phân phối, minh bạch nguồn gốc sản phẩm.",
    },
];

export default function AboutPageContent() {
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
                            className="transition-colors hover:text-primary"
                        >
                            Trang chủ
                        </Link>
                        <ChevronRight
                            className="h-4 w-4 shrink-0 opacity-60"
                            aria-hidden
                        />
                        <span className="font-medium text-foreground">
                            Về chúng tôi
                        </span>
                    </nav>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto max-w-4xl text-center"
                    >
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary shadow-sm">
                            <Leaf className="h-4 w-4" aria-hidden />
                            <span>Câu chuyện thương hiệu</span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                            Về{" "}
                            <span className="heading-gradient-vi text-gradient-brand">
                                {SITE_NAME}
                            </span>
                        </h1>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                            Chúng tôi tin phong cách là cách bạn kể câu chuyện về
                            chính mình. {SITE_NAME} kết hợp thời trang được tuyển
                            chọn, công nghệ gợi ý và dịch vụ tận tâm để mỗi lần
                            mua sắm đều trôi chảy, an tâm.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="border-b border-border/50 bg-background py-10 md:py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                        {stats.map((s, i) => (
                            <motion.div
                                key={s.label}
                                {...fadeUp}
                                transition={{ duration: 0.45, delay: i * 0.06 }}
                                className="rounded-2xl border border-border/60 bg-card/80 px-4 py-5 text-center shadow-sm backdrop-blur-sm md:px-6 md:py-6"
                            >
                                <p className="text-2xl font-extrabold tabular-nums tracking-tight text-foreground md:text-3xl">
                                    {s.value}
                                </p>
                                <p className="mt-1 text-xs font-medium text-muted-foreground md:text-sm">
                                    {s.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-14 md:py-20 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
                        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
                            <Card className="h-full overflow-hidden rounded-2xl border-border/70 shadow-sm transition-shadow duration-300 hover:shadow-md">
                                <CardContent className="p-6 md:p-8">
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                                        <Target
                                            className="h-6 w-6 text-primary"
                                            aria-hidden
                                        />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                                        Sứ mệnh
                                    </h2>
                                    <p className="mt-3 leading-relaxed text-muted-foreground">
                                        Mang đến trải nghiệm mua sắm thời trang
                                        hiện đại, dễ tiếp cận và đáng tin cậy —
                                        nơi chất lượng sản phẩm đi đôi với dịch
                                        vụ chăm sóc khách hàng chu đáo trên mọi
                                        kênh.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div
                            {...fadeUp}
                            transition={{ duration: 0.5, delay: 0.08 }}
                        >
                            <Card className="h-full overflow-hidden rounded-2xl border-border/70 shadow-sm transition-shadow duration-300 hover:shadow-md">
                                <CardContent className="p-6 md:p-8">
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                                        <Eye
                                            className="h-6 w-6 text-primary"
                                            aria-hidden
                                        />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                                        Tầm nhìn
                                    </h2>
                                    <p className="mt-3 leading-relaxed text-muted-foreground">
                                        Trở thành điểm đến quen thuộc của người
                                        yêu thời trang tại Việt Nam — nơi công
                                        nghệ hỗ trợ cá nhân hóa, và mỗi khách
                                        hàng đều cảm thấy được lắng nghe.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-muted/25 py-14 md:py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        {...fadeUp}
                        className="mx-auto mb-10 max-w-2xl text-center md:mb-14"
                    >
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                            <Sparkles className="h-3.5 w-3.5" />
                            Giá trị cốt lõi
                        </div>
                        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl lg:text-4xl">
                            Những điều chúng tôi không thỏa hiệp
                        </h2>
                        <p className="mt-3 text-muted-foreground md:text-lg">
                            Bốn trụ cột định hướng mọi quyết định — từ chọn mẫu
                            đến cách chúng tôi nói chuyện với bạn.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                        {values.map((item, i) => (
                            <motion.div
                                key={item.title}
                                {...fadeUp}
                                transition={{
                                    duration: 0.45,
                                    delay: i * 0.07,
                                }}
                            >
                                <Card className="h-full rounded-2xl border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none">
                                    <CardContent className="flex flex-col items-center p-6 text-center md:p-7">
                                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                                            <item.icon
                                                className="h-7 w-7 text-primary"
                                                aria-hidden
                                            />
                                        </div>
                                        <h3 className="text-lg font-bold">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                            {item.desc}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story timeline */}
            <section className="py-14 md:py-20 lg:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        {...fadeUp}
                        className="mx-auto mb-10 max-w-2xl text-center md:mb-14"
                    >
                        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl lg:text-4xl">
                            Hành trình phát triển
                        </h2>
                        <p className="mt-3 text-muted-foreground md:text-lg">
                            Một vài mốc quan trọng trên đường đồng hành cùng bạn.
                        </p>
                    </motion.div>

                    <div className="relative mx-auto max-w-3xl">
                        <div
                            className="absolute left-4.5 top-3 bottom-3 w-px bg-border"
                            aria-hidden
                        />
                        <ul className="space-y-10 md:space-y-12">
                            {milestones.map((m, i) => (
                                <motion.li
                                    key={m.year}
                                    {...fadeUp}
                                    transition={{
                                        duration: 0.45,
                                        delay: i * 0.08,
                                    }}
                                    className="relative grid grid-cols-[2.25rem_1fr] gap-4 pl-0 md:gap-6"
                                >
                                    <div className="flex justify-center pt-0.5">
                                        <span className="relative z-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-[10px] font-bold leading-none text-primary md:h-10 md:w-10 md:text-xs">
                                            {m.year}
                                        </span>
                                    </div>
                                    <div className="min-w-0 pb-1">
                                        <h3 className="text-lg font-bold md:text-xl">
                                            {m.title}
                                        </h3>
                                        <p className="mt-2 leading-relaxed text-muted-foreground">
                                            {m.text}
                                        </p>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Differentiators */}
            <section className="border-t border-border/50 bg-primary/5 py-14 md:py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        {...fadeUp}
                        className="mx-auto mb-10 max-w-2xl text-center md:mb-14"
                    >
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                            <Bot className="h-3.5 w-3.5" />
                            Trải nghiệm LUXE
                        </div>
                        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl lg:text-4xl">
                            Vì sao khách hàng chọn chúng tôi
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
                        {differentiators.map((d, i) => (
                            <motion.div
                                key={d.title}
                                {...fadeUp}
                                transition={{
                                    duration: 0.45,
                                    delay: i * 0.06,
                                }}
                                className="flex gap-4 rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm backdrop-blur-sm md:p-6"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                    <d.icon
                                        className="h-6 w-6 text-primary"
                                        aria-hidden
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold md:text-lg">
                                        {d.title}
                                    </h3>
                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                                        {d.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Commitments */}
            <section className="py-14 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-muted/20 px-6 py-10 md:px-10 md:py-12">
                        <h2 className="text-center text-xl font-bold md:text-2xl">
                            Cam kết với bạn
                        </h2>
                        <ul className="mt-6 space-y-3 text-muted-foreground md:mt-8 md:space-y-4">
                            <li className="flex gap-3">
                                <span
                                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                                    aria-hidden
                                />
                                <span>
                                    Minh bạch thông tin sản phẩm: hình ảnh thực
                                    tế, mô tả size và chất liệu rõ ràng.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span
                                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                                    aria-hidden
                                />
                                <span>
                                    Hỗ trợ đổi trả theo chính sách công bố —
                                    đội ngũ CSKH phản hồi nhanh qua chat, email
                                    và hotline.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span
                                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                                    aria-hidden
                                />
                                <span>
                                    Bảo vệ dữ liệu cá nhân và giao dịch theo
                                    chuẩn bảo mật thông dụng cho thương mại điện
                                    tử.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-border/50 bg-muted/30 pb-16 pt-10 md:pb-20 md:pt-14">
                <div className="container mx-auto px-4 text-center">
                    <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
                        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                            Sẵn sàng cập nhật tủ đồ?
                        </h2>
                        <p className="mx-auto mt-3 max-w-lg text-muted-foreground md:text-lg">
                            Khám phá bộ sưu tập mới hoặc trò chuyện với chúng tôi
                            nếu bạn cần tư vấn thêm.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                            <Link
                                href="/products"
                                className={cn(
                                    buttonVariants({
                                        variant: "default",
                                        size: "lg",
                                    }),
                                    "min-h-11 rounded-full px-8",
                                )}
                            >
                                Khám phá sản phẩm
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link
                                href="/contact"
                                className={cn(
                                    buttonVariants({
                                        variant: "outline",
                                        size: "lg",
                                    }),
                                    "min-h-11 rounded-full px-8",
                                )}
                            >
                                Liên hệ
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
