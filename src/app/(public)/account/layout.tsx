"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, Heart, Star } from "lucide-react";

const ACCOUNT_NAV = [
    { href: "/account/profile", label: "Thông tin cá nhân", icon: User },
    { href: "/account/orders", label: "Đơn hàng", icon: Package },
    { href: "/account/addresses", label: "Địa chỉ", icon: MapPin },
    { href: "/account/wishlist", label: "Yêu thích", icon: Heart },
    { href: "/account/reviews", label: "Đánh giá", icon: Star },
];

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Tài Khoản Của Tôi</h1>

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-56 shrink-0">
                    <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
                        {ACCOUNT_NAV.map((item) => {
                            const isActive =
                                pathname === item.href ||
                                pathname.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <div className="flex-1 min-w-0">{children}</div>
            </div>
        </div>
    );
}
