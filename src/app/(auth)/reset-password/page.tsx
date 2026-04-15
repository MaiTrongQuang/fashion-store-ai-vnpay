"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
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
import { SITE_NAME } from "@/lib/constants";
import { AuthShell } from "@/components/auth/auth-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const resetPasswordSchema = z
    .object({
        password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
    });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorParam = searchParams.get("error");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordForm) => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: data.password }),
                credentials: "include",
            });

            const json = await res.json();

            if (!res.ok) {
                toast.error(json.error || "Có lỗi xảy ra.");
                return;
            }

            setSuccess(true);
            toast.success("Đặt lại mật khẩu thành công!");
        } catch {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    if (errorParam) {
        return (
            <AuthShell>
                <Card className="w-full max-w-md border-0 bg-card/90 shadow-xl backdrop-blur-md dark:bg-card/80">
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
                            Liên kết hết hạn
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-4 py-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                Link đặt lại mật khẩu đã hết hạn hoặc không
                                hợp lệ. Vui lòng yêu cầu lại.
                            </p>
                            <Button asChild>
                                <Link href="/forgot-password">
                                    Yêu cầu lại
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </AuthShell>
        );
    }

    return (
        <AuthShell>
            <Card className="w-full max-w-md border-0 bg-card/90 shadow-xl backdrop-blur-md dark:bg-card/80">
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
                        Đặt lại mật khẩu
                    </CardTitle>
                    <CardDescription>
                        Nhập mật khẩu mới cho tài khoản của bạn.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {success ? (
                        <div className="flex flex-col items-center gap-4 py-4 text-center">
                            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                                <CheckCircle2 className="size-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground">
                                    Đặt lại mật khẩu thành công!
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Bạn có thể đăng nhập bằng mật khẩu mới.
                                </p>
                            </div>
                            <Button
                                className="mt-2"
                                onClick={() => router.push("/login")}
                            >
                                Đăng nhập ngay
                            </Button>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Mật khẩu mới
                                </Label>
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
                                        autoFocus
                                        aria-invalid={!!errors.password}
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
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
                                    Nhập lại mật khẩu mới
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
                                disabled={loading}
                            >
                                {loading
                                    ? "Đang xử lý..."
                                    : "Đặt lại mật khẩu"}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-1 border-t border-border/60 bg-muted/30 pt-4 text-center text-sm text-muted-foreground">
                    <Link
                        href="/login"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        Quay lại đăng nhập
                    </Link>
                </CardFooter>
            </Card>
        </AuthShell>
    );
}

function ResetPasswordFallback() {
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
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </AuthShell>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<ResetPasswordFallback />}>
            <ResetPasswordForm />
        </Suspense>
    );
}
