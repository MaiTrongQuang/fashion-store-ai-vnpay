"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Profile } from "@/lib/types";

const profileSchema = z.object({
    full_name: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
    phone: z.string().optional(),
});

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(false);
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

    if (!profile) {
        return <p className="text-muted-foreground">Đang tải...</p>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Thông Tin Cá Nhân</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                {profile.full_name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">
                                {profile.full_name || "Chưa cập nhật"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {profile.email}
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 max-w-md"
                    >
                        <div className="space-y-2">
                            <Label>Họ và tên</Label>
                            <Input {...form.register("full_name")} />
                            {form.formState.errors.full_name && (
                                <p className="text-xs text-destructive">
                                    {form.formState.errors.full_name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                value={profile.email}
                                disabled
                                className="bg-muted"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Số điện thoại</Label>
                            <Input
                                {...form.register("phone")}
                                placeholder="0123456789"
                            />
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading ? "Đang cập nhật..." : "Lưu Thay Đổi"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
