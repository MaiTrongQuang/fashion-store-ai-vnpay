"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
    full_name: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
    phone: z.string().optional(),
});

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const supabase = createClient();

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: { full_name: "", phone: "" },
    });

    useEffect(() => {
        async function loadProfile() {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                if (data) {
                    setProfile(data);
                    form.reset({
                        full_name: data.full_name || "",
                        phone: data.phone || "",
                    });
                }
            }
            setInitialLoad(false);
        }
        loadProfile();
    }, [supabase, form]);

    const onSubmit = async (data: z.infer<typeof profileSchema>) => {
        if (!profile) return;
        setLoading(true);
        const { error } = await supabase
            .from("profiles")
            .update({
                full_name: data.full_name,
                phone: data.phone || null,
            })
            .eq("id", profile.id);

        if (error) {
            toast.error("Cập nhật thất bại");
        } else {
            toast.success("Cập nhật thành công!");
        }
        setLoading(false);
    };

    if (initialLoad) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Skeleton className="h-20 w-20 shrink-0 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <Skeleton className="h-48 w-full max-w-lg rounded-xl" />
            </div>
        );
    }

    if (!profile) {
        return (
            <p className="text-muted-foreground">
                Không tải được hồ sơ. Vui lòng đăng nhập lại.
            </p>
        );
    }

    return (
        <div className="space-y-8">
            <Card className="border-border/50 bg-background/60 shadow-none">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <UserRound className="h-5 w-5" aria-hidden />
                        </span>
                        Hồ sơ của bạn
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <Avatar className="h-20 w-20 ring-2 ring-border/60 ring-offset-2 ring-offset-background">
                            <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                                {profile.full_name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="truncate text-lg font-semibold text-foreground">
                                {profile.full_name || "Chưa cập nhật tên"}
                            </p>
                            <p className="truncate text-sm text-muted-foreground">
                                {profile.email}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Vai trò:{" "}
                                <span className="font-medium text-foreground">
                                    {profile.role === "admin"
                                        ? "Quản trị"
                                        : "Khách hàng"}
                                </span>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/50 bg-background/60 shadow-none">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">
                        Chỉnh sửa thông tin
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mx-auto max-w-lg space-y-5"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Họ và tên</Label>
                            <Input
                                id="full_name"
                                autoComplete="name"
                                className="min-h-11"
                                {...form.register("full_name")}
                            />
                            {form.formState.errors.full_name && (
                                <p className="text-xs text-destructive">
                                    {form.formState.errors.full_name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={profile.email}
                                disabled
                                className="min-h-11 bg-muted/80"
                            />
                            <p className="text-xs text-muted-foreground">
                                Email dùng để đăng nhập, không thể đổi tại đây.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input
                                id="phone"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                placeholder="0123456789"
                                className="min-h-11"
                                {...form.register("phone")}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                "min-h-11 w-full cursor-pointer sm:w-auto",
                            )}
                        >
                            {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
