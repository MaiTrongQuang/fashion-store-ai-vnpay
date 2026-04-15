"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [sentEmail, setSentEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email }),
            });

            const json = await res.json();

            if (!res.ok) {
                toast.error(json.error || "Có lỗi xảy ra.");
                return;
            }

            setSentEmail(data.email);
            setEmailSent(true);
            toast.success("Đã gửi email đặt lại mật khẩu!");
        } catch {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

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
                        Quên mật khẩu
                    </CardTitle>
                    <CardDescription>
                        Nhập email để nhận link đặt lại mật khẩu.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {emailSent ? (
                        <div className="flex flex-col items-center gap-4 py-4 text-center">
                            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                                <CheckCircle2 className="size-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground">
                                    Email đã được gửi!
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Chúng tôi đã gửi link đặt lại mật khẩu đến{" "}
                                    <span className="font-medium text-foreground">
                                        {sentEmail}
                                    </span>
                                    . Vui lòng kiểm tra hộp thư (và thư mục
                                    spam).
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="mt-2"
                                onClick={() => {
                                    setEmailSent(false);
                                    setSentEmail("");
                                }}
                            >
                                Gửi lại email
                            </Button>
                        </div>
                    ) : (
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
                                        autoFocus
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

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading
                                    ? "Đang gửi..."
                                    : "Gửi link đặt lại mật khẩu"}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-1 border-t border-border/60 bg-muted/30 pt-4 text-center text-sm text-muted-foreground">
                    <Link
                        href="/login"
                        className={cn(
                            "inline-flex items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline",
                        )}
                    >
                        <ArrowLeft className="size-3.5" />
                        Quay lại đăng nhập
                    </Link>
                </CardFooter>
            </Card>
        </AuthShell>
    );
}
