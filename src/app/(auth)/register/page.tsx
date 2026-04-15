"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, MailCheck } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/components/ui/input-otp";
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

type RegisterFormData = z.infer<typeof registerSchema>;

const SLIDE_VARIANTS = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export default function RegisterPage() {
    const router = useRouter();
    const reducedMotion = useReducedMotion();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successExit, setSuccessExit] = useState(false);
    const pendingHref = useRef<string | null>(null);

    // Steps: 1 = form, 2 = OTP
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [otpValue, setOtpValue] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [formData, setFormData] = useState<RegisterFormData | null>(null);

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
        getValues,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const sendOtp = async (email: string) => {
        setSendingOtp(true);
        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, purpose: "register" }),
            });
            const json = await res.json();
            if (!res.ok) {
                toast.error(json.error || "Không thể gửi mã OTP.");
                return false;
            }
            toast.success("Mã OTP đã được gửi đến email của bạn!");
            setCountdown(60);
            return true;
        } catch {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
            return false;
        } finally {
            setSendingOtp(false);
        }
    };

    const onStepOneSubmit = async (data: RegisterFormData) => {
        setFormData(data);
        const sent = await sendOtp(data.email);
        if (sent) {
            setDirection(1);
            setStep(2);
        }
    };

    const verifyAndRegister = async () => {
        if (!formData || otpValue.length !== 6) return;
        setOtpLoading(true);
        try {
            // Step 1: Verify OTP
            const verifyRes = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    code: otpValue,
                    purpose: "register",
                }),
            });
            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok) {
                toast.error(verifyJson.error || "Mã OTP không đúng.");
                setOtpValue("");
                return;
            }

            // Step 2: Register account
            setLoading(true);
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    otpCode: otpValue,
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

            toast.success("Đăng ký thành công!");
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
            setOtpLoading(false);
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
                            {step === 1 ? "Tạo tài khoản" : "Xác thực email"}
                        </CardTitle>
                        <CardDescription>
                            {step === 1
                                ? "Đăng ký để lưu đơn hàng và nhận ưu đãi từ Nana Store."
                                : `Nhập mã 6 số đã gửi đến ${formData?.email ?? "email của bạn"}`}
                        </CardDescription>

                        {/* Step indicator */}
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <div
                                className={cn(
                                    "h-1.5 w-12 rounded-full transition-colors",
                                    step >= 1
                                        ? "bg-primary"
                                        : "bg-muted",
                                )}
                            />
                            <div
                                className={cn(
                                    "h-1.5 w-12 rounded-full transition-colors",
                                    step >= 2
                                        ? "bg-primary"
                                        : "bg-muted",
                                )}
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="relative min-h-[280px] overflow-hidden pt-6">
                        <AnimatePresence mode="wait" custom={direction}>
                            {step === 1 && (
                                <motion.div
                                    key="step-1"
                                    custom={direction}
                                    variants={SLIDE_VARIANTS}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        duration: reducedMotion ? 0 : 0.25,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <form
                                        onSubmit={handleSubmit(
                                            onStepOneSubmit,
                                        )}
                                        className="space-y-4"
                                    >
                                        {/* Full Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">
                                                Họ và tên
                                            </Label>
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
                                                    aria-invalid={
                                                        !!errors.fullName
                                                    }
                                                    {...register("fullName")}
                                                />
                                            </div>
                                            {errors.fullName && (
                                                <p className="text-xs text-destructive">
                                                    {errors.fullName.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
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
                                                    aria-invalid={
                                                        !!errors.email
                                                    }
                                                    {...register("email")}
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-xs text-destructive">
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password">
                                                Mật khẩu
                                            </Label>
                                            <div className="relative">
                                                <Lock
                                                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                                    aria-hidden
                                                />
                                                <Input
                                                    id="password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    autoComplete="new-password"
                                                    placeholder="••••••••"
                                                    className="pl-10 pr-12"
                                                    aria-invalid={
                                                        !!errors.password
                                                    }
                                                    {...register("password")}
                                                />
                                                <button
                                                    type="button"
                                                    tabIndex={-1}
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword,
                                                        )
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

                                        {/* Confirm Password */}
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
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    autoComplete="new-password"
                                                    placeholder="••••••••"
                                                    className="pl-10"
                                                    aria-invalid={
                                                        !!errors.confirmPassword
                                                    }
                                                    {...register(
                                                        "confirmPassword",
                                                    )}
                                                />
                                            </div>
                                            {errors.confirmPassword && (
                                                <p className="text-xs text-destructive">
                                                    {
                                                        errors.confirmPassword
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={sendingOtp}
                                        >
                                            {sendingOtp
                                                ? "Đang gửi mã OTP..."
                                                : "Tiếp tục"}
                                        </Button>
                                    </form>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step-2"
                                    custom={direction}
                                    variants={SLIDE_VARIANTS}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        duration: reducedMotion ? 0 : 0.25,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                                            <MailCheck className="size-8 text-primary" />
                                        </div>

                                        <InputOTP
                                            maxLength={6}
                                            pattern={REGEXP_ONLY_DIGITS}
                                            value={otpValue}
                                            onChange={setOtpValue}
                                            disabled={
                                                otpLoading || loading
                                            }
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot
                                                    index={0}
                                                    className="size-12 text-lg"
                                                />
                                                <InputOTPSlot
                                                    index={1}
                                                    className="size-12 text-lg"
                                                />
                                                <InputOTPSlot
                                                    index={2}
                                                    className="size-12 text-lg"
                                                />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot
                                                    index={3}
                                                    className="size-12 text-lg"
                                                />
                                                <InputOTPSlot
                                                    index={4}
                                                    className="size-12 text-lg"
                                                />
                                                <InputOTPSlot
                                                    index={5}
                                                    className="size-12 text-lg"
                                                />
                                            </InputOTPGroup>
                                        </InputOTP>

                                        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                                            {countdown > 0 ? (
                                                <p>
                                                    Gửi lại mã sau{" "}
                                                    <span className="font-semibold text-foreground tabular-nums">
                                                        {countdown}s
                                                    </span>
                                                </p>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="font-medium text-primary underline-offset-4 hover:underline disabled:opacity-50"
                                                    disabled={sendingOtp}
                                                    onClick={() => {
                                                        if (formData) {
                                                            sendOtp(
                                                                formData.email,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {sendingOtp
                                                        ? "Đang gửi..."
                                                        : "Gửi lại mã OTP"}
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex w-full gap-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1"
                                                disabled={
                                                    otpLoading || loading
                                                }
                                                onClick={() => {
                                                    setDirection(-1);
                                                    setStep(1);
                                                    setOtpValue("");
                                                }}
                                            >
                                                <ArrowLeft className="mr-1.5 size-4" />
                                                Quay lại
                                            </Button>
                                            <Button
                                                type="button"
                                                className="flex-1"
                                                disabled={
                                                    otpValue.length !== 6 ||
                                                    otpLoading ||
                                                    loading ||
                                                    successExit
                                                }
                                                onClick={verifyAndRegister}
                                            >
                                                {successExit
                                                    ? "Đang chuyển trang..."
                                                    : otpLoading || loading
                                                      ? "Đang xử lý..."
                                                      : "Xác nhận & Đăng ký"}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
