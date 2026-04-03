"use client";

import { useEffect, useState } from "react";
import {
    CheckCircle2,
    MapPin,
    Plus,
    Star,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddAddressDialog } from "@/components/address/AddAddressDialog";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Address } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const supabase = createClient();

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
                <AddAddressDialog
                    open={open}
                    onOpenChange={setOpen}
                    isFirstAddress={addresses.length === 0}
                    onSuccess={(addr) => {
                        setAddresses((prev) => [...prev, addr]);
                        toast.success("Đã thêm địa chỉ");
                    }}
                    trigger={
                        <Button className="min-h-11 w-full cursor-pointer gap-2 sm:w-auto">
                            <Plus className="h-4 w-4" />
                            Thêm địa chỉ
                        </Button>
                    }
                />
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
