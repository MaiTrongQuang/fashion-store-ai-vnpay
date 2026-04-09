"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Star,
    Tag,
    Image,
    MessageSquare,
    Settings,
    LogOut,
    FolderTree,
    Award,
    ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SITE_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const ADMIN_NAV = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Sản phẩm", icon: Package },
    { href: "/admin/categories", label: "Danh mục", icon: FolderTree },
    { href: "/admin/brands", label: "Thương hiệu", icon: Award },
    { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingCart },
    { href: "/admin/customers", label: "Khách hàng", icon: Users },
    { href: "/admin/reviews", label: "Đánh giá", icon: Star },
    { href: "/admin/vouchers", label: "Voucher", icon: Tag },
    { href: "/admin/banners", label: "Banner", icon: Image },
    { href: "/admin/chatbot", label: "Chatbot FAQ", icon: MessageSquare },
    { href: "/admin/settings", label: "Cài đặt", icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-card hidden md:flex flex-col">
                <div className="p-4 border-b">
                    <Link href="/admin" className="flex items-center gap-2">
                        <span className="text-lg font-bold heading-gradient-vi text-gradient-brand">
                            {SITE_NAME}
                        </span>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                        Quản trị hệ thống
                    </p>
                </div>

                <ScrollArea className="flex-1 p-3">
                    <nav className="space-y-1">
                        {ADMIN_NAV.map((item) => {
                            const isActive =
                                pathname === item.href ||
                                (item.href !== "/admin" &&
                                    pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </ScrollArea>

                <Separator />

                <div className="p-3 space-y-1">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Về trang chủ
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors w-full"
                    >
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
