"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
    Menu,
    X,
    Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminName, setAdminName] = useState<string | null>(null);
    const [adminEmail, setAdminEmail] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAdmin() {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                setAdminEmail(user.email ?? null);
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("full_name")
                    .eq("id", user.id)
                    .single();
                setAdminName(profile?.full_name ?? user.email ?? "Admin");
            }
        }
        fetchAdmin();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    // Get current page title
    const currentNav = ADMIN_NAV.find(
        (item) =>
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href))
    );
    const pageTitle = currentNav?.label || "Dashboard";

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-4 border-b">
                <Link
                    href="/admin"
                    className="flex items-center gap-2"
                    onClick={() => setSidebarOpen(false)}
                >
                    <span className="text-lg font-bold heading-gradient-vi text-gradient-brand">
                        {SITE_NAME}
                    </span>
                </Link>
                <p className="text-xs text-muted-foreground mt-1">
                    Quản trị hệ thống
                </p>
            </div>

            {/* Navigation */}
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
                                onClick={() => setSidebarOpen(false)}
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

            {/* Admin Info + Actions */}
            <div className="p-3 space-y-2">
                {adminName && (
                    <div className="px-3 py-2">
                        <p className="text-sm font-medium truncate">
                            {adminName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {adminEmail}
                        </p>
                    </div>
                )}
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
        </>
    );

    return (
        <div className="flex h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="w-64 border-r bg-card hidden md:flex flex-col">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-card flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <SidebarContent />
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header Bar */}
                <header className="h-14 border-b bg-card flex items-center justify-between px-4 md:px-6 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                        <div>
                            <h2 className="text-sm font-semibold">
                                {pageTitle}
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                            Admin
                        </Badge>
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            {adminName?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
