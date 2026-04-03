"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    CheckCircle2,
    MapPin,
    Plus,
    Star,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Address } from "@/lib/types";
import { cn } from "@/lib/utils";

const addressSchema = z.object({
    full_name: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
    phone: z.string().min(10, "SĐT tối thiểu 10 số"),
    province: z.string().min(1, "Vui lòng nhập tỉnh/thành"),
    district: z.string().min(1, "Vui lòng nhập quận/huyện"),
    ward: z.string().min(1, "Vui lòng nhập phường/xã"),
    street: z.string().min(1, "Vui lòng nhập địa chỉ cụ thể"),
});

type AddressForm = z.infer<typeof addressSchema>;

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    const form = useForm<AddressForm>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            full_name: "",
            phone: "",
            province: "",
            district: "",
            ward: "",
            street: "",
        },
    });

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user || cancelled) {
                if (!cancelled) setLoading(false);
                return;
            }
            const { data } = await supabase
                .from("addresses")
                .select("*")
                .eq("user_id", user.id)
                .order("is_default", { ascending: false })
                .order("created_at", { ascending: false });
            if (!cancelled) {
                setAddresses(data || []);
                setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [supabase]);

    const handleAdd = async (data: AddressForm) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        setSaving(true);
        const { data: addr, error } = await supabase
            .from("addresses")
            .insert({
                user_id: user.id,
                ...data,
                is_default: addresses.length === 0,
            })
            .select()
            .single();
        setSaving(false);
        if (error || !addr) {
            toast.error("Không thể thêm địa chỉ");
            return;
        }
        setAddresses((prev) => [...prev, addr]);
        setOpen(false);
        form.reset();
        toast.success("Đã thêm địa chỉ");
    };

    const setDefault = async (id: string) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        await supabase
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", user.id);
        const { error } = await supabase
            .from("addresses")
            .update({ is_default: true })
            .eq("id", id)
            .eq("user_id", user.id);
        if (error) {
            toast.error("Không thể cập nhật");
            return;
        }
        setAddresses((prev) =>
            prev.map((a) => ({
                ...a,
                is_default: a.id === id,
            })),
        );
        toast.success("Đã đặt làm địa chỉ mặc định");
    };

    const remove = async (id: string) => {
        if (!window.confirm("Xóa địa chỉ này?")) return;
        const { error } = await supabase.from("addresses").delete().eq("id", id);
        if (error) {
            toast.error("Không thể xóa");
            return;
        }
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        toast.success("Đã xóa địa chỉ");
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-24 animate-pulse rounded-xl bg-muted" />
                <div className="h-24 animate-pulse rounded-xl bg-muted" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                Địa chỉ dùng khi đặt hàng — có thể chọn mặc định cho lần sau.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-semibold text-foreground">
                    Danh sách địa chỉ
                </h2>
                <Dialog
                    open={open}
                    onOpenChange={(next) => {
                        setOpen(next);
                        if (!next) {
                            form.reset();
                        }
                    }}
                >
                    <DialogTrigger
                        render={
                            <Button
                                className="min-h-11 w-full cursor-pointer gap-2 sm:w-auto"
                            >
                                <Plus className="h-4 w-4" />
                                Thêm địa chỉ
                            </Button>
                        }
                    />
                    <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
                        <div className="border-b border-border/50 bg-muted/30 px-6 py-5">
                            <DialogHeader className="gap-4 sm:flex-row sm:items-start sm:text-left">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                                    <MapPin className="h-6 w-6" aria-hidden />
                                </div>
                                <div className="min-w-0 space-y-1.5">
                                    <DialogTitle className="text-lg font-semibold tracking-tight">
                                        Thêm địa chỉ mới
                                    </DialogTitle>
                                    <DialogDescription>
                                        Nhập thông tin người nhận và địa chỉ
                                        đầy đủ — dùng khi thanh toán và giao
                                        hàng.
                                    </DialogDescription>
                                </div>
                            </DialogHeader>
                        </div>

                        <form
                            onSubmit={form.handleSubmit(handleAdd)}
                            className="flex flex-col"
                        >
                            <div className="max-h-[min(60vh,480px)] space-y-6 overflow-y-auto px-6 py-5">
                                <fieldset className="space-y-4">
                                    <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Người nhận
                                    </legend>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="addr-name">
                                                Họ và tên
                                            </Label>
                                            <Input
                                                id="addr-name"
                                                autoComplete="name"
                                                aria-invalid={
                                                    !!form.formState.errors
                                                        .full_name
                                                }
                                                className="min-h-11 bg-background"
                                                {...form.register("full_name")}
                                            />
                                            {form.formState.errors
                                                .full_name && (
                                                <p
                                                    className="text-xs text-destructive"
                                                    role="alert"
                                                >
                                                    {
                                                        form.formState.errors
                                                            .full_name.message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="addr-phone">
                                                Số điện thoại
                                            </Label>
                                            <Input
                                                id="addr-phone"
                                                type="tel"
                                                inputMode="tel"
                                                autoComplete="tel"
                                                aria-invalid={
                                                    !!form.formState.errors.phone
                                                }
                                                className="min-h-11 bg-background"
                                                {...form.register("phone")}
                                            />
                                            {form.formState.errors.phone && (
                                                <p
                                                    className="text-xs text-destructive"
                                                    role="alert"
                                                >
                                                    {
                                                        form.formState.errors
                                                            .phone.message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </fieldset>

                                <Separator className="bg-border/60" />

                                <fieldset className="space-y-4">
                                    <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Địa chỉ
                                    </legend>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div className="space-y-2 sm:col-span-1">
                                            <Label htmlFor="province">
                                                Tỉnh / Thành phố
                                            </Label>
                                            <Input
                                                id="province"
                                                autoComplete="address-level1"
                                                aria-invalid={
                                                    !!form.formState.errors
                                                        .province
                                                }
                                                className="min-h-11 bg-background"
                                                {...form.register("province")}
                                            />
                                            {form.formState.errors
                                                .province && (
                                                <p
                                                    className="text-xs text-destructive"
                                                    role="alert"
                                                >
                                                    {
                                                        form.formState.errors
                                                            .province.message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="district">
                                                Quận / Huyện
                                            </Label>
                                            <Input
                                                id="district"
                                                autoComplete="address-level2"
                                                aria-invalid={
                                                    !!form.formState.errors
                                                        .district
                                                }
                                                className="min-h-11 bg-background"
                                                {...form.register("district")}
                                            />
                                            {form.formState.errors
                                                .district && (
                                                <p
                                                    className="text-xs text-destructive"
                                                    role="alert"
                                                >
                                                    {
                                                        form.formState.errors
                                                            .district.message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ward">
                                                Phường / Xã
                                            </Label>
                                            <Input
                                                id="ward"
                                                autoComplete="address-level3"
                                                aria-invalid={
                                                    !!form.formState.errors.ward
                                                }
                                                className="min-h-11 bg-background"
                                                {...form.register("ward")}
                                            />
                                            {form.formState.errors.ward && (
                                                <p
                                                    className="text-xs text-destructive"
                                                    role="alert"
                                                >
                                                    {
                                                        form.formState.errors
                                                            .ward.message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="street">
                                            Địa chỉ cụ thể
                                        </Label>
                                        <Input
                                            id="street"
                                            autoComplete="street-address"
                                            aria-invalid={
                                                !!form.formState.errors.street
                                            }
                                            className="min-h-11 bg-background"
                                            placeholder="Số nhà, tên đường, tòa nhà..."
                                            {...form.register("street")}
                                        />
                                        {form.formState.errors.street && (
                                            <p
                                                className="text-xs text-destructive"
                                                role="alert"
                                            >
                                                {
                                                    form.formState.errors.street
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>
                                </fieldset>
                            </div>

                            <DialogFooter className="-mx-0 -mb-0 gap-2 rounded-none border-t border-border/60 bg-muted/30 px-4 py-4 sm:px-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="min-h-11 w-full cursor-pointer sm:w-auto"
                                    onClick={() => setOpen(false)}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="min-h-11 w-full cursor-pointer sm:w-auto"
                                >
                                    {saving ? "Đang lưu..." : "Lưu địa chỉ"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-14 text-center">
                    <MapPin
                        className="mb-3 h-10 w-10 text-muted-foreground"
                        aria-hidden
                    />
                    <p className="font-medium text-foreground">
                        Chưa có địa chỉ nào
                    </p>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                        Thêm ít nhất một địa chỉ để thanh toán nhanh hơn ở bước
                        đặt hàng.
                    </p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {addresses.map((addr) => (
                        <li key={addr.id}>
                            <Card
                                className={cn(
                                    "border-border/50 bg-background/60 shadow-none transition-colors",
                                    addr.is_default &&
                                        "ring-1 ring-primary/25",
                                )}
                            >
                                <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <MapPin className="h-5 w-5" />
                                        </span>
                                        <div className="min-w-0">
                                            <CardTitle className="text-base font-semibold">
                                                {addr.full_name}
                                                {addr.is_default ? (
                                                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                        <Star className="h-3 w-3" />
                                                        Mặc định
                                                    </span>
                                                ) : null}
                                            </CardTitle>
                                            <p className="mt-1 text-sm tabular-nums text-muted-foreground">
                                                {addr.phone}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 gap-1">
                                        {!addr.is_default ? (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                className="cursor-pointer text-primary"
                                                onClick={() =>
                                                    setDefault(addr.id)
                                                }
                                                aria-label="Đặt làm mặc định"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                            </Button>
                                        ) : null}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            className="cursor-pointer text-destructive hover:text-destructive"
                                            onClick={() => remove(addr.id)}
                                            aria-label="Xóa địa chỉ"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {addr.street}, {addr.ward},{" "}
                                        {addr.district}, {addr.province}
                                    </p>
                                </CardContent>
                            </Card>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
