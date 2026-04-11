"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useReducedMotion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
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
import { toast } from "sonner";
import type { RegisterSuccessResponse } from "@/lib/auth/api-types";
import { SITE_NAME } from "@/lib/constants";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthMotionSurface } from "@/components/auth/auth-success-transition";
import { cn } from "@/lib/utils";

const registerSchema = z
    .object({
        fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
        email: z.string().email("Email không hợp lệ"),
        password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
    });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const reducedMotion = useReducedMotion();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successExit, setSuccessExit] = useState(false);
    const pendingHref = useRef<string | null>(null);

    const handleExitComplete = useCallback(() => {
        const href = pendingHref.current;
        pendingHref.current = null;
        if (href) {
            router.replace(href);
            queueMicrotask(() => router.refresh());
        }
    }, [router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    fullName: data.fullName,
                }),
                credentials: "include",
            });

            const json = (await res.json()) as
                | RegisterSuccessResponse
                | { error: string };

            if (!res.ok) {
                toast.error(
                    "error" in json ? json.error : "Đăng ký thất bại.",
                );
                return;
            }

            const ok = json as RegisterSuccessResponse;

            toast.success(
                ok.needsEmailConfirmation
                    ? "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
                    : "Đăng ký thành công!",
            );
            if (reducedMotion) {
                router.replace("/login");
                queueMicrotask(() => router.refresh());
                return;
            }
            pendingHref.current = "/login";
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
                            <span className="heading-gradient-vi text-gradient-brand">
                                {SITE_NAME}
                            </span>
                        </Link>
                        <CardTitle className="text-lg font-semibold">
                            Tạo tài khoản
                        </CardTitle>
                        <CardDescription>
                            Đăng ký để lưu đơn hàng và nhận ưu đãi từ Nana Store.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Họ và tên</Label>
                                <div className="relative">
                                    <User
                                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                        aria-hidden
                                    />
                                    <Input
                                        id="fullName"
                                        autoComplete="name"
                                        placeholder="Nguyễn Văn A"
                                        className="pl-10"
                                        aria-invalid={!!errors.fullName}
                                        {...register("fullName")}
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="text-xs text-destructive">
                                        {errors.fullName.message}
                                    </p>
                                )}
                            </div>

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
                                <Label htmlFor="password">Mật khẩu</Label>
                                <div className="relative">
                                    <Lock
                                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                        aria-hidden
                                    />
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="new-password"
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

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Nhập lại mật khẩu
                                </Label>
                                <div className="relative">
                                    <Lock
                                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                        aria-hidden
                                    />
                                    <Input
                                        id="confirmPassword"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        aria-invalid={
                                            !!errors.confirmPassword
                                        }
                                        {...register("confirmPassword")}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-destructive">
                                        {errors.confirmPassword.message}
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
                                      ? "Đang đăng ký..."
                                      : "Đăng ký"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-1 border-t border-border/60 bg-muted/30 pt-4 text-center text-sm text-muted-foreground">
                        <span>
                            Đã có tài khoản?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                Đăng nhập
                            </Link>
                        </span>
                    </CardFooter>
                </Card>
            </AuthMotionSurface>
        </AuthShell>
    );
}
