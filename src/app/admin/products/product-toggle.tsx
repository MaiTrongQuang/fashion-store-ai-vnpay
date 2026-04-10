"use client";

import { Switch } from "@/components/ui/switch";
import { toggleProductActive } from "@/app/admin/actions";
import { useTransition } from "react";
import { toast } from "sonner";

export function ProductToggle({ productId, isActive }: { productId: string; isActive: boolean }) {
    const [isPending, startTransition] = useTransition();

    return (
        <Switch
            checked={isActive}
            disabled={isPending}
            onCheckedChange={() => {
                startTransition(async () => {
                    try {
                        await toggleProductActive(productId);
                        toast.success(isActive ? "Đã ẩn sản phẩm" : "Đã hiện sản phẩm");
                    } catch { toast.error("Lỗi cập nhật"); }
                });
            }}
        />
    );
}
