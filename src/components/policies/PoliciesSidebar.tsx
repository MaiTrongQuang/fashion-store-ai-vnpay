"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { POLICIES } from "@/lib/policies-data";
import { cn } from "@/lib/utils";

export default function PoliciesSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col rounded-2xl border border-border/60 bg-card p-3 shadow-sm md:p-4">
            <h3 className="mb-3 px-3 text-sm font-bold tracking-tight text-foreground md:text-base">
                Danh mục chính sách
            </h3>
            <nav className="flex flex-col gap-1">
                {POLICIES.map((policy) => {
                    const href = `/policies/${policy.id}`;
                    const isActive = pathname === href;
                    
                    const Icon = policy.icon;

                    return (
                        <Link
                            key={policy.id}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                        >
                            <Icon 
                                className={cn(
                                    "h-4 w-4 shrink-0 transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground/70"
                                )} 
                                aria-hidden 
                            />
                            {policy.title}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
