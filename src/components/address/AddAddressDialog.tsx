"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { addressSchema, type AddressFormValues } from "@/lib/address-schema";
import { toast } from "sonner";
import type { Address } from "@/lib/types";

export interface AddAddressDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Nút mở dialog (Base UI: `render` trên DialogTrigger). */
    trigger: React.ReactElement;
    /**
     * Khi true, địa chỉ mới được đặt làm mặc định (vd. địa chỉ đầu tiên).
     */
    isFirstAddress?: boolean;
    /** Gọi sau khi lưu thành công; toast / cập nhật state do parent xử lý. */
    onSuccess?: (address: Address) => void;
    /** Mô tả phụ dưới tiêu đề. */
    description?: string;
}

const DEFAULT_DESCRIPTION =
    "Nhập thông tin người nhận và địa chỉ đầy đủ — dùng khi thanh toán và giao hàng.";

export function AddAddressDialog({
    open,
    onOpenChange,
    trigger,
    isFirstAddress = false,
    onSuccess,
    description = DEFAULT_DESCRIPTION,
}: AddAddressDialogProps) {
    const uid = useId();
    const field = (name: string) => `${uid}-${name}`;
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    const form = useForm<AddressFormValues>({
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

    const handleClose = (next: boolean) => {
        onOpenChange(next);
        if (!next) {
            form.reset();
        }
    };

    const onSubmit = async (data: AddressFormValues) => {
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
                is_default: isFirstAddress,
            })
            .select()
            .single();
        setSaving(false);

        if (error || !addr) {
            toast.error("Không thể thêm địa chỉ");
            return;
        }

        onSuccess?.(addr);
        handleClose(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogTrigger render={trigger} />
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
                            <DialogDescription>{description}</DialogDescription>
                        </div>
                    </DialogHeader>
                </div>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col"
                >
                    <div className="max-h-[min(60vh,480px)] space-y-6 overflow-y-auto px-6 py-5">
                        <fieldset className="space-y-4">
                            <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Người nhận
                            </legend>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor={field("name")}>
                                        Họ và tên
                                    </Label>
                                    <Input
                                        id={field("name")}
                                        autoComplete="name"
                                        aria-invalid={
                                            !!form.formState.errors.full_name
                                        }
                                        className="min-h-11 bg-background"
                                        {...form.register("full_name")}
                                    />
                                    {form.formState.errors.full_name && (
                                        <p
                                            className="text-xs text-destructive"
                                            role="alert"
                                        >
                                            {
                                                form.formState.errors.full_name
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={field("phone")}>
                                        Số điện thoại
                                    </Label>
                                    <Input
                                        id={field("phone")}
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
                                                form.formState.errors.phone
                                                    .message
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
                                    <Label htmlFor={field("province")}>
                                        Tỉnh / Thành phố
                                    </Label>
                                    <Input
                                        id={field("province")}
                                        autoComplete="address-level1"
                                        aria-invalid={
                                            !!form.formState.errors.province
                                        }
                                        className="min-h-11 bg-background"
                                        {...form.register("province")}
                                    />
                                    {form.formState.errors.province && (
                                        <p
                                            className="text-xs text-destructive"
                                            role="alert"
                                        >
                                            {
                                                form.formState.errors.province
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={field("district")}>
                                        Quận / Huyện
                                    </Label>
                                    <Input
                                        id={field("district")}
                                        autoComplete="address-level2"
                                        aria-invalid={
                                            !!form.formState.errors.district
                                        }
                                        className="min-h-11 bg-background"
                                        {...form.register("district")}
                                    />
                                    {form.formState.errors.district && (
                                        <p
                                            className="text-xs text-destructive"
                                            role="alert"
                                        >
                                            {
                                                form.formState.errors.district
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={field("ward")}>
                                        Phường / Xã
                                    </Label>
                                    <Input
                                        id={field("ward")}
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
                                                form.formState.errors.ward
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={field("street")}>
                                    Địa chỉ cụ thể
                                </Label>
                                <Input
                                    id={field("street")}
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
                            onClick={() => handleClose(false)}
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
    );
}
