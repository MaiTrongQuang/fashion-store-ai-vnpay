"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Search,
    ShoppingBag,
    Heart,
    User,
    Menu,
    ChevronDown,
    LogOut,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

export default function Header() {
    const pathname = usePathname();
    const [user, setUser] = useState<Profile | null>(null);
    const [cartCount, setCartCount] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        async function getUser() {
            const {
                data: { user: authUser },
            } = await supabase.auth.getUser();
            if (authUser) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", authUser.id)
                    .single();
                setUser(profile);
            }
        }
        getUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            async (event: string, session: any) => {
                if (event === "SIGNED_IN" && session?.user) {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", session.user.id)
                        .single();
                    setUser(profile);
                } else if (event === "SIGNED_OUT") {
                    setUser(null);
                }
            },
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    useEffect(() => {
        async function getCartCount() {
            const {
                data: { user: authUser },
            } = await supabase.auth.getUser();
            if (authUser) {
                const { data: cart } = await supabase
                    .from("carts")
                    .select("id")
                    .eq("user_id", authUser.id)
                    .single();
                if (cart) {
                    const { count } = await supabase
                        .from("cart_items")
                        .select("*", { count: "exact", head: true })
                        .eq("cart_id", cart.id);
                    setCartCount(count || 0);
                }
            }
        }
        getCartCount();
    }, [supabase, pathname]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        window.location.href = "/";
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled
                    ? "bg-background/80 backdrop-blur-xl shadow-sm border-b"
                    : "bg-background border-b border-transparent"
            }`}
        >
            {/* Top bar */}
            <div className="bg-primary text-primary-foreground text-xs py-1.5 text-center hidden md:block">
                <p>
                    🚚 Miễn phí vận chuyển cho đơn hàng từ 500.000đ | Hotline:{" "}
                    <span className="font-semibold">1900-xxxx</span>
                </p>
            </div>

            {/* Main header */}
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-18">
                    {/* Mobile Menu */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger
                            className="md:hidden"
                            render={
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            }
                        />
                        <SheetContent side="left" className="w-80">
                            <div className="flex flex-col gap-4 mt-8">
                                <Link
                                    href="/"
                                    className="text-xl font-bold tracking-tight"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {SITE_NAME}
                                </Link>
                                <nav className="flex flex-col gap-2 mt-4">
                                    {NAV_LINKS.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                pathname === link.href
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-accent"
                                            } ${link.highlight ? "text-red-500 font-bold" : ""}`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-xl md:text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
                    >
                        <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            {SITE_NAME}
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    pathname === link.href
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                                } ${link.highlight ? "text-red-500 hover:text-red-600 font-bold" : ""}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1">
                        <Link
                            href="/search"
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                    size: "icon",
                                }),
                                "hidden sm:inline-flex",
                            )}
                        >
                            <Search className="h-4 w-4" />
                        </Link>

                        <Link
                            href="/account/wishlist"
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                    size: "icon",
                                }),
                                "hidden sm:inline-flex",
                            )}
                        >
                            <Heart className="h-4 w-4" />
                        </Link>

                        <Link
                            href="/cart"
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                    size: "icon",
                                }),
                                "relative",
                            )}
                        >
                            <ShoppingBag className="h-4 w-4" />
                            {cartCount > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                                    {cartCount}
                                </Badge>
                            )}
                        </Link>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    render={
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2"
                                        >
                                            <User className="h-4 w-4" />
                                            <span className="hidden sm:inline text-sm">
                                                {user.full_name || "Tài khoản"}
                                            </span>
                                            <ChevronDown className="h-3 w-3" />
                                        </Button>
                                    }
                                />
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                >
                                    <DropdownMenuItem
                                        render={
                                            <Link href="/account/profile">
                                                Tài khoản của tôi
                                            </Link>
                                        }
                                    />
                                    <DropdownMenuItem
                                        render={
                                            <Link href="/account/orders">
                                                Đơn hàng
                                            </Link>
                                        }
                                    />
                                    <DropdownMenuItem
                                        render={
                                            <Link href="/account/wishlist">
                                                Yêu thích
                                            </Link>
                                        }
                                    />
                                    {user.role === "admin" && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                render={
                                                    <Link href="/admin">
                                                        Quản trị
                                                    </Link>
                                                }
                                            />
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="text-red-500"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                href="/login"
                                className={cn(
                                    buttonVariants({
                                        variant: "outline",
                                        size: "sm",
                                    }),
                                    "gap-2",
                                )}
                            >
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Đăng nhập
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
