"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
    Mail,
    ArrowLeft,
    Lock,
    Eye,
    EyeOff,
    MailCheck,
    CheckCircle2,
} from "lucide-react";
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
import { SITE_NAME } from "@/lib/constants";
import { AuthShell } from "@/components/auth/auth-shell";
import { cn } from "@/lib/utils";

const emailSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
});
type EmailForm = z.infer<typeof emailSchema>;

const passwordSchema = z
    .object({
        password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
    });
type PasswordForm = z.infer<typeof passwordSchema>;

const SLIDE_VARIANTS = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const STEP_TITLES = [
    "", // unused index 0
    "Quên mật khẩu",
    "Xác thực mã OTP",
    "Đặt lại mật khẩu",
];
const STEP_DESCS = [
    "",
    "Nhập email để nhận mã xác thực.",
    "",
    "Nhập mật khẩu mới cho tài khoản.",
];

export default function ForgotPasswordPage() {
    const router = useRouter();
    const reducedMotion = useReducedMotion();

    // Step: 1 = email, 2 = OTP, 3 = new password, 4 = success
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [email, setEmail] = useState("");
    const [otpValue, setOtpValue] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [resetting, setResetting] = useState(false);

    const emailForm = useForm<EmailForm>({
        resolver: zodResolver(emailSchema),
    });
    const passwordForm = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
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

    const goTo = (s: number) => {
        setDirection(s > step ? 1 : -1);
        setStep(s);
    };

    const sendOtp = async (targetEmail: string) => {
        setSendingOtp(true);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: targetEmail }),
            });
            const json = await res.json();
            if (!res.ok) {
                toast.error(json.error || "Không thể gửi mã OTP.");
                return false;
            }
            if (json.sent) {
                toast.success("Mã OTP đã được gửi đến email!");
                setCountdown(60);
                return true;
            }
            // User doesn't exist — still show OTP screen (security)
            toast.success("Nếu email tồn tại, mã OTP sẽ được gửi.");
            setCountdown(60);
            return true;
        } catch {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
            return false;
        } finally {
            setSendingOtp(false);
        }
    };

    const onEmailSubmit = async (data: EmailForm) => {
        setEmail(data.email.trim().toLowerCase());
        const sent = await sendOtp(data.email);
        if (sent) goTo(2);
    };

    const verifyOtp = async () => {
        if (otpValue.length !== 6) return;
        setOtpLoading(true);
        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    code: otpValue,
                    purpose: "reset_password",
                }),
            });
            const json = await res.json();
            if (!res.ok) {
                toast.error(json.error || "Mã OTP không đúng.");
                setOtpValue("");
                return;
            }
            toast.success("Xác thực thành công!");
            goTo(3);
        } catch {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setOtpLoading(false);
        }
    };

    const onPasswordSubmit = async (data: PasswordForm) => {
        setResetting(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password: data.password,
                    otpCode: otpValue,
                }),
            });
            const json = await res.json();
            if (!res.ok) {
                toast.error(json.error || "Không thể đặt lại mật khẩu.");
                return;
            }
            toast.success("Đặt lại mật khẩu thành công!");
            goTo(4);
        } catch {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setResetting(false);
        }
    };

    const currentTitle =
        step === 4 ? "Thành công!" : STEP_TITLES[step] ?? "";
    const currentDesc =
        step === 2
            ? `Nhập mã 6 số đã gửi đến ${email}`
            : step === 4
              ? ""
              : STEP_DESCS[step] ?? "";

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
                        {currentTitle}
                    </CardTitle>
                    {currentDesc && (
                        <CardDescription>{currentDesc}</CardDescription>
                    )}

                    {/* Step indicator */}
                    {step < 4 && (
                        <div className="flex items-center justify-center gap-2 pt-2">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={cn(
                                        "h-1.5 w-8 rounded-full transition-colors",
                                        step >= s
                                            ? "bg-primary"
                                            : "bg-muted",
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </CardHeader>

                <CardContent className="relative min-h-[200px] overflow-hidden pt-6">
                    <AnimatePresence mode="wait" custom={direction}>
                        {/* Step 1: Email */}
                        {step === 1 && (
                            <motion.div
                                key="fp-step-1"
                                custom={direction}
                                variants={SLIDE_VARIANTS}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: reducedMotion ? 0 : 0.25,
                                }}
                            >
                                <form
                                    onSubmit={emailForm.handleSubmit(
                                        onEmailSubmit,
                                    )}
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
                                                aria-invalid={
                                                    !!emailForm.formState
                                                        .errors.email
                                                }
                                                {...emailForm.register(
                                                    "email",
                                                )}
                                            />
                                        </div>
                                        {emailForm.formState.errors.email && (
                                            <p className="text-xs text-destructive">
                                                {
                                                    emailForm.formState.errors
                                                        .email.message
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
                                            ? "Đang gửi..."
                                            : "Gửi mã OTP"}
                                    </Button>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 2: OTP */}
                        {step === 2 && (
                            <motion.div
                                key="fp-step-2"
                                custom={direction}
                                variants={SLIDE_VARIANTS}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: reducedMotion ? 0 : 0.25,
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
                                        disabled={otpLoading}
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
                                                onClick={() => sendOtp(email)}
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
                                            disabled={otpLoading}
                                            onClick={() => {
                                                goTo(1);
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
                                                otpLoading
                                            }
                                            onClick={verifyOtp}
                                        >
                                            {otpLoading
                                                ? "Đang xác thực..."
                                                : "Xác nhận"}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: New password */}
                        {step === 3 && (
                            <motion.div
                                key="fp-step-3"
                                custom={direction}
                                variants={SLIDE_VARIANTS}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: reducedMotion ? 0 : 0.25,
                                }}
                            >
                                <form
                                    onSubmit={passwordForm.handleSubmit(
                                        onPasswordSubmit,
                                    )}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">
                                            Mật khẩu mới
                                        </Label>
                                        <div className="relative">
                                            <Lock
                                                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                                aria-hidden
                                            />
                                            <Input
                                                id="newPassword"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                className="pl-10 pr-12"
                                                autoFocus
                                                aria-invalid={
                                                    !!passwordForm.formState
                                                        .errors.password
                                                }
                                                {...passwordForm.register(
                                                    "password",
                                                )}
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
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="size-4" />
                                                ) : (
                                                    <Eye className="size-4" />
                                                )}
                                            </button>
                                        </div>
                                        {passwordForm.formState.errors
                                            .password && (
                                            <p className="text-xs text-destructive">
                                                {
                                                    passwordForm.formState
                                                        .errors.password.message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmNewPassword">
                                            Nhập lại mật khẩu mới
                                        </Label>
                                        <div className="relative">
                                            <Lock
                                                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                                aria-hidden
                                            />
                                            <Input
                                                id="confirmNewPassword"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                                aria-invalid={
                                                    !!passwordForm.formState
                                                        .errors.confirmPassword
                                                }
                                                {...passwordForm.register(
                                                    "confirmPassword",
                                                )}
                                            />
                                        </div>
                                        {passwordForm.formState.errors
                                            .confirmPassword && (
                                            <p className="text-xs text-destructive">
                                                {
                                                    passwordForm.formState
                                                        .errors.confirmPassword
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={resetting}
                                    >
                                        {resetting
                                            ? "Đang xử lý..."
                                            : "Đặt lại mật khẩu"}
                                    </Button>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 4: Success */}
                        {step === 4 && (
                            <motion.div
                                key="fp-step-4"
                                custom={direction}
                                variants={SLIDE_VARIANTS}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: reducedMotion ? 0 : 0.25,
                                }}
                            >
                                <div className="flex flex-col items-center gap-4 py-4 text-center">
                                    <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                                        <CheckCircle2 className="size-8 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-foreground">
                                            Đặt lại mật khẩu thành công!
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Bạn có thể đăng nhập bằng mật khẩu
                                            mới.
                                        </p>
                                    </div>
                                    <Button
                                        className="mt-2"
                                        onClick={() => router.push("/login")}
                                    >
                                        Đăng nhập ngay
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>

                <CardFooter className="flex flex-col gap-1 border-t border-border/60 bg-muted/30 pt-4 text-center text-sm text-muted-foreground">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
                    >
                        <ArrowLeft className="size-3.5" />
                        Quay lại đăng nhập
                    </Link>
                </CardFooter>
            </Card>
        </AuthShell>
    );
}
