"use client";

import { Switch } from "@/components/ui/switch";
import { toggleProductActive } from "@/app/admin/actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function ProductToggle({
    productId,
    isActive,
}: {
    productId: string;
    isActive: boolean;
}) {
    // Use local state so the row stays in place after toggle
    const [localActive, setLocalActive] = useState(isActive);
    const [isPending, startTransition] = useTransition();

    return (
        <Switch
            checked={localActive}
            disabled={isPending}
            onCheckedChange={() => {
                // Optimistic: flip local state immediately
                setLocalActive((prev) => !prev);
                startTransition(async () => {
                    try {
                        await toggleProductActive(productId);
                        toast.success(
                            localActive
                                ? "Đã ẩn sản phẩm"
                                : "Đã hiện sản phẩm"
                        );
                    } catch {
                        // Revert on error
                        setLocalActive((prev) => !prev);
                        toast.error("Lỗi cập nhật");
                    }
                });
            }}
        />
    );
}
