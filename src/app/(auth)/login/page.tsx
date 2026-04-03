"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { SITE_NAME } from "@/lib/constants";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthMotionSurface } from "@/components/auth/auth-success-transition";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";

const loginSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";
    const reducedMotion = useReducedMotion();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successExit, setSuccessExit] = useState(false);
    const pendingHref = useRef<string | null>(null);
    const supabase = createClient();

    const handleExitComplete = useCallback(() => {
        const href = pendingHref.current;
        pendingHref.current = null;
        if (href) {
            router.push(href);
            router.refresh();
        }
    }, [router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                toast.error(
                    error.message === "Invalid login credentials"
                        ? "Email hoặc mật khẩu không đúng"
                        : error.message,
                );
                return;
            }

            toast.success("Đăng nhập thành công!");
            if (reducedMotion) {
                router.push(redirect);
                router.refresh();
                return;
            }
            pendingHref.current = redirect;
            setSuccessExit(true);
        } catch {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell>
            <AuthMotionSurface
                exit={successExit}
                onExitComplete={handleExitComplete}
            >
                <Card className="w-full border-0 bg-card/90 shadow-xl backdrop-blur-md dark:bg-card/80">
                <CardHeader className="space-y-1 border-b border-border/60 pb-4 text-center">
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tight transition-opacity hover:opacity-80"
                    >
                        <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            {SITE_NAME}
                        </span>
                    </Link>
                    <CardTitle className="text-lg font-semibold">
                        Đăng nhập
                    </CardTitle>
                    <CardDescription>
                        Chào mừng bạn trở lại — đăng nhập để tiếp tục mua sắm.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail
                                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                    aria-hidden
                                />
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="your@email.com"
                                    className="pl-10"
                                    aria-invalid={!!errors.email}
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock
                                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                    aria-hidden
                                />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="pl-10 pr-12"
                                    aria-invalid={!!errors.password}
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className={cn(
                                        "absolute right-1 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md",
                                        "text-muted-foreground transition-colors hover:text-foreground",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                    )}
                                    aria-label={
                                        showPassword
                                            ? "Ẩn mật khẩu"
                                            : "Hiện mật khẩu"
                                    }
                                    aria-pressed={showPassword}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-destructive">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading || successExit}
                        >
                            {successExit
                                ? "Đang chuyển trang..."
                                : loading
                                  ? "Đang đăng nhập..."
                                  : "Đăng nhập"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-1 border-t border-border/60 bg-muted/30 pt-4 text-center text-sm text-muted-foreground">
                    <span>
                        Chưa có tài khoản?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                            Đăng ký ngay
                        </Link>
                    </span>
                </CardFooter>
            </Card>
            </AuthMotionSurface>
        </AuthShell>
    );
}

function LoginPageFallback() {
    return (
        <AuthShell>
            <Card className="w-full max-w-md border-0 bg-card/90 shadow-xl backdrop-blur-md dark:bg-card/80">
                <CardHeader className="space-y-3 border-b border-border/60 pb-4 text-center">
                    <Skeleton className="mx-auto h-8 w-44" />
                    <Skeleton className="mx-auto h-5 w-32" />
                    <Skeleton className="mx-auto h-4 w-full max-w-xs" />
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-14" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </AuthShell>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginPageFallback />}>
            <LoginForm />
        </Suspense>
    );
}
