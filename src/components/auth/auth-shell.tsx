"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DotPattern } from "@/components/ui/backgrounds";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthShellProps = {
    children: React.ReactNode;
    className?: string;
};

export function AuthShell({ children, className }: AuthShellProps) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <DotPattern
                className={cn(
                    "opacity-[0.45] dark:opacity-[0.22]",
                    "mask-[radial-gradient(ellipse_at_center,black_20%,transparent_72%)]",
                )}
            />
            <div
                className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/4 via-background to-accent/35 dark:from-primary/8 dark:via-background dark:to-accent/25"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-background via-transparent to-background/80"
                aria-hidden
            />

            <div className={cn("relative z-10 flex min-h-screen flex-col", className)}>
                <div className="container mx-auto px-4 pt-4 md:pt-6">
                    <Link
                        href="/"
                        className={cn(
                            buttonVariants({
                                variant: "ghost",
                                size: "sm",
                            }),
                            "-ml-2 inline-flex gap-2 text-muted-foreground hover:text-foreground",
                        )}
                    >
                        <ArrowLeft className="size-4" aria-hidden />
                        Về trang chủ
                    </Link>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-2 md:pb-16">
                    {children}
                </div>
            </div>
        </div>
    );
}
