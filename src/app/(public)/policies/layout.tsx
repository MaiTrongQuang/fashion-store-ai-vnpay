import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DotPattern } from "@/components/ui/backgrounds";
import { SITE_NAME } from "@/lib/constants";
import PoliciesSidebar from "@/components/policies/PoliciesSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: `%s | ${SITE_NAME}`,
        default: `Chính sách và Quy định | ${SITE_NAME}`,
    },
    description: `Tìm hiểu các chính sách vận chuyển, đổi trả, bảo mật và điều khoản sử dụng khi mua sắm tại ${SITE_NAME}.`,
};

export default function PoliciesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col flex-1 bg-background">
            {/* Header / Hero */}
            <section className="relative overflow-hidden border-b border-border/40 bg-muted/30">
                <DotPattern
                    width={20}
                    height={20}
                    cx={1}
                    cy={1}
                    cr={1.5}
                    className="absolute inset-0 opacity-40 mask-[radial-gradient(500px_circle_at_center,white,transparent)]"
                />
                <div className="container relative z-10 mx-auto px-4 py-8 md:py-12">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
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
                            Chính sách hỗ trợ
                        </span>
                    </nav>

                    <div className="max-w-2xl">
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                            Trung tâm chính sách
                        </h1>
                        <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                            Mọi thông tin cần thiết về quy trình giao nhận, đổi trả 
                            và bảo mật khi bạn mua sắm tại{" "}
                            <span className="font-medium text-foreground">{SITE_NAME}</span>.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content Area: Sidebar + Dynamic Page content */}
            <section className="flex-1 py-10 md:py-14">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                        {/* Left Sidebar */}
                        <aside className="w-full md:w-64 lg:w-72 md:sticky md:top-24 shrink-0">
                            <PoliciesSidebar />
                        </aside>

                        {/* Right Content */}
                        <main className="flex-1 min-w-0">
                            {children}
                        </main>
                    </div>
                </div>
            </section>
        </div>
    );
}
