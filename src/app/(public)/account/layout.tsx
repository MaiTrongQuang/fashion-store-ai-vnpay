"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ChevronRight,
    Heart,
    MapPin,
    Package,
    Sparkles,
    Star,
    User,
} from "lucide-react";
import { DotPattern } from "@/components/ui/backgrounds";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ACCOUNT_NAV = [
    { href: "/account/profile", label: "Thông tin cá nhân", icon: User },
    { href: "/account/orders", label: "Đơn hàng", icon: Package },
    { href: "/account/addresses", label: "Địa chỉ", icon: MapPin },
    { href: "/account/wishlist", label: "Yêu thích", icon: Heart },
    { href: "/account/reviews", label: "Đánh giá", icon: Star },
] as const;

function breadcrumbTitle(pathname: string): string {
    if (pathname.startsWith("/account/orders/") && pathname !== "/account/orders") {
        return "Chi tiết đơn hàng";
    }
    const match = ACCOUNT_NAV.find(
        (n) => pathname === n.href || pathname.startsWith(`${n.href}/`),
    );
    if (match) return match.label;
    return "Tài khoản";
}

function navIsActive(pathname: string, href: string): boolean {
    if (href === "/account/orders") {
        return (
            pathname === "/account/orders" ||
            pathname.startsWith("/account/orders/")
        );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const pageTitle = breadcrumbTitle(pathname);
    const isOrderDetail =
        pathname.startsWith("/account/orders/") && pathname !== "/account/orders";

    return (
        <div className="flex flex-col">
            <section className="relative overflow-hidden border-b border-border/40 bg-muted/30">
                <DotPattern
                    width={20}
                    height={20}
                    cx={1}
                    cy={1}
                    cr={1.5}
                    className="absolute inset-0 opacity-40 mask-[radial-gradient(500px_circle_at_center,white,transparent)]"
                />
                <div className="container relative z-10 mx-auto px-4 py-10 md:py-12">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
                    >
                        <Link
                            href="/"
                            className="text-foreground/80 transition-colors hover:text-primary"
                        >
                            Trang chủ
                        </Link>
                        <ChevronRight
                            className="h-4 w-4 shrink-0 opacity-60"
                            aria-hidden
                        />
                        <Link
                            href="/account/profile"
                            className="text-foreground/80 transition-colors hover:text-primary"
                        >
                            Tài khoản
                        </Link>
                        {isOrderDetail ? (
                            <>
                                <ChevronRight
                                    className="h-4 w-4 shrink-0 opacity-60"
                                    aria-hidden
                                />
                                <Link
                                    href="/account/orders"
                                    className="text-foreground/80 transition-colors hover:text-primary"
                                >
                                    Đơn hàng
                                </Link>
                            </>
                        ) : null}
                        <ChevronRight
                            className="h-4 w-4 shrink-0 opacity-60"
                            aria-hidden
                        />
                        <span className="font-medium text-foreground">
                            {pageTitle}
                        </span>
                    </nav>

                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary shadow-sm">
                                <Sparkles className="h-4 w-4" aria-hidden />
                                <span>{SITE_NAME}</span>
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                                {pageTitle}
                            </h1>
                            <p className="mt-2 text-base text-muted-foreground md:text-lg">
                                Quản lý hồ sơ, đơn hàng và trải nghiệm mua sắm của
                                bạn — giao diện tối ưu cho mọi thiết bị.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 md:py-10 lg:py-12">
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-10 xl:gap-12">
                    <aside className="w-full shrink-0 lg:w-72 lg:max-w-[20rem]">
                        <div className="rounded-2xl border border-border/60 bg-card/50 p-3 shadow-sm backdrop-blur-sm lg:sticky lg:top-24">
                            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Menu
                            </p>
                            <nav
                                aria-label="Tài khoản"
                                className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0"
                            >
                                {ACCOUNT_NAV.map((item) => {
                                    const isActive = navIsActive(
                                        pathname,
                                        item.href,
                                    );
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200",
                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                isActive
                                                    ? "bg-primary text-primary-foreground shadow-sm"
                                                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                            )}
                                        >
                                            <item.icon
                                                className="h-4 w-4 shrink-0"
                                                aria-hidden
                                            />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    <div className="min-w-0 flex-1">
                        <div className="rounded-2xl border border-border/60 bg-card/30 p-4 shadow-sm backdrop-blur-sm sm:p-6 md:p-8">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
